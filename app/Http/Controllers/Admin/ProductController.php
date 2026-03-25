<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\ProductRequest; // Form Request khusus untuk validasi produk
use App\Models\Product; // Model untuk tabel produk
use App\Models\Category; // Model untuk tabel kategori
use App\Models\Unit; // Model untuk tabel unit
use App\Traits\ImageHandlerTrait; // Trait untuk menangani operasi gambar
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class ProductController extends Controller
{
    use ImageHandlerTrait;

    /**
     * Tampilkan daftar produk.
     *
     * @return \Inertia\Response
     */

    public function __construct()
    {
        // memastikan semua halaman admin hanya bisa diakses jika sudah login
        $this->middleware('auth:web');
    }

    public function index(Request $request)
    {
        $products = Product::with(['category', 'stockTotal'])
            ->when($request->q, function ($query, $q) {
                $query->where('name', 'like', "%{$q}%");
            })
            ->latest()
            ->paginate(10)
            ->withQueryString()
            ->through(function ($product) {

                $imagePath = $product->image ? 'products/' . $product->image : null;

                $product->image_url = ($imagePath && Storage::disk('public')->exists($imagePath))
                    ? asset('storage/' . $imagePath)
                    : asset('assets/images/produk.png');

                return $product;
            });

        return inertia('Admin/Products/Index', [
            'products' => $products,
            'filters' => [
                'q' => $request->q,
            ],
        ]);
    }

    /**
     * Tampilkan form untuk membuat produk baru.
     *
     * @return \Inertia\Response
     */
    public function create()
    {
        // Ambil semua kategori dan unit dari database.
        $categories = Category::all();
        $units = Unit::all();

        $lastProduct = Product::latest('id')->first();
        $nextId = $lastProduct ? $lastProduct->id + 1 : 1;

        $barcode = date('ymd') . str_pad($nextId, 6, '0', STR_PAD_LEFT);

        // Kirim data kategori dan unit ke komponen Inertia 'Admin/Products/Create'.
        return inertia('Admin/Products/Create', [
            'categories' => $categories,
            'units' => $units,
            'barcode' => $barcode,
        ]);
    }

    /**
     * Simpan produk baru ke dalam database.
     *
     * @param  \App\Http\Requests\ProductRequest  $request
     * @return \Illuminate\Http\RedirectResponse
     */
    public function store(ProductRequest $request)
    {
        $data = $request->validated();

        if ($request->hasFile('image')) {
            $image = $request->file('image');
            $filename = uniqid() . '.' . $image->getClientOriginalExtension();
            $image->storeAs('products', $filename, 'public');
            $data['image'] =  $filename;
        }

        $product = Product::create($data);

        return redirect()
            ->route('admin.products.index')
            ->with('success', 'Product berhasil ditambahkan');
    }

    /**
     * Tampilkan form untuk mengedit produk tertentu.
     *
     * @param  \App\Models\Product  $product
     * @return \Inertia\Response
     */
    public function edit(Product $product)
    {
        $categories = Category::all();
        $units = Unit::all();

        return inertia('Admin/Products/Edit', [
            'product' => $product,
            'categories' => $categories,
            'units' => $units,
            'image_url' => $product->image
                ? asset('storage/' . $product->image)
                : null,
        ]);
    }

    /**
     * Perbarui data produk dalam database.
     *
     * @param  \App\Http\Requests\ProductRequest  $request
     * @param  \App\Models\Product  $product
     * @return \Illuminate\Http\RedirectResponse
     */

    public function update(ProductRequest $request, Product $product)
    {
        // Jika ada file gambar baru yang diunggah, perbarui gambar dan hapus gambar lama.
        if ($request->hasFile('image')) {
            $product->update([
                'image' => $this->updateImage(
                    $product->image,
                    $request->file('image'),
                    'products'
                )
            ]);
        }

        // Perbarui data produk dengan data yang diterima dari permintaan.
        $product->name = $request->name;
        // $product->barcode = $request->barcode;
        $product->category_id = $request->category_id;
        $product->unit_id = $request->unit_id;
        $product->production_code = $request->production_code;
        $product->cost_price = $request->cost_price;
        $product->selling_price = $request->selling_price;
        $product->save();

        // Arahkan pengguna kembali ke halaman daftar produk dengan pesan sukses.
        return redirect()->route('admin.products.index');
    }

//     public function update(ProductRequest $request, Product $product)
// {
//     $data = $request->validated();

//     if ($request->hasFile('image')) {

//         // 🔥 HAPUS FILE LAMA
//         if ($product->image && Storage::disk('public')->exists($product->image)) {
//             Storage::disk('public')->delete($product->image);
//         }

//         // 🔥 SIMPAN FILE BARU TANPA FOLDER PRODUCTS
//         $image = $request->file('image');
//         $filename = uniqid() . '.' . $image->getClientOriginalExtension();
//         $image->storeAs('products', $filename, 'public');
//         $data['image'] =  $filename;
//     }

//     $product->update($data);

//     return redirect()
//         ->route('admin.products.index')
//         ->with('success', 'Product berhasil diperbarui');
// }



    /**
     * Hapus produk dari database.
     *
     * @param  \App\Models\Product  $product
     * @return \Illuminate\Http\RedirectResponse
     */
    public function destroy(Product $product)
    {
        if ($product->image && Storage::disk('public')->exists($product->image)) {
            Storage::disk('public')->delete($product->image);
        }

        $product->delete();

        return redirect()
            ->route('admin.products.index')
            ->with('success', 'Product berhasil dihapus');
    }
}
