<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class StockProduct extends Model
{
    protected $guarded = [];
    protected $fillable = [
        'product_id',
        'supplier_id',
        'stock_quantity',
        'received_at',
    ];
    protected $casts = [
    'received_at' => 'datetime', // atau 'date'
    ];
    
    // Relasi Ke Model Product. Satu Stock product hanya terkait dengan satu produk.
    public function product() {
        return $this->belongsTo(Product::class);
    }

    public function barcodes()
    {
        return $this->hasMany(Barcode::class, 'stock_product_id');
    }

    // Relasi ke model Supplier. Satu Stock Product hanya terkait dengan satu supplier.

    public function supplier() {
        return $this->belongsTo(Supplier::class);
    }
}
