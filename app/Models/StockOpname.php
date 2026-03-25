<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class StockOpname extends Model
{
    protected $fillable = ['opname_date', 'status'];

    public function details()
    {
        return $this->hasMany(StockOpnameDetail::class);
    }

    public function stockTotal()
{
    return $this->belongsTo(StockTotal::class);
}
}

