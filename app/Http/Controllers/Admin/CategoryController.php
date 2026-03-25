<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\CategoryRequest;
use App\Models\Category;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class CategoryController extends Controller
{
    public function __construct()
    {
        // memastikan semua halaman admin hanya bisa diakses jika sudah login
        $this->middleware('auth:web');
    }
    
    public function index()
    {
        $search = request('q');

        $categories = Category::query()
            ->when($search, fn ($query) =>
                $query->where('name', 'like', "%{$search}%")
            )
            ->latest()
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('Admin/Categories/Index', [
            'categories' => $categories,
        ]);
    }

    /**
     * Show the form for creating a new category.
     */
    public function create()
    {
        return Inertia::render('Admin/Categories/Create');
    }

    /**
     * Store a newly created category in storage.
     */
    public function store(CategoryRequest $request)
    {
        Category::create($request->validated());

        return redirect()
            ->route('admin.categories.index')
            ->with('message', 'Category created successfully.');
    }

    /**
     * Show the form for editing the specified category.
     */
    public function edit(Category $category)
    {
        return Inertia::render('Admin/Categories/Edit', [
            'category' => $category,
        ]);
    }

    /**
     * Update the specified category in storage.
     */
    public function update(CategoryRequest $request, Category $category)
    {
        $category->update($request->validated());

        return redirect()
            ->route('admin.categories.index')
            ->with('message', 'Category updated successfully.');
    }

    /**
     * Remove the specified category from storage.
     */
    public function destroy(Category $category)
    {
        // Prevent deletion if category is still used by products
        if ($category->products()->exists()) {
            return redirect()
                ->route('admin.categories.index')
                ->with('error', 'Category cannot be deleted because it is still used by products.');
        }

        try {
            DB::transaction(function () use ($category) {
                $category->delete();
            });

            return redirect()
                ->route('admin.categories.index')
                ->with('message', 'Category deleted successfully.');
        } catch (\Throwable $e) {
            Log::error('Failed to delete category', [
                'category_id' => $category->id,
                'error' => $e->getMessage(),
            ]);

            return redirect()
                ->route('admin.categories.index')
                ->with('error', 'An error occurred while deleting the category.');
        }
    }
}
