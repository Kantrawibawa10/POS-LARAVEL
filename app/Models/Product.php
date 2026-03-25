<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Casts\Attribute;

class Product extends Model
{
    protected $guarded = [];
    protected $fillable = [
        'name',
        'production_code',
        'category_id',
        'unit_id',
        'cost_price',
        'selling_price',
        'image',
    ];

    // Relasi Ke Model Category. Satu Produk Hanya Memiliki Satu Kategori

    public function category()
    {
        return $this->belongsTo(Category::class);
    }

    // Relasi Ke Model Stock Total. Satu Produk Memiliki satu total stok.

    public function stockTotal() {
        return $this->hasOne(StockTotal::class);
    }

    // Aksesors Untuk Mendapatkan URL Gambar Produk.

    protected function image(): Attribute {
        return Attribute::make(
            get: fn($image) => url('/storage/products/' . $image)
        );
    }

    public function stockIns()
    {
        return $this->hasMany(StockProduct::class);
    }

    public function transactionDetails()
    {
        return $this->hasMany(TransactionDetail::class);
    }

    public function stockProducts()
{
    return $this->hasMany(StockProduct::class, 'product_id');
}

 public function stockOpnameDetails()
    {
        return $this->hasMany(StockOpnameDetail::class);
    }
}
