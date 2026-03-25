<?php

use App\Http\Controllers\Admin\StockOpnameController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Admin\StockCardController;
use App\Http\Controllers\Admin\CategoryController;
use App\Http\Controllers\Admin\ProductStockController;
use App\Http\Controllers\Admin\BarcodeController;
use App\Http\Controllers\PwaController;
use App\Http\Controllers\Admin\ProductController;
use App\Http\Controllers\Admin\DashboardController;
use App\Http\Controllers\Auth\LoginController;
use Illuminate\Support\Facades\Auth;
/*
|--------------------------------------------------------------------------
| Root Route
|--------------------------------------------------------------------------
*/

Route::get('/', function () {

    if (Auth::check()) {
        return redirect()->route('admin.dashboard');
    }

    return redirect()->route('login');

});

/*
|--------------------------------------------------------------------------
| Authentication
|--------------------------------------------------------------------------
*/

Route::middleware('guest')->group(function () {

    Route::get('/login', [LoginController::class, 'index'])->name('login');
    Route::post('/login', [LoginController::class, 'store'])->name('login.store');

});

/*
|--------------------------------------------------------------------------
| Admin
|--------------------------------------------------------------------------
*/

Route::middleware(['auth:web'])
    ->prefix('admin')
    ->name('admin.')
    ->group(function () {

        Route::get('/dashboard', [DashboardController::class, 'index'])
            ->name('dashboard');

});

Route::post('/logout', [\App\Http\Controllers\Auth\LogoutController::class, '__invoke'])->name('logout')->middleware('auth');

