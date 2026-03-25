import React, { useState, useMemo, useRef } from "react";
import { usePage } from "@inertiajs/react";
import AdminLayout from "../../../Layouts/AdminLayout";
import { Head } from "@inertiajs/react";

export default function StockCardIndex() {
    const { stockCards = [], products = [] } = usePage().props;

    const [search, setSearch] = useState("");
    const [selectedProduct, setSelectedProduct] = useState(null);
    // const [startDate, setStartDate] = useState("");
    // const [endDate, setEndDate] = useState("");

    const tableRef = useRef();

    /* =========================
       HELPERS
    ========================= */

    const formatDate = (date) => {
        if (!date) return "-";
        return new Date(date).toLocaleDateString("id-ID");
    };

    const escapeCsv = (value) => {
        if (value === null || value === undefined) return "";
        const str = String(value);
        return str.includes(",") || str.includes("\n") || str.includes('"')
            ? `"${str.replace(/"/g, '""')}"`
            : str;
    };

    /* =========================
       FILTERING & DERIVED DATA
    ========================= */

    const filteredProducts = useMemo(() => {
        if (!search) return [];
        return products.filter((p) =>
            p.name.toLowerCase().includes(search.toLowerCase()),
        );
    }, [search, products]);

    const tableRows = useMemo(() => {
        if (!selectedProduct) return [];

        return stockCards
            .filter((r) => r.product_id === selectedProduct.id)
            .sort((a, b) => new Date(a.date) - new Date(b.date));
    }, [selectedProduct, stockCards]);

    const totalStock = useMemo(() => {
        let total = 0;

        tableRows.forEach((r) => {
            total += Number(r.stock_in || 0) - Number(r.stock_out || 0);
        });

        return total;
    }, [tableRows]);

    /* =========================
       ACTIONS
    ========================= */

    const handleSelectProduct = (product) => {
        setSelectedProduct(product);
        setSearch(product.name);
    };

    const handleClearSearch = () => {
        setSearch("");
        setSelectedProduct(null);
    };

    /** =========================
     * EXPORT KE CSV (EXCEL) — VERSI RAPI
     * ========================= */
    const exportExcelStyled = () => {
        if (!selectedProduct || tableRows.length === 0) {
            alert("Tidak ada data untuk diexport.");
            return;
        }

        let runningTotal = 0;

        const rowsHtml = tableRows
            .map((r) => {
                runningTotal +=
                    Number(r.stock_in || 0) - Number(r.stock_out || 0);

                return `
            <tr>
                <td style="padding:8px; border:1px solid #000;">
                    ${formatDate(r.date)}
                </td>
                <td style="padding:8px; border:1px solid #000;">
                    ${r.production_code}
                </td>
                <td style="padding:8px; border:1px solid #000;">
                    ${r.name}
                </td>
                <td style="padding:8px; border:1px solid #000; text-align:right;">
                    + ${r.stock_in}
                </td>
                <td style="padding:8px; border:1px solid #000; text-align:right;">
                    - ${r.stock_out}
                </td>
                <td style="padding:8px; border:1px solid #000; text-align:right; font-weight:bold;">
                    ${runningTotal}
                </td>
            </tr>
        `;
            })
            .join("");

        const htmlExcel = `
        <html xmlns:o="urn:schemas-microsoft-com:office:office"
              xmlns:x="urn:schemas-microsoft-com:office:excel"
              xmlns="http://www.w3.org/TR/REC-html40">

        <head>
            <meta charset="UTF-8">
            <style>
                table {
                    border-collapse: collapse;
                    width: 100%;
                    font-family: Arial, sans-serif;
                }
                th {
                    background: #f3f3f3;
                    font-weight: bold;
                    text-align: center;
                    padding: 10px;
                    border: 1px solid #000;
                }
                td {
                    padding: 8px;
                    border: 1px solid #000;
                }
                .title {
                    font-size: 16px;
                    font-weight: bold;
                    text-align: center;
                }
                .meta {
                    text-align: center;
                    margin-bottom: 10px;
                }
            </style>
        </head>

        <body>
            <div class="title">KARTU STOK PERSEDIAAN</div>
            <div class="meta">
                Produk: <b>${selectedProduct.name}</b> |
                Total Stock: <b>${totalStock}</b> |
                Dicetak: ${new Date().toLocaleString("id-ID")}
            </div>

            <table>
                <thead>
                    <tr>
                        <th>Tanggal</th>
                        <th>Kode Produk</th>
                        <th>Nama Produk</th>
                        <th>Stock In</th>
                        <th>Stock Out</th>
                        <th>Total Berjalan</th>
                    </tr>
                </thead>
                <tbody>
                    ${rowsHtml}
                </tbody>
            </table>
        </body>
        </html>
    `;

        const blob = new Blob([htmlExcel], {
            type: "application/vnd.ms-excel;charset=utf-8;",
        });

        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");

        link.href = url;
        link.download = `kartu-stok-${selectedProduct.name}.xls`;

        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    /** =========================
     * EXPORT KE PDF (PRINT TABEL ASLI)
     * ========================= */
    const exportPdf = () => {
        const printContent = tableRef.current.cloneNode(true);

        const printWindow = window.open("", "_blank");

        printWindow.document.write(`
            <html>
            <head>
                <title>Kartu Stok - ${selectedProduct.name}</title>
                <style>
                    body { font-family: Arial, sans-serif; padding: 10px; }
                    h3, p { text-align: center; margin: 5px 0; }
                    table {
                        width: 100%;
                        border-collapse: collapse;
                        margin-top: 10px;
                    }
                    th {
                        background: #f3f3f3;
                        font-weight: bold;
                        text-align: center;
                    }
                    th, td {
                        border: 1px solid black;
                        padding: 6px;
                        font-size: 12px;
                    }
                    tr:nth-child(even) { background: #fafafa; }
                    @page { size: A4 landscape; margin: 10mm; }
                </style>
            </head>
            <body>
                <h3>KARTU STOK PERSEDIAAN</h3>
                <p>Dicetak: ${new Date().toLocaleString("id-ID")}</p>
                <p>Produk: <b>${
                    selectedProduct.name
                }</b> | Total Stock: <b>${totalStock}</b></p>
                ${printContent.outerHTML}
            </body>
            </html>
        `);

        printWindow.document.close();
        printWindow.print();
    };

    /* =========================
       COMPONENTS
    ========================= */

    function SummaryCard({ title, value, color }) {
        return (
            <div className="col-md-4">
                <div className="card border-0 shadow-sm rounded-4 p-4">
                    <div className="text-muted small">{title}</div>
                    <div className={`fs-4 fw-bold text-${color}`}>{value}</div>
                </div>
            </div>
        );
    }

    /* =========================
       RENDER
    ========================= */

    const summary = useMemo(() => {
        let totalIn = 0;
        let totalOut = 0;
        tableRows.forEach((r) => {
            totalIn += Number(r.stock_in || 0);
            totalOut += Number(r.stock_out || 0);
        });
        return { totalIn, totalOut };
    }, [tableRows]);

    const reportRows = useMemo(() => {
        let runningTotal = 0;
        return tableRows.map((r) => {
            runningTotal += Number(r.stock_in || 0) - Number(r.stock_out || 0);
            return {
                ...r,
                stockIn: r.stock_in || 0,
                stockOut: r.stock_out || 0,
                runningTotal,
            };
        });
    }, [tableRows]);

    return (
        <AdminLayout>
            <Head>
                <title>Kartu Stock - EasyPOS</title>
            </Head>

            <div className="container-fluid py-4">
                {/* ================= HEADER ================= */}
                <div className="saas-page-header saas-card">
                    <div className="saas-header-left">
                        <div className="saas-icon-box bg-primary ">
                            <i className="bi bi-graph-up"></i>
                        </div>

                        <div>
                            <h5 className="saas-title">Kartu Stock</h5>
                            <p className="saas-subtitle">
                                Riwayat pergerakan stok produk secara real-time
                            </p>
                        </div>
                    </div>
                </div>

                {/* ================= SEARCH CARD ================= */}
                <div className="card border-0 shadow-sm rounded-4 mb-4 mt-4">
                    <div className="card-body p-4">
                        <div className="row align-items-end g-4">
                            <div className="col-lg-4 position-relative">
                                <div
                                    className="d-flex align-items-center px-3"
                                    style={{
                                        height: "42px",
                                        border: "1px solid #e5e7eb",
                                        borderRadius: "12px",
                                        background: "#f9fafb",
                                        minWidth: "250px",
                                    }}
                                >
                                    <i className="bi bi-search text-muted me-2"></i>
                                    <input
                                        type="text"
                                        className="border-0 bg-transparent"
                                        style={{
                                            outline: "none",
                                            fontSize: "14px",
                                        }}
                                        placeholder="Ketik nama produk..."
                                        value={search}
                                        onChange={(e) => {
                                            setSearch(e.target.value);
                                            setSelectedProduct(null);
                                        }}
                                    />
                                </div>


                                {search && !selectedProduct && (
                                    <div
                                        className="list-group position-absolute w-100 shadow rounded-3 mt-2"
                                        style={{ zIndex: 999 }}
                                    >
                                        {filteredProducts.length ? (
                                            filteredProducts.map((p) => (
                                                <button
                                                    key={p.id}
                                                    className="list-group-item list-group-item-action border-0"
                                                    onClick={() =>
                                                        handleSelectProduct(p)
                                                    }
                                                >
                                                    {p.name}
                                                </button>
                                            ))
                                        ) : (
                                            <div className="list-group-item text-muted small border-0">
                                                Produk tidak ditemukan
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>

                            <div className="col-lg-3">
                                <div className="stock-box">{totalStock}</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* ================= EMPTY ================= */}
                {!selectedProduct && (
                    <div className="text-center text-muted py-5">
                        <i className="bi bi-box fs-1 d-block mb-3"></i>
                        Pilih produk untuk melihat laporan stok
                    </div>
                )}

                {/* ================= REPORT ================= */}
                {selectedProduct && (
                    <>
                        {/* ===== SUMMARY ===== */}
                        <div className="row g-4 mb-4">
                            <SummaryCard
                                title="Total Stock In"
                                value={summary.totalIn}
                                color="success"
                            />

                            <SummaryCard
                                title="Total Stock Out"
                                value={summary.totalOut}
                                color="danger"
                            />

                            <SummaryCard
                                title="Current Stock"
                                value={totalStock}
                                color="primary"
                            />
                        </div>

                        {/* ===== EXPORT ===== */}
                        {reportRows.length > 0 && (
                            <div className="d-flex justify-content-end gap-2 mb-3">
                                <button
                                    className="btn btn-outline-danger rounded-pill px-4"
                                    onClick={exportPdf}
                                >
                                    PDF
                                </button>

                                <button
                                    className="btn btn-success rounded-pill px-4"
                                    onClick={exportExcelStyled}
                                >
                                    Excel
                                </button>
                            </div>
                        )}

                        {/* ===== TABLE ===== */}
                        <div className="card border-0 shadow-sm rounded-4">
                            <div className="card-body p-3">
                                <div className="table-wrapper">
                                    <table
                                        ref={tableRef}
                                        className="table align-middle mb-0"
                                    >
                                        <thead>
                                            <tr>
                                                <th>Tanggal</th>
                                                <th>Kode</th>
                                                <th>Keterangan</th>{" "}
                                                {/* FIELD BARU */}
                                                <th>Produk</th>
                                                <th className="text-center">
                                                    Harga Pokok
                                                </th>
                                                <th className="text-end text-success">
                                                    Stock In
                                                </th>
                                                <th className="text-end text-danger">
                                                    Stock Out
                                                </th>
                                                <th className="text-end">
                                                    Balance
                                                </th>
                                            </tr>
                                        </thead>

                                        <tbody>
                                            {reportRows.map((r, i) => {
                                                const isStockIn = r.stockIn > 0;

                                                const description =
                                                    r.stock_in > 0
                                                        ? `Supplier ${r.supplier_name ?? "Tidak Diketahui"}`
                                                        : `Dilakukan Pembelian Produk Oleh ${r.customer_name ?? "Pelanggan Baru"}`;

                                                return (
                                                    <tr key={i}>
                                                        <td>
                                                            {formatDate(r.date)}
                                                        </td>

                                                        <td>
                                                            {r.production_code}
                                                        </td>

                                                        <td>
                                                            <span
                                                                className={`badge px-3 py-2 ${
                                                                    isStockIn
                                                                        ? "bg-success-subtle text-success"
                                                                        : "bg-danger-subtle text-danger"
                                                                }`}
                                                            >
                                                                {description}
                                                            </span>
                                                        </td>

                                                        <td>{r.name}</td>

                                                        <td className="text-center">
                                                            {r.cost_price
                                                                ? `Rp ${Number(r.cost_price).toLocaleString("id-ID")}`
                                                                : "-"}
                                                        </td>

                                                        <td className="text-end text-success">
                                                            {r.stockIn > 0
                                                                ? `+ ${r.stockIn}`
                                                                : "-"}
                                                        </td>

                                                        <td className="text-end text-danger">
                                                            {r.stockOut > 0
                                                                ? `- ${r.stockOut}`
                                                                : "-"}
                                                        </td>

                                                        <td className="fw-bold text-end">
                                                            {r.runningTotal}
                                                        </td>
                                                    </tr>
                                                );
                                            })}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </>
                )}
            </div>

            {/* ================= SAAS STYLE ================= */}
            <style>{`
            .page-icon{
            width:52px;
            height:52px;
            border-radius:16px;
            background:linear-gradient(135deg,#6366f1,#4f46e5);
            display:flex;
            align-items:center;
            justify-content:center;
            color:white;
            font-size:20px;
            box-shadow:0 10px 20px rgba(79,70,229,.25);
            }

            .stock-box{
            background:#f8fafc;
            border-radius:12px;
            padding:14px;
            text-align:right;
            font-weight:700;
            font-size:12px;
            }

            .table-wrapper{
            padding:8px 6px;
            }

            .table thead{
            background:#f9fafb;
            font-size:13px;
            }

            .table tbody tr:hover{
            background:#f8fafc;
            transition:.2s;
            }

            .saas-page-header{
                        padding:22px 24px;
                        border-bottom:1px solid #f1f5f9;
                        display:flex;
                        justify-content:space-between;
                        align-items:center;
                        background:white;
                    }

                    .saas-header-left{
                        display:flex;
                        align-items:center;
                        gap:14px;
                    }

                    .saas-icon-box{
                        width:44px;
                        height:44px;
                        border-radius:12px;
                        display:flex;
                        align-items:center;
                        justify-content:center;
                        color:white;
                        font-size:18px;
                    }

                    .saas-title{
                        margin:0;
                        font-weight:600;
                    }

                    .saas-subtitle{
                        font-size:13px;
                        color:#6b7280;
                        margin:0;
                    }

                    .saas-card{
                        background:white;
                        border-radius:14px;
                        padding:28px;
                        box-shadow:0 1px 2px rgba(0,0,0,.04);
                        border:1px solid #f1f5f9;
                    }

            `}</style>
        </AdminLayout>
    );
}
