<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Barcode extends Model
{
    protected $fillable = [
        'stock_product_id',
        'barcode'
    ];

    public function stockProduct()
    {
        return $this->belongsTo(StockProduct::class);
    }
}

