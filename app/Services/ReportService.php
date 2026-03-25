<?php

namespace App\Services;

use Illuminate\Support\Facades\DB;

class ReportService
{
    public function getTransactionReport($startDate, $endDate)
    {
        return DB::table('transactions as t')
            ->join('transaction_details as d', 't.id', '=', 'd.transaction_id')
            ->join('products as p', 'd.product_id', '=', 'p.id')
            ->leftJoin('customers as c', 't.customer_id', '=', 'c.id')

            ->whereBetween('t.transaction_date', [
                $startDate . ' 00:00:00',
                $endDate . ' 23:59:59'
            ])

            ->orderByDesc('t.transaction_date')

            ->select([
                't.id',
                't.invoice',
                't.transaction_date',
                't.payment_method',

                // ✅ normalize status
                DB::raw('LOWER(TRIM(t.status)) as status'),

                // ✅ customer fallback
                DB::raw('COALESCE(c.name, "Guest") as customer'),

                'p.name as product',
                'd.quantity as qty',
                'p.selling_price as price',

                // subtotal per item
                DB::raw('(p.selling_price * d.quantity) as subtotal'),

                't.discount',

                // ✅ final total TANPA double discount
                DB::raw('
                    (p.selling_price * d.quantity)
                    - (
                        t.discount /
                        NULLIF(
                            COUNT(d.id) OVER(PARTITION BY t.id),
                            0
                        )
                    ) as final_total
                ')
            ])

            ->get()
            ->map(function ($row) {

                return [
                    'invoice' => $row->invoice,
                    'tanggal' => $row->transaction_date,
                    'customer' => $row->customer,
                    'product' => $row->product,
                    'qty' => (int) $row->qty,
                    'price' => (float) $row->price,
                    'subtotal' => (float) $row->subtotal,
                    'discount' => (float) $row->discount,
                    'final_total' => (float) $row->final_total,
                    'payment_method' => $row->payment_method,

                    // ✅ guaranteed frontend compatible
                    'status' => $row->status ?: 'pending',
                ];
            });
    }
}