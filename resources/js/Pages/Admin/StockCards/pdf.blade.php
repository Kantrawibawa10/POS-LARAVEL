<!DOCTYPE html>
<html>
<head>
    <title>Kartu Stok</title>
    <style>
        body { font-family: Arial, sans-serif; }
        table { width: 100%; border-collapse: collapse; }
        th, td { border: 1px solid black; padding: 8px; text-align: left; }
        th { background-color: #f0f0f0; }
    </style>
</head>
<body>

<h2 style="text-align:center">Laporan Kartu Stok</h2>
<p>Tanggal: {{ $date }}</p>

<table>
    <thead>
        <tr>
            <th>Barcode</th>
            <th>Nama Produk</th>
            <th>Stock In</th>
            <th>Stock Out</th>
            <th>Total Stock</th>
        </tr>
    </thead>
    <tbody>
        @foreach($stockCards as $row)
        <tr>
            <td>{{ $row->barcode }}</td>
            <td>{{ $row->name }}</td>
            <td>{{ $row->stock_in }}</td>
            <td>{{ $row->stock_out }}</td>
            <td>{{ $row->total_stock }}</td>
        </tr>
        @endforeach
    </tbody>
</table>

</body>
</html>
