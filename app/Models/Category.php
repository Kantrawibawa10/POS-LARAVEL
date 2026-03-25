<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Category extends Model
{
    use HasFactory;

    protected $guarded = [];

    /**
     * Relasi ke produk (WAJIB supaya bisa cek sebelum hapus)
     */
    public function products()
    {
        return $this->hasMany(Product::class);
    }
}
