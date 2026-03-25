<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Picqer\Barcode\BarcodeGeneratorPNG;
use App\Models\Barcode;

class BarcodeController extends Controller
{
   public function download($id)
{
    $barcode = Barcode::findOrFail($id);

    $generator = new BarcodeGeneratorPNG();
    $barcodeImage = $generator->getBarcode(
        $barcode->barcode, // 🔥 BARCODE ASLI
        $generator::TYPE_CODE_128,
        2,
        60
    );

    return response($barcodeImage)
        ->header('Content-Type', 'image/png')
        ->header(
            'Content-Disposition',
            'attachment; filename="barcode-'.$barcode->barcode.'.png"'
        );
}
}
