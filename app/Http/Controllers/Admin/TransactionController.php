<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Cart;
use App\Models\Category;
use App\Models\Customer;
use App\Models\Product;
use App\Models\StockTotal;
use App\Models\Transaction;
use App\Models\TransactionDetail;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Midtrans\Config;
use Midtrans\Snap;

class TransactionController extends Controller
{
    public function __construct()
    {
        // memastikan semua halaman admin hanya bisa diakses jika sudah login
        $this->middleware('auth:web');
    }
    /**
     * Menampilkan halaman transaksi dan data terkait.
     */
    public function index(Request $request)
{
    $userId = Auth::id();

    $orderId = $request->input('order_id');
    $statusCode = $request->input('status_code');
    $transactionStatus = $request->input('transaction_status');

    /*
    |--------------------------------------------------------------------------
    | HANDLE SNAP CALLBACK
    |--------------------------------------------------------------------------
    */
    if ($orderId && $statusCode && $transactionStatus) {

        $transaction = Transaction::where('invoice', $orderId)->first();

        if ($transaction) {

            if ($statusCode == 200 && $transactionStatus == 'settlement') {
                $transaction->status = 'success';
            } elseif ($transactionStatus == 'pending') {
                $transaction->status = 'pending';
            } elseif ($transactionStatus == 'failed') {
                $transaction->status = 'failed';
            }

            $transaction->save();
        }

        return redirect()->route('admin.sales.index');
    }

    /*
    |--------------------------------------------------------------------------
    | DATA MASTER
    |--------------------------------------------------------------------------
    */
    $customers = Customer::all();
    $categories = Category::all();

    /*
    |--------------------------------------------------------------------------
    | PRODUCTS + INNER JOIN STOCK
    |--------------------------------------------------------------------------
    */
    $products = Product::select(
            'products.*',
            'stock_totals.total_stock as stock'
        )
        ->leftJoin(
            'stock_totals',
            'products.id',
            '=',
            'stock_totals.product_id'
        )
        ->get();

    /*
    |--------------------------------------------------------------------------
    | CART USER
    |--------------------------------------------------------------------------
    */
    $carts = Cart::with('product')
        ->where('user_id', $userId)
        ->orderBy('created_at', 'desc')
        ->get()
        ->map(function ($item) {
            return [
                'id' => $item->id,
                'product_id' => $item->product_id,
                'name' => $item->product->name,
                'quantity' => $item->quantity,
                'total_price' => $item->total_price,
                'selling_price' => $item->product->selling_price,
            ];
        });

    /*
    |--------------------------------------------------------------------------
    | PAYMENT LINK
    |--------------------------------------------------------------------------
    */
    $payment_link_url = $request->input('payment_link_url', null);

    /*
    |--------------------------------------------------------------------------
    | RETURN TO FRONTEND
    |--------------------------------------------------------------------------
    */
    return Inertia::render('Admin/Transactions/Index', [
        'customers' => $customers,
        'products' => $products,
        'categories' => $categories,
        'carts' => $carts,
        'payment_link_url' => $payment_link_url,
    ]);
}

    /**
     * Menambahkan produk ke keranjang dengan validasi stok.
     */
    public function addProductToCart(Request $request)
{
    $validated = $request->validate([
        'customer_id' => 'nullable|exists:customers,id',
        'product_id' => 'required|exists:products,id',
        'quantity' => 'required|integer|min:1',
        'total_price' => 'required|numeric|min:1000',
    ]);

    $userId = Auth::id();

    if (!$userId) {
        return redirect()->route('login');
    }

    /*
    |--------------------------------------------------------------------------
    | GET PRODUCT STOCK
    |--------------------------------------------------------------------------
    */

    $productStock = StockTotal::where('product_id', $validated['product_id'])
        ->value('total_stock');

    // jika tidak ada record stock
    if ($productStock === null) {
        return back()->withErrors([
            'stock' => 'Stok produk belum tersedia di gudang.'
        ]);
    }

    if ($productStock <= 0) {
        return back()->withErrors([
            'stock' => 'Stok produk sudah habis.'
        ]);
    }

    /*
    |--------------------------------------------------------------------------
    | CHECK CART EXISTING QUANTITY
    |--------------------------------------------------------------------------
    */

    $existingCart = Cart::where('user_id', $userId)
        ->where('product_id', $validated['product_id'])
        ->first();

    $existingQty = $existingCart ? $existingCart->quantity : 0;

    $newQty = $existingQty + $validated['quantity'];

    /*
    |--------------------------------------------------------------------------
    | STOCK VALIDATION
    |--------------------------------------------------------------------------
    */

    if ($newQty > $productStock) {

        return back()->withErrors([
            'quantity' => "Stok tidak mencukupi. Stok tersedia: {$productStock}"
        ]);
    }

    /*
    |--------------------------------------------------------------------------
    | UPDATE / CREATE CART
    |--------------------------------------------------------------------------
    */

    if ($existingCart) {

        $existingCart->update([
            'quantity' => $newQty,
            'total_price' => $existingCart->total_price + $validated['total_price'],
            'customer_id' => $validated['customer_id'] ?? $existingCart->customer_id
        ]);

    } else {

        Cart::create([
            'user_id' => $userId,
            'customer_id' => $validated['customer_id'] ?? null,
            'product_id' => $validated['product_id'],
            'quantity' => $validated['quantity'],
            'total_price' => $validated['total_price'],
        ]);

    }

    return back()->with('success', 'Produk berhasil ditambahkan ke cart.');
}

