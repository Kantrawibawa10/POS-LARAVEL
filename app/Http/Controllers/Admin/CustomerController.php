<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\CustomerRequest;
use App\Models\Customer;
use Illuminate\Http\Request;

class CustomerController extends Controller
{
    public function __construct()
    {
        // memastikan semua halaman admin hanya bisa diakses jika sudah login
        $this->middleware('auth:web');
    }

    /**
     * Tampilkan daftar customer.
     */
    public function index()
    {

    $search = request('q');

        // Ambil data customer, jika ada parameter pencarian 'q', filter berdasarkan nama customer saja
    $customers = Customer::query()
        ->when($search, fn ($query) =>
            $query->where('name', 'like', "%{$search}%")
            ->orWhere('phone', 'like', "%{$search}%")
            ->orWhere('email', 'like', "%{$search}%")
            ->orWhere('address', 'like', "%{$search}%")
        )
        ->latest()
        ->paginate(10)
        ->withQueryString();

        // Kembalikan data ke komponen Inertia 'Admin/Customers/Index'
        return inertia('Admin/Customers/Index', [
            'customers' => $customers,
            'filters' => [
            'q' => $search,
        ],
        ]);
    }

    /**
     * Tampilkan form untuk membuat customer baru.
     */
    public function create()
    {
        // Kembalikan ke tampilan Inertia 'Admin/Customers/Create'
        return inertia('Admin/Customers/Create');
    }

    /**
     * Simpan customer baru ke dalam database.
     */
    public function store(CustomerRequest $request)
    {
        // Buat customer baru berdasarkan input yang telah divalidasi
        Customer::create($request->validated());

        // Arahkan kembali ke indeks customer dengan pesan sukses
        return redirect()->route('admin.customers.index');
    }

    /**
     * Tampilkan form untuk mengedit customer tertentu.
     */
    public function edit($id)
    {
        // Ambil data customer berdasarkan ID, akan error jika tidak ditemukan
        $customer = Customer::findOrFail($id);

        // Kembalikan data customer ke Inertia 'Admin/Customers/Edit'
        return inertia('Admin/Customers/Edit', [
            'customer' => $customer
        ]);
    }

    /**
     * Perbarui data customer yang sudah ada di database.
     */
    public function update(CustomerRequest $request, Customer $customer)
    {
        // Perbarui customer dengan data yang telah divalidasi
        $customer->update($request->validated());

        // Arahkan kembali ke indeks customer dengan pesan sukses
        return redirect()->route('admin.customers.index');
    }

    /**
     * Hapus customer dari database.
     */
    public function destroy($id)
    {
        // Ambil customer berdasarkan ID, error jika tidak ditemukan
        $customer = Customer::findOrFail($id);

        // Hapus customer tersebut
        $customer->delete();

        // Arahkan kembali ke indeks customer dengan pesan sukses
        return redirect()->route('admin.customers.index');
    }
}
