<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;

class PwaController extends Controller
{
    public function status(Request $request)
    {
        return response()->json([
            'name' => config('app.name'),
            'short_name' => config('app.name'),
            'start_url' => '/',
            'display' => 'standalone',
            'background_color' => '#ffffff',
            'theme_color' => '#0d6efd'
        ]);
    }
}
