<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Cart;
use Illuminate\Http\Request;

class CartController extends Controller
{
    public function increase($id)
    {
        $cart = Cart::findOrFail($id);

        $cart->quantity += 1;
        $cart->total_price = $cart->quantity * $cart->selling_price;
        $cart->save();

        return response()->json($cart);
    }

    public function decrease($id)
    {
        $cart = Cart::findOrFail($id);

        if ($cart->quantity > 1) {
            $cart->quantity -= 1;
            $cart->total_price = $cart->quantity * $cart->selling_price;
            $cart->save();
        }

        return response()->json($cart);
    }
}