    /**
     * Memproses pembayaran (cash/online) dan menghapus cart jika proses berhasil.
     */
    public function processPayment(Request $request)
{
    DB::beginTransaction();

    try {

        $request->validate([
            'cart_items' => 'required|array|min:1',
        ]);

        $cartItems = $request->input('cart_items');

        // ✅ Buat transaksi dulu
        $transaction = Transaction::create([
            'customer_id'    => $request->customer_id,
            'user_id'       => Auth::id(), // WAJIB
            'total_amount'   => $request->total_amount,
            'cash'           => $request->cash,
            'change'         => $request->change,
            'discount'       => $request->discount ?? 0,
            'payment_method' => $request->payment_method,
            'status'         => 'success',
        ]);

        if (!$transaction) {
            throw new \Exception("Gagal membuat transaksi.");
        }

        // ✅ Loop cart items
        foreach ($cartItems as $item) {

            $productId = $item['product_id'] ?? $item['id'];

            $stockRow = StockTotal::where('product_id', $productId)->first();

            if (!$stockRow) {
                throw new \Exception("Stock tidak ditemukan untuk produk ID {$productId}");
            }

            $product = Product::find($productId);

            if ($stockRow->total_stock < $item['quantity']) {

                $productName = $product ? $product->name : 'Produk';
                $stock = $stockRow->total_stock;

                throw new \Exception(
                    "Stok {$productName} tidak mencukupi. Sisa stok: {$stock}"
                );
            }

            // Kurangi stock
            $stockRow->decrement('total_stock', $item['quantity']);

            $product = Product::findOrFail($productId);

            $detail = TransactionDetail::create([
                'transaction_id' => $transaction->id,
                'product_id'     => $product->id,
                'product_name'   => $product->name,
                'quantity'       => $item['quantity'],
                'subtotal'       => $item['total_price'],
            ]);

            if (!$detail) {
                throw new \Exception("Gagal menyimpan detail transaksi.");
            }
        }

        // Hapus cart user
        Cart::where('user_id', Auth::id())->delete();

        DB::commit();

        return redirect()
            ->route('admin.sales.index')
            ->with('success', true);

    } catch (\Throwable $e) {

    DB::rollBack();

    return back()->withErrors([
        'payment' => $e->getMessage()
    ]);
}

}

    /**
     * Membuat Snap Token dari Midtrans.
     */
    protected function createMidtransTransaction($transaction)
    {
        Config::$serverKey = config('services.midtrans.server_key');
        Config::$isProduction = config('services.midtrans.is_production');
        Config::$isSanitized = true;
        Config::$is3ds = true;

        $amountAfterDiscount = $transaction->total_amount - $transaction->discount;

        $finalAmount = max(0, $amountAfterDiscount);

        $params = [
            'transaction_details' => [
                'order_id' => $transaction->invoice,
                'gross_amount' => $finalAmount,
            ],
            'customer_details' => [
                'first_name' => $transaction->customer->name ?? 'Guest',
                'email' => $transaction->customer->email ?? 'guest@example.com',
            ],
            'item_details' => $transaction->transactionDetails->map(function ($detail) {
                return [
                    'id' => $detail->product_id,
                    'price' => $detail->subtotal / $detail->quantity,
                    'quantity' => $detail->quantity,
                    'name' => $detail->product_name,
                ];
            })->toArray(),
        ];

        if ($transaction->discount > 0) {
            $params['item_details'][] = [
                'id' => 'DISCOUNT',
                'price' => -$transaction->discount,
                'quantity' => 1,
                'name' => 'Discount',
            ];
        }

        $params['callbacks'] = [
            'finish' => route('admin.sales.index'),
        ];

        $snapToken = Snap::getSnapToken($params);
        $transaction->update(['payment_link_url' => $snapToken]);

        return $snapToken;
    }

    public function updateQty(Request $request, $id)
    {
        $request->validate([
            'quantity' => 'required|integer|min:1'
        ]);

        $cart = Cart::findOrFail($id);
        $product = Product::findOrFail($cart->product_id);

        $cart->quantity = $request->quantity;
        $cart->total_price = $request->quantity * $product->selling_price;
        $cart->save();

        $carts = Cart::with('product')
            ->where('user_id', Auth::id())
            ->get()
            ->map(function ($item) {
                return [
                    'id' => $item->id,
                    'product_id' => $item->product_id,
                    'name' => $item->product->name,
                    'quantity' => $item->quantity,
                    'total_price' => $item->total_price,
                    'selling_price' => $item->product->selling_price,
                ];
            });

        return back()->with(['carts' => $carts]);
    }

    /**
     * Menghapus item dari keranjang berdasarkan ID.
     */
    public function deleteFromCart($id)
    {
        $cartItem = Cart::find($id);
        if ($cartItem) {
            $cartItem->delete();
            return redirect()->back();
        }
        return redirect()->back();
    }
}