<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\StockOpname;
use PhpOffice\PhpSpreadsheet\Spreadsheet;
use PhpOffice\PhpSpreadsheet\Writer\Xlsx;
use Symfony\Component\HttpFoundation\StreamedResponse;

class StockOpnameExportController extends Controller
{
    public function export()
    {
        $stockOpnames = StockOpname::with([
            'details.product',
            'details.stockTotal'
        ])->get();

        $spreadsheet = new Spreadsheet();
        $sheet = $spreadsheet->getActiveSheet();

        // ======================
        // HEADER
        // ======================
        $headers = [
            'No',
            'Opname Date',
            'Status',
            'Product Name',
            'Physical Quantity',
            'System Quantity',
            'Quantity Difference',
        ];

        $sheet->fromArray($headers, null, 'A1');

        // Style Header
        $sheet->getStyle('A1:G1')->getFont()->setBold(true);
        $sheet->getStyle('A1:G1')->getAlignment()->setHorizontal('center');

        // ======================
        // DATA
        // ======================
        $row = 2;
        $no  = 1;

        foreach ($stockOpnames as $stockOpname) {
            foreach ($stockOpname->details as $detail) {
                $sheet->setCellValue("A{$row}", $no++);
                $sheet->setCellValue("B{$row}", $stockOpname->opname_date);
                $sheet->setCellValue("C{$row}", ucfirst($stockOpname->status));
                $sheet->setCellValue("D{$row}", $detail->product->name ?? '-');
                $sheet->setCellValue("E{$row}", (int) ($detail->physical_quantity ?? 0));
                $sheet->setCellValue("F{$row}", (int) ($detail->stockTotal->total_stock ?? 0));
                $sheet->setCellValue("G{$row}", (int) ($detail->quantity_difference ?? 0));

                $row++;
            }
        }

        // ======================
        // AUTO WIDTH
        // ======================
        foreach (range('A', 'G') as $column) {
            $sheet->getColumnDimension($column)->setAutoSize(true);
        }

        // ======================
        // DOWNLOAD RESPONSE
        // ======================
        $writer = new Xlsx($spreadsheet);

        return new StreamedResponse(function () use ($writer) {
            $writer->save('php://output');
        }, 200, [
            'Content-Type'        => 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            'Content-Disposition' => 'attachment; filename="stock-opnames.xlsx"',
            'Cache-Control'       => 'max-age=0',
        ]);
    }
}