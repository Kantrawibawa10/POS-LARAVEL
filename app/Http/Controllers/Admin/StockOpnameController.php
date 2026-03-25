<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\StockOpnameRequest;
use App\Models\StockOpname;
use App\Models\StockTotal;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Models\Product;

class StockOpnameController extends Controller
{
    public function __construct()
    {
        // memastikan semua halaman admin hanya bisa diakses jika sudah login
        $this->middleware('auth:web');
    }
    /*
    |--------------------------------------------------------------------------
    | INDEX
    |--------------------------------------------------------------------------
    */
    public function index()
    {
        return inertia('Admin/StockOpnames/Index', [
            'stockOpnames' => StockOpname::latest()->paginate(10)
        ]);
    }

    /*
|--------------------------------------------------------------------------
| CREATE
|--------------------------------------------------------------------------
*/

public function create()
{
    $products = Product::with('stockTotal')->get();

    return inertia('Admin/StockOpnames/Create', [
        'products' => $products
    ]);
}

    /*
    |--------------------------------------------------------------------------
    | STORE
    |--------------------------------------------------------------------------
    */
    public function store(StockOpnameRequest $request)
    {
        DB::transaction(function () use ($request) {

            $opname = StockOpname::create([
                'opname_date' => $request->opname_date,
                'status' => 'pending',
            ]);

            foreach ($request->products as $item) {

                $stockTotal = StockTotal::where(
                    'product_id',
                    $item['product_id']
                )->firstOrFail();

                $system  = (int)$stockTotal->total_stock;
                $physical = (int)$item['physical_quantity'];

                // ✅ FINAL LOGIC
                $difference = $physical - $system;

                $opname->details()->create([
                    'product_id' => $item['product_id'],
                    'stock_total_id' => $stockTotal->id,
                    'physical_quantity' => $physical,
                    'quantity_difference' => $difference,
                ]);
            }
        });

        return redirect()->route('admin.stock-opnames.index')
            ->with('success','Stock opname created');
    }

    /*
    |--------------------------------------------------------------------------
    | UPDATE
    |--------------------------------------------------------------------------
    */
    public function update(Request $request, $id)
{
    $stockOpname = StockOpname::with('details')->findOrFail($id);

    if ($stockOpname->status === 'completed') {
        abort(403, 'Stock Opname Locked');
    }

    /* ================= HEADER ================= */
    $stockOpname->update([
        'opname_date' => $request->opname_date,
        'status'      => $request->status,
    ]);

    /* ================= DETAILS ================= */
    foreach ($request->products as $item) {

    $product = Product::with('stockTotal')
        ->findOrFail($item['product_id']);

    $stockTotal = $product->stockTotal;

    if (!$stockTotal) {
        abort(500, "Stock total tidak ditemukan untuk product ID {$product->id}");
    }

    $systemQty = (int) $stockTotal->total_stock;
    $physicalQty = (int) $item['physical_quantity'];

    $difference = $physicalQty - $systemQty;

    $detail = $stockOpname->details()
        ->where('product_id', $product->id)
        ->first();

    if ($detail) {

        $detail->update([
            'physical_quantity'    => $physicalQty,
            'quantity_difference' => $difference,
        ]);

    } else {

        $stockOpname->details()->create([
            'product_id'           => $product->id,
            'stock_total_id'       => $stockTotal->id,
            'physical_quantity'    => $physicalQty,
            'quantity_difference' => $difference,
        ]);

    }
}

    return back()->with('success', 'Stock Opname Updated');
}

    /*
|--------------------------------------------------------------------------
| EDIT
|--------------------------------------------------------------------------
*/

public function edit($id)
{
    $stockOpname = StockOpname::with([
        'details.product.stockTotal'
    ])->findOrFail($id);

    $products = Product::with('stockTotal')->get();

    return inertia('Admin/StockOpnames/Edit', [
        'stockOpname' => $stockOpname,
        'products' => $products,
    ]);
}

public function show($id)
{
    $stockOpname = StockOpname::with([
        'details.product.stockTotal'
    ])->findOrFail($id);

    return inertia(
        'Admin/StockOpnames/Show',
        [
            'stockOpname' => $stockOpname
        ]
    );
}

    /*
    |--------------------------------------------------------------------------
    | QUICK COMPLETE (LAKUKAN OPNAME)
    |--------------------------------------------------------------------------
    */
    public function complete(StockOpname $stockOpname)
    {
        DB::transaction(function () use ($stockOpname) {

            $stockOpname->load('details.stockTotal');

            foreach ($stockOpname->details as $detail) {
                $detail->stockTotal->update([
                    'total_stock' => $detail->physical_quantity
                ]);
            }

            $stockOpname->update([
                'status'=>'completed'
            ]);
        });

        return back()->with('success','Stock Opname Completed');
    }

    public function approve(StockOpname $stockOpname)
{
    if ($stockOpname->status !== 'pending') {
        return back()->with('error','Already processed');
    }

    DB::transaction(function () use ($stockOpname) {

        $stockOpname->load('details.product');

        foreach ($stockOpname->details as $detail) {
            $detail->product->update([
                'stock' => $detail->physical_quantity
            ]);
        }

        $stockOpname->update([
            'status' => 'completed'
        ]);
    });

    return redirect()
        ->route('admin.stock-opnames.edit', $stockOpname->id)
        ->with('success', 'Stock opname completed');
}

   /*
|--------------------------------------------------------------------------
| DESTROY
|--------------------------------------------------------------------------
*/

public function destroy($id)
{
    DB::transaction(function () use ($id) {

        $opname = StockOpname::findOrFail($id);

        // hapus detail dulu (jaga FK)
        $opname->details()->delete();

        $opname->delete();
    });

    return back()->with('success', 'Stock Opname deleted');
}
}