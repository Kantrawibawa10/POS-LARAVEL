<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class LoginController extends Controller
{
    public function __construct()
    {
        // hanya guest yang boleh buka halaman login
        $this->middleware('guest:web')->only(['index', 'store']);
    }
    public function index()
    {
        return inertia('Auth/Login');
    }

    public function store(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ]);

        $credentials = $request->only('email', 'password');

        if (auth('web')->attempt($credentials)) {
            $request->session()->regenerate();

            return redirect()
                ->route('admin.dashboard')
                ->with([
                    'success' => 'Login berhasil!',
                    'user_name' => auth('web')->user()->name ?? auth('web')->user()->email,
                ]);
        }

        return back()->with([
            'error' => 'Email atau password salah.',
        ])->withErrors([
            'email' => 'Kredensial yang diberikan tidak sesuai.',
        ]);
    }
}
