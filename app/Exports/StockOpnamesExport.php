<?php

namespace App\Exports;

use PhpOffice\PhpSpreadsheet\Spreadsheet;
use PhpOffice\PhpSpreadsheet\Writer\Xlsx;

class StockOpnamesExport
{
    protected $stockOpnames;

    public function __construct($stockOpnames)
    {
        $this->stockOpnames = $stockOpnames;
    }

    public function download()
    {
        $spreadsheet = new Spreadsheet();
        $sheet = $spreadsheet->getActiveSheet();

        // Header
        $headers = [
            'No.',
            'Date',
            'Status',
            'Product Name',
            'Physical Quantity',
            'System Quantity',
            'Quantity Difference',
        ];

        $sheet->fromArray($headers, null, 'A1');

        // Data
        $row = 2;
        $no = 1;

        foreach ($this->stockOpnames as $stockOpname) {
            foreach ($stockOpname->details as $detail) {
                $sheet->setCellValue('A' . $row, $no++);
                $sheet->setCellValue('B' . $row, $stockOpname->opname_date);
                $sheet->setCellValue('C' . $row, ucfirst($stockOpname->status));
                $sheet->setCellValue('D' . $row, $detail->product->name ?? 'No product');
                $sheet->setCellValue('E' . $row, $detail->physical_quantity ?? 0);
                $sheet->setCellValue('F' . $row, $detail->stockTotal->total_stock ?? 0);
                $sheet->setCellValue('G' . $row, $detail->quantity_difference ?? 0);

                $row++;
            }
        }

        // Output
        $writer = new Xlsx($spreadsheet);

        $filename = 'stock-opnames.xlsx';

        return response()->streamDownload(function () use ($writer) {
            $writer->save('php://output');
        }, $filename);
    }
}
