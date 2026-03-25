<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Product;
use Illuminate\Support\Facades\DB;
use Barryvdh\DomPDF\Facade\Pdf;
use Maatwebsite\Excel\Facades\Excel;
use App\Exports\StockCardExport;

class StockCardController extends Controller
{
    public function __construct()
    {
        // memastikan semua halaman admin hanya bisa diakses jika sudah login
        $this->middleware('auth:web');
    }

    public function index()
{
    $products = Product::select(['id','name','cost_price'])
        ->orderBy('name')
        ->get();

    // ================= STOCK IN (SUPPLIER) =================
    $stockIn = DB::table('stock_products')
        ->join('products', 'products.id', '=', 'stock_products.product_id')
        ->leftJoin('suppliers', 'suppliers.id', '=', 'stock_products.supplier_id')
        ->select(
            'stock_products.id',
            'stock_products.received_at as date',
            'products.id as product_id',
            'products.production_code',
            'products.name',
            'products.cost_price', // ✅ TAMBAHAN
            DB::raw('stock_products.stock_quantity as stock_in'),
            DB::raw('0 as stock_out'),
            DB::raw('suppliers.name as supplier_name'),
            DB::raw('NULL as customer_name')
        );

    // ================= STOCK OUT (CUSTOMER) =================
    $stockOut = DB::table('transaction_details')
        ->join('products', 'products.id', '=', 'transaction_details.product_id')
        ->leftJoin('transactions', 'transactions.id', '=', 'transaction_details.transaction_id')
        ->leftJoin('customers', 'customers.id', '=', 'transactions.customer_id')
        ->select(
            'transaction_details.id',
            'transaction_details.created_at as date',
            'products.id as product_id',
            'products.production_code',
            'products.name',
            'products.cost_price', // ✅ TAMBAHAN
            DB::raw('0 as stock_in'),
            DB::raw('transaction_details.quantity as stock_out'),
            DB::raw('NULL as supplier_name'),
            DB::raw('customers.name as customer_name')
        );

    // ================= UNION =================
    $stockCards = $stockIn
        ->unionAll($stockOut)
        ->orderBy('date', 'asc')
        ->get();

    return inertia('Admin/StockCards/Index', [
        'products' => $products,
        'stockCards' => $stockCards,
    ]);
}

    /** ============================
     * EXPORT PDF (BENAR & TIDAK KOSONG)
     * ============================ */
    public function exportPdf(Request $request)
    {
        $productId = $request->product_id;

        $product = Product::findOrFail($productId);

        $history = DB::table('products')
            ->leftJoin('stock_products', 'products.id', '=', 'stock_products.product_id')
            ->leftJoin('transaction_details', 'products.id', '=', 'transaction_details.product_id')
            ->where('products.id', $productId)
            ->select(
                'products.name',
                'products.barcode',
                'stock_products.received_at',
                DB::raw('COALESCE(stock_products.stock_quantity, 0) as stock_in'),
                DB::raw('COALESCE(transaction_details.quantity, 0) as stock_out'),
                DB::raw('
                    COALESCE(stock_products.stock_quantity, 0)
                    -
                    COALESCE(transaction_details.quantity, 0)
                    as total_stock
                ')
            )
            ->orderBy('stock_products.received_at','asc')
            ->get();

        $pdf = Pdf::loadView('admin.stockcards.pdf', [
            'product' => $product,
            'history' => $history,
            'printed_at' => now()->format('d-m-Y H:i:s'),
        ])->setPaper('a4', 'landscape');

        return $pdf->download("kartu-stok-{$product->name}.pdf");
    }

    /** ============================
     * EXPORT EXCEL (CSV YANG RAPI)
     * ============================ */
    public function exportExcel(Request $request)
    {
        $productId = $request->product_id;

        $history = DB::table('products')
            ->leftJoin('stock_products', 'products.id', '=', 'stock_products.product_id')
            ->leftJoin('transaction_details', 'products.id', '=', 'transaction_details.product_id')
            ->where('products.id', $productId)
            ->select(
                'products.name',
                'products.barcode',
                'stock_products.received_at',
                DB::raw('COALESCE(stock_products.stock_quantity, 0) as stock_in'),
                DB::raw('COALESCE(transaction_details.quantity, 0) as stock_out'),
                DB::raw('
                    COALESCE(stock_products.stock_quantity, 0)
                    -
                    COALESCE(transaction_details.quantity, 0)
                    as total_stock
                ')
            )
            ->orderBy('stock_products.received_at','asc')
            ->get();

        $csv = "Tanggal,Barcode,Stock In,Stock Out,Total\n";

        foreach ($history as $row) {
            $csv .= "{$row->received_at},{$row->barcode},{$row->stock_in},{$row->stock_out},{$row->total_stock}\n";
        }

        return response($csv)
            ->header('Content-Type', 'text/csv')
            ->header('Content-Disposition', 'attachment; filename=kartu-stok.csv');
    }

    public function show($id)
    {
        abort(404, 'Detail kartu stok belum tersedia.');
    }
}
