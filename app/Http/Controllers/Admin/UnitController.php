<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\UnitRequest;
use App\Models\Unit;
use Illuminate\Http\Request;

class UnitController extends Controller
{
    public function __construct()
    {
        // memastikan semua halaman admin hanya bisa diakses jika sudah login
        $this->middleware('auth:web');
    }
    public function index()
{
    $search = request('q');

    $units = Unit::query()
        ->when($search, fn ($query) =>
            $query->where('name', 'like', "%{$search}%")
        )
        ->latest()
        ->paginate(10)
        ->withQueryString();

    return inertia('Admin/Units/Index', [
        'units' => $units,
        'filters' => [
            'q' => $search,
        ],
    ]);
}


    public function create() {
        return inertia('Admin/Units/Create');
    }

    public function store(UnitRequest $request) {
        Unit::create($request->validated());

        return redirect()->route('admin.units.index');
    }

    public function edit($id) {
        $unit = Unit::findOrFail($id);

        return inertia('Admin/Units/Edit', [
            'unit' => $unit
        ]);
    }

    public function update(UnitRequest $request, Unit $unit) {
        $unit->update($request->validated());

        return redirect()->route('admin.units.index');
    }

    public function destroy($id) {
        $unit = Unit::findOrFail($id);

        $unit->delete();

        return redirect()->route('admin.units.index');
    }
}
