<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Transaction;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;

class ReportController extends Controller
{

    public function __construct()
    {
        // memastikan semua halaman admin hanya bisa diakses jika sudah login
        $this->middleware('auth:web');
    }

    public function index()
    {
        // Tampilkan halaman awal dengan transactions kosong.
        return Inertia::render('Admin/Report/Index', [
            'transactions' => [],
        ]);
    }

 public function generate(Request $request)
{
    $request->validate([
        'start_date' => 'required|date',
        'end_date'   => 'required|date|after_or_equal:start_date',
    ]);

    $startDateTime = $request->start_date . ' 00:00:00';
    $endDateTime   = $request->end_date   . ' 23:59:59';

    $reports = DB::table('transactions')
        ->join(
            'transaction_details',
            'transactions.id',
            '=',
            'transaction_details.transaction_id'
        )
        ->join(
            'products',
            'transaction_details.product_id',
            '=',
            'products.id'
        )

        // ✅ JOIN CUSTOMER (INI YANG HILANG)
        ->leftJoin(
            'customers',
            'transactions.customer_id',
            '=',
            'customers.id'
        )

        ->whereBetween(
            'transactions.transaction_date',
            [$startDateTime, $endDateTime]
        )

        ->select(
            'transactions.id',
            'transactions.transaction_date',
            'transactions.status',
            'transactions.invoice',
            'transactions.discount',
            'customers.name as customer_name', // ✅ ambil customer
            'products.name as product_name',
            'products.cost_price',
            'products.selling_price',
            'transaction_details.quantity',
            'transaction_details.subtotal'
        )

        ->orderBy('transactions.transaction_date', 'desc')
        ->get()

        ->map(function ($row) {

            $subtotalBarang = $row->subtotal ?? 0;
            $diskon = $row->discount ?? 0;

            $subtotalSetelahDiskon = $subtotalBarang - $diskon;

            return [
                'id' => $row->id,
                'tanggal' => $row->transaction_date,
                'invoice' => $row->invoice,

                // ✅ CUSTOMER FIX
                'customer' => $row->customer_name ?? '-',

                'product_name' => $row->product_name,
                'cost_price' => $row->cost_price,
                'selling_price' => $row->selling_price,
                'quantity' => $row->quantity,

                'discount' => $diskon,
                'subtotal_barang' => $subtotalBarang,
                'subtotal_setelah_diskon' => $subtotalSetelahDiskon,
                'total_final' => $subtotalSetelahDiskon,

                // ✅ STATUS NORMALIZATION
                'status' => strtolower(trim($row->status ?? 'pending')),
            ];
        });

    return Inertia::render('Admin/Report/Index', [
        'reports'    => $reports,
        'start_date' => $request->start_date,
        'end_date'   => $request->end_date,
    ]);
}

}