Route::prefix('admin')->middleware(['auth'])->name('admin.')->group(function () {
    Route::get('/dashboard', DashboardController::class)->name('dashboard')->middleware('permission:dashboard.index');

    $resources = [
        'users' => [
            'controller' => \App\Http\Controllers\Admin\UserController::class,
            'permissions' => 'users.index|users.create|users.edit|users.delete',
            'name' => 'users'
        ],
        'roles' => [
            'controller' => \App\Http\Controllers\Admin\RoleController::class,
            'permissions' => 'roles.index|roles.create|roles.edit|roles.delete',
            'name' => 'roles'
        ],
        'suppliers' => [
            'controller' => \App\Http\Controllers\Admin\SupplierController::class,
            'permissions' => 'suppliers.index|suppliers.create|suppliers.edit|suppliers.delete',
            'name' => 'suppliers'
        ],
        'customers' => [
            'controller' => \App\Http\Controllers\Admin\CustomerController::class,
            'permissions' => 'customers.index|customers.create|customers.edit|customers.delete',
            'name' => 'customers'
        ],
        'categories' => [
            'controller' => CategoryController::class,
            'permissions' => 'categories.index|categories.create|categories.edit|categories.delete',
            'name' => 'categories'
        ],
        'units' => [
            'controller' => \App\Http\Controllers\Admin\UnitController::class,
            'permissions' => 'units.index|units.create|units.edit|units.delete',
            'name' => 'units'
        ],
        'products' => [
            'controller' => ProductController::class,
            'permissions' => 'products.index|products.create|products.edit|products.delete',
            'name' => 'products'
        ],
        'stocks' => [
            'controller' => ProductStockController::class,
            'permissions' => 'stocks.index|stocks.create|stocks.edit|stocks.destroy',
            'name' => 'stocks'
        ],
        'stock-opnames' => [
            'controller' => StockOpnameController::class,
            'permissions' => 'stock-opnames.index|stock-opnames.create|stock-opnames.edit|stock-opnames.show',
            'name' => 'stock-opnames'
        ],

        'stock-cards' => [
        'controller' => StockCardController::class,
        'permissions' => 'stock-cards.index',
        'name' => 'stock-cards'
    ],
    ];

    foreach ($resources as $name => $resource) {
        $route = Route::resource($name, $resource['controller'])
            ->middleware("permission:{$resource['permissions']}");
        if (isset($resource['names'])) {
            $route->names($resource['names']);
        }
    }

    Route::prefix('sales')->name('sales.')->middleware('permission:transactions.index')->group(function () {
        Route::get('/', [\App\Http\Controllers\Admin\TransactionController::class, 'index'])->name('index');
        Route::post('/add-product', [\App\Http\Controllers\Admin\TransactionController::class, 'addProductToCart'])->name('add-product');
        Route::delete('/delete-from-cart/{id}', [\App\Http\Controllers\Admin\TransactionController::class, 'deleteFromCart'])->name('delete-from-cart');
        Route::post('/process-payment', [\App\Http\Controllers\Admin\TransactionController::class, 'processPayment'])->name('process-payment');
        Route::post('/get-snap-token', [\App\Http\Controllers\Admin\TransactionController::class, 'getSnapToken'])->name('get-snap-token');
        Route::put('/update-qty/{id}', [\App\Http\Controllers\Admin\TransactionController::class, 'updateQty']);
        Route::post('/cart/increase/{id}', [\App\Http\Controllers\Admin\CartController::class, 'increase']);
        Route::post('/cart/decrease/{id}', [\App\Http\Controllers\Admin\CartController::class, 'decrease']);
    });

    Route::prefix('report')
    ->name('report.')
    ->middleware('permission:reports.index')
    ->group(function () {

        Route::get('/', [\App\Http\Controllers\Admin\ReportController::class, 'index'])
            ->name('index');

        Route::get('/generate', [\App\Http\Controllers\Admin\ReportController::class, 'generate'])
            ->name('generate');
    });

Route::middleware(['auth', 'verified'])
    ->prefix('admin')
    ->group(function () {

});

Route::get('/phpinfo', function(){
    phpinfo();
});

Route::get('/admin/stocks/{id}/edit',
    [ProductStockController::class,'edit']
)->name('admin.stocks.edit');

Route::post(
    '/admin/stock-opnames/{stockOpname}/approve',
    [StockOpnameController::class, 'approve']
)->name('admin.stock-opnames.approve');

Route::delete('/admin/stock-opnames/{id}', 
    [StockOpnameController::class, 'destroy']
)->name('admin.stock-opnames.destroy');

Route::middleware(['auth'])
    ->prefix('admin')
    ->group(function () {

        Route::get('/admin/stock-cards/export-pdf', [StockCardController::class, 'exportPdf'])
    ->name('stock-cards.export-pdf');

Route::get('/admin/stock-cards/export-excel', [StockCardController::class, 'exportExcel']);

Route::get('/admin/stock-cards/export-excel', [StockCardController::class, 'exportExcel'])
    ->name('stock-cards.export-excel');

    Route::get(
    '/admin/barcodes/{id}/download',
    [BarcodeController::class, 'download']
)->name('admin.barcodes.download');

    Route::get(
   '/admin/stock-cards/export-data',
   [StockCardController::class, 'exportData']
);

Route::put('/admin/stock-opnames/{id}', [StockOpnameController::class, 'update']);

});

    Route::get(
    '/admin/stock-opnames/{id}/export',
    [StockOpnameController::class, 'export']
)->name('stock-opnames.export');

Route::get('/pwa/status', [PwaController::class, 'status'])
    ->name('pwa.status');

// Route::put('/admin/products/{product}', [ProductController::class, 'update'])
//     ->name('admin.products.update');

Route::delete('/categories/{category}', [CategoryController::class, 'destroy'])
    ->name('admin.categories.destroy');

    Route::get('/get-cities/{provinceId}', [\App\Http\Controllers\Admin\SupplierController::class, 'getCitiesByProvince'])->name('get-cities')
        ->middleware('permission:suppliers.index');

    Route::post('/get-courier-cost', [ProductStockController::class, 'getCourierCost'])->name('get-courier-cost')
        ->middleware('permission:stocks.index');


});
