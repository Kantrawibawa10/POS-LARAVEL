<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Product;
use App\Models\Supplier;
use App\Models\StockProduct;
use App\Http\Requests\ProductStockRequest;
use App\Models\StockTotal;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Milon\Barcode\Facades\DNS1DFacade as DNS1D;

class ProductStockController extends Controller
{

    public function __construct()
    {
        // memastikan semua halaman admin hanya bisa diakses jika sudah login
        $this->middleware('auth:web');
    }

    public function index(Request $request)
{
    $productStocks = StockProduct::with([
            'product:id,name,production_code',
            'supplier:id,name',
            'barcodes:id,stock_product_id,barcode'
        ])
        ->when($request->q, function ($query, $q) {
    $query->where(function ($qBuilder) use ($q) {
        $qBuilder
            ->whereHas('supplier', fn ($s) =>
                $s->where('name', 'like', "%{$q}%")
            )
            ->orWhereHas('product', fn ($p) =>
                $p->where('name', 'like', "%{$q}%")
            );
    });
})
        ->orderByRaw('COALESCE(received_at, created_at) DESC')
        ->paginate(10)
        ->withQueryString();

    return inertia('Admin/ProductStocks/Index', [
        'productStocks' => $productStocks,
        'suppliers' => Supplier::select('id','name')->get(),
        'filters' => ['q' => $request->q],
    ]);
}

    public function create(Request $request)
{
    return inertia('Admin/ProductStocks/Create', [
        // Ambil produk dan hitung stok real-time dari tabel stock_totals
        // Kita asumsikan tabel stock_totals selalu sinkron dengan stok masuk & keluar
        'products_all' => Product::select('id','name','production_code')
            ->with(['stockTotal' => function($query) {
                $query->select('product_id', 'total_stock');
            }])
            ->get()
            ->map(function($product) {
                return [
                    'id' => $product->id,
                    'name' => $product->name,
                    'production_code' => $product->production_code,
                    'current_stock' => $product->stockTotal ? $product->stockTotal->total_stock : 0
                ];
            }),

        'suppliers' => Supplier::select('id','name')->get(),
    ]);
}

public function store(ProductStockRequest $request)
{
    DB::transaction(function () use ($request) {

        $data = $request->validated();

        // received_at akan tersimpan sesuai input user
        // created_at & updated_at otomatis oleh Laravel

        $stock = StockProduct::create($data);

        $stockTotal = StockTotal::firstOrCreate(
            ['product_id' => $stock->product_id],
            ['total_stock' => 0]
        );

        $stockTotal->increment('total_stock', $stock->stock_quantity);

        $product = Product::findOrFail($stock->product_id);

        for ($i = 0; $i < $stock->stock_quantity; $i++) {
            $stock->barcodes()->create([
                'barcode' => $this->generateBarcode($product->production_code),
            ]);
        }

    });

    return redirect()
        ->route('admin.stocks.index')
        ->with('success', 'Stok berhasil ditambahkan.');
}

public function edit($id)
{
    $productStock = StockProduct::findOrFail($id);

    return inertia('Admin/ProductStocks/Edit', [
        'productStock' => $productStock,
        'products' => Product::with('stockTotal')->get(),
        'suppliers' => Supplier::get(),
    ]);
}

public function update(Request $request, $id)
{
    $productStock = StockProduct::findOrFail($id);

    $productStock->update([
        'stock_quantity' => $request->stock_quantity,
        'supplier_id' => $request->supplier_id,
        'received_at' => $request->received_at,
    ]);

    return redirect()
        ->route('admin.stocks.index')
        ->with('success', 'Stock updated successfully');
}

private function generateBarcode(string $productionCode): string
{
    do {
        $barcode = $productionCode . random_int(100, 999);
    } while (
        DB::table('barcodes')->where('barcode', $barcode)->exists()
    );

    return $barcode;
}

public function downloadBarcode($id)
{
    $barcode = DB::table('barcodes')->find($id);

    abort_if(!$barcode, 404);

    $png = DNS1D::getBarcodePNG($barcode->barcode, 'C128');

    return response(base64_decode($png))
        ->header('Content-Type', 'image/png')
        ->header(
            'Content-Disposition',
            'attachment; filename="barcode-'.$barcode->barcode.'.png"'
        );
}

    public function destroy($id)
    {
        // Mulai transaksi database untuk memastikan konsistensi data
        DB::beginTransaction();

        try {
            // Cari StockProduct berdasarkan ID yang diberikan. Jika tidak ditemukan, akan melemparkan ModelNotFoundException
            $stockProduct = StockProduct::findOrFail($id);

            // Cari StockTotal yang terkait dengan product_id dari StockProduct
            $stockTotal = StockTotal::where('product_id', '=', $stockProduct->product_id)->first();

            if ($stockTotal) {
                // Kurangi total_stock dengan stock_quantity dari StockProduct yang akan dihapus
                $stockTotal->total_stock -= $stockProduct->stock_quantity;

                // Pastikan total_stock tidak menjadi negatif
                if ($stockTotal->total_stock < 0) {
                    $stockTotal->total_stock = 0;
                }

                // Simpan perubahan pada StockTotal
                $stockTotal->save();
            }

            // Hapus record StockProduct dari database
            $stockProduct->forceDelete();

            // Commit transaksi jika semua operasi berhasil
            DB::commit();

            // Kembali ke daftar product stock dengan pesan sukses
            return redirect()->route('admin.stocks.index');
        } catch (\Exception $e) {
            // Rollback transaksi jika terjadi kesalahan
            DB::rollBack();

            // Kembali ke daftar product stock dengan pesan error
            return redirect()->route('admin.stocks.index');
        }
    }
}
