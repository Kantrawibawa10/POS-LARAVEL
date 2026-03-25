<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Support\Str;
use Carbon\Carbon;


class Transaction extends Model
{
    protected $guarded = [];

    protected $fillable = [
    'customer_id',
    'user_id',
    'total_amount',
    'cash',
    'change',
    'discount',
    'total',
    'payment_method',
    'status',
];

    // Relasi dengan model Customer
    public function customer(){
        return $this->belongsTo(Customer::class);
    }

    // Relasi dengan model TransactionDetail
    public function transactionDetails() {
        return $this->hasMany(TransactionDetail::class);
    }

    // Event Boot untuk logika tambahan saat model di-create
    protected static function boot() {
        parent::boot();

        // Menambahkan logika khusus saat Transaksi dibuat
        static::creating(function ($transaction) {
            $transaction->invoice = 'INV-' . now()->format('His') . '-' . strtoupper(Str::random(5));

            // Menetapkan tanggal transaksi jika belum diisi

            if (empty($transaction->transaction_date)) {
                $transaction->transaction_date = Carbon::now();
            }
        });
    }
}
