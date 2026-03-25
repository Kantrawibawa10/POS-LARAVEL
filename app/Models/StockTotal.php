<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class StockTotal extends Model
{
    protected $guarded = [];

    public function product() {
        return $this->belongsTo(Product::class);
    }
}
