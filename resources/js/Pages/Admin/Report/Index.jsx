import React, { useState } from "react";
import { usePage, router, Head } from "@inertiajs/react";
import AdminLayout from "../../../Layouts/AdminLayout";

export default function ReportIndex() {
    const {
        reports = [],
        start_date = "",
        end_date = "",
        errors = {},
    } = usePage().props;

    const [showFilterModal, setShowFilterModal] = useState(false);

    const handleExportPDF = () => {
        const printWindow = window.open("", "", "width=1200,height=800");

        const formatCurrency = (num) =>
            Number(num || 0).toLocaleString("id-ID", {
                style: "currency",
                currency: "IDR",
            });

        /* ================= GROUP BY INVOICE (WITH ITEMS) ================= */
        const grouped = Object.values(
            reports.reduce((acc, item) => {
                if (!acc[item.invoice]) {
                    acc[item.invoice] = {
                        invoice: item.invoice,
                        tanggal: item.tanggal,
                        customer: item.customer ?? "Guest",
                        status: item.status ?? "pending",
                        items: [],

                        qty: 0,
                        cost: 0,
                        final: 0,
                    };
                }

                acc[item.invoice].items.push(item);

                acc[item.invoice].qty += Number(item.quantity || 0);
                acc[item.invoice].cost +=
                    Number(item.cost_price || 0) * Number(item.quantity || 0);
                acc[item.invoice].final += Number(item.total_final || 0);

                return acc;
            }, {}),
        );

        /* ================= GRAND TOTAL ================= */
        let grandQty = 0;
        let grandCost = 0;
        let grandFinal = 0;

        const rows = grouped
            .map((g, i) => {
                const profit = g.final - g.cost;
                const margin =
                    g.final > 0 ? ((profit / g.final) * 100).toFixed(2) : 0;

                grandQty += g.qty;
                grandCost += g.cost;
                grandFinal += g.final;

                return `
<tr style="background:#f1f5f9; font-weight:bold;">
<td colspan="13">
Invoice: ${g.invoice} |
Customer: ${g.customer} |
Tanggal: ${new Date(g.tanggal).toLocaleDateString("id-ID")}
</td>
</tr>

${g.items
    .map(
        (r, idx) => `
<tr>
<td class="text-center">${i + 1}.${idx + 1}</td>
<td>${r.invoice}</td>
<td class="text-center">${new Date(r.tanggal).toLocaleDateString("id-ID")}</td>
<td>${r.customer ?? "Guest"}</td>
<td>${r.product_name}</td>
<td class="text-center">${r.quantity}</td>
<td class="text-end">${formatCurrency(r.cost_price)}</td>
<td class="text-end">${formatCurrency(r.selling_price)}</td>
<td class="text-end">${formatCurrency(r.discount)}</td>
<td class="text-end">${formatCurrency(r.subtotal_barang)}</td>
<td class="text-end">${formatCurrency(r.subtotal_setelah_diskon)}</td>
<td class="text-end">${formatCurrency(r.total_final)}</td>
<td class="text-center">${r.status}</td>
</tr>
`,
    )
    .join("")}

<tr style="background:#e2e8f0; font-weight:bold;">
<td colspan="5" class="text-end">Subtotal Invoice</td>
<td class="text-center">${g.qty}</td>
<td class="text-end">${formatCurrency(g.cost)}</td>
<td colspan="3"></td>
<td class="text-end">${formatCurrency(g.final)}</td>
<td class="text-end">${formatCurrency(profit)}</td>
<td class="text-center">${margin}%</td>
</tr>
`;
            })
            .join("");

        const grandProfit = grandFinal - grandCost;
        const grandMargin =
            grandFinal > 0 ? ((grandProfit / grandFinal) * 100).toFixed(2) : 0;

        const content = `
<html>
<head>
<title>Transaction Report</title>

<style>
@page { size: A4 landscape; margin: 12mm; }

body{ font-family: Arial; }

table{
    width:100%;
    border-collapse:collapse;
    font-size:11px;
}

th, td{
    border:1px solid #ddd;
    padding:5px;
}

th{
    background:#f8fafc;
}

.text-center{ text-align:center; }
.text-end{ text-align:right; }
</style>
</head>

<body>

<h3 style="text-align:center;margin-bottom:0;">Laporan Transaksi</h3>
<p style="text-align:center;margin-top:0;margin-bottom:30px;">Periode: ${startDate} s/d ${endDate}</p>

<table>
<thead>
<tr>
<th>No</th>
<th>Invoice</th>
<th>Tanggal</th>
<th>Customer</th>
<th>Produk</th>
<th>Qty</th>
<th>Harga Pokok</th>
<th>Harga Jual</th>
<th>Diskon</th>
<th>Total Barang</th>
<th>Subtotal</th>
<th>Total Final</th>
<th>Status</th>
</tr>
</thead>

<tbody>
${rows}

<tr style="background:#cbd5f5; font-weight:bold;">
<td colspan="5" class="text-end">GRAND TOTAL</td>
<td class="text-center">${grandQty}</td>
<td class="text-end">${formatCurrency(grandCost)}</td>
<td colspan="3"></td>
<td class="text-end">${formatCurrency(grandFinal)}</td>
<td class="text-end">${formatCurrency(grandProfit)}</td>
<td class="text-center">${grandMargin}%</td>
</tr>

</tbody>
</table>

</body>
</html>
`;

        printWindow.document.write(content);
        printWindow.document.close();
        printWindow.focus();
        printWindow.print();
    };

    const handleExportExcel = () => {
        const formatDate = (date) => new Date(date).toLocaleDateString("id-ID");

        /* ================= GROUP WITH ITEMS ================= */
        const grouped = Object.values(
            reports.reduce((acc, item) => {
                if (!acc[item.invoice]) {
                    acc[item.invoice] = {
                        invoice: item.invoice,
                        tanggal: item.tanggal,
                        customer: item.customer ?? "Guest",
                        status: item.status ?? "pending",
                        items: [],

                        qty: 0,
                        cost: 0,
                        final: 0,
                    };
                }

                acc[item.invoice].items.push(item);

                acc[item.invoice].qty += Number(item.quantity || 0);
                acc[item.invoice].cost +=
                    Number(item.cost_price || 0) * Number(item.quantity || 0);
                acc[item.invoice].final += Number(item.total_final || 0);

                return acc;
            }, {}),
        );

        /* ================= GRAND TOTAL ================= */
        let grandQty = 0;
        let grandCost = 0;
        let grandFinal = 0;

        /* ================= TABLE ================= */
        let table = `
<table border="1">

<!-- HEADER LAPORAN -->
<tr>
<td colspan="13" style="text-align:center; font-size:16px; font-weight:bold;">
Transaction Report
</td>
</tr>
<tr>
<td colspan="13" style="text-align:center;">
Periode: ${startDate} s/d ${endDate}
</td>
</tr>
<tr><td colspan="13"></td></tr>

<!-- TABLE HEADER -->
<tr style="background:#f1f5f9; font-weight:bold;">
<th>No</th>
<th>Invoice</th>
<th>Tanggal</th>
<th>Customer</th>
<th>Produk</th>
<th>Qty</th>
<th>Harga Pokok</th>
<th>Harga Jual</th>
<th>Diskon</th>
<th>Total Barang</th>
<th>Subtotal</th>
<th>Total Final</th>
<th>Status</th>
</tr>
`;

        grouped.forEach((g, i) => {
            const profit = g.final - g.cost;
            const margin =
                g.final > 0 ? ((profit / g.final) * 100).toFixed(2) : 0;

            grandQty += g.qty;
            grandCost += g.cost;
            grandFinal += g.final;

            /* HEADER INVOICE */
            table += `
<tr style="background:#e2e8f0; font-weight:bold;">
<td colspan="13">
Invoice: ${g.invoice} | Customer: ${g.customer} | Tanggal: ${formatDate(g.tanggal)}
</td>
</tr>
`;

            /* DETAIL PRODUK */
            g.items.forEach((r, idx) => {
                table += `
<tr>
<td>${i + 1}.${idx + 1}</td>
<td>${r.invoice}</td>
<td>${formatDate(r.tanggal)}</td>
<td>${r.customer ?? "Guest"}</td>
<td>${r.product_name}</td>
<td>${r.quantity}</td>
<td>${r.cost_price}</td>
<td>${r.selling_price}</td>
<td>${r.discount}</td>
<td>${r.subtotal_barang}</td>
<td>${r.subtotal_setelah_diskon}</td>
<td>${r.total_final}</td>
<td>${r.status}</td>
</tr>
`;
            });

            /* SUBTOTAL INVOICE */
            table += `
<tr style="background:#f8fafc; font-weight:bold;">
<td colspan="5" style="text-align:right;">Subtotal Invoice</td>
<td>${g.qty}</td>
<td>${g.cost}</td>
<td colspan="3"></td>
<td>${g.final}</td>
<td>${profit}</td>
<td>${margin}%</td>
</tr>
`;
        });

        const grandProfit = grandFinal - grandCost;
        const grandMargin =
            grandFinal > 0 ? ((grandProfit / grandFinal) * 100).toFixed(2) : 0;

        /* GRAND TOTAL */
        table += `
<tr style="background:#cbd5f5; font-weight:bold;">
<td colspan="5" style="text-align:right;">GRAND TOTAL</td>
<td>${grandQty}</td>
<td>${grandCost}</td>
<td colspan="3"></td>
<td>${grandFinal}</td>
<td>${grandProfit}</td>
<td>${grandMargin}%</td>
</tr>
`;

        table += `</table>`;

        const blob = new Blob([table], {
            type: "application/vnd.ms-excel",
        });

        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");

        link.href = url;
        link.download = `Transaction_Report_${startDate}_${endDate}.xls`;
        link.click();
    };

    const [startDate, setStartDate] = useState(start_date);
    const [endDate, setEndDate] = useState(end_date);
    const [showPdfModal, setShowPdfModal] = useState(false);
    const [showExcelModal, setShowExcelModal] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();

        router.get("/admin/report/generate", {
            start_date: startDate,
            end_date: endDate,
        });
    };

    return (
        <>
            <style>
                {`
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

                    .report-icon{
                        width:52px;
                        height:52px;
                        border-radius:14px;
                        background:linear-gradient(135deg,#fff,#f3f4f6);
                        display:flex;
                        align-items:center;
                        justify-content:center;
                        box-shadow:0 6px 18px rgba(0,0,0,.08);
                        font-size:20px;
                    }

                    .control-card{
                        border-radius:16px;
                    }

                    .control-btn{
                        width:42px;
                        height:42px;
                        border-radius:12px;
                        display:flex;
                        align-items:center;
                        justify-content:center;
                    }

                    .modern-table thead{
                        background:#f9fafb;
                        font-size:13px;
                    }

                    .control-btn-saas{
                        width:42px;
                        height:42px;
                        border-radius:12px;
                        background:#fff;
                        border:1.5px solid #e5e7eb;
                        display:flex;
                        align-items:center;
                        justify-content:center;
                        transition:.25s;
                    }

                    .control-btn-saas:hover{
                        border-color:#6366f1;
                        color:#6366f1;
                        box-shadow:0 4px 12px rgba(99,102,241,.15);
                    }

                    .status-badge{
                        padding:6px 10px;
                        border-radius:999px;
                        font-size:12px;
                        font-weight:600;
                    }

                    .status-success{
                        background:#ecfdf5;
                        color:#059669;
                    }

                    .status-failed{
                        background:#fef2f2;
                        color:#dc2626;
                    }

                    .modern-table tbody tr:hover{
                        background:#f8fafc;
                        transition:.2s;
                    }

                    .modern-modal{
                        border-radius:18px;
                        border:none;
                    }

                    .table-card{
                        border-radius:18px;
                        padding:12px;
                    }

                    .report-icon{
                        width:52px;
                        height:52px;
                        border-radius:14px;
                        background:linear-gradient(135deg,#6366f1,#8b5cf6);
                        display:flex;
                        align-items:center;
                        justify-content:center;
                        box-shadow:0 10px 25px rgba(99,102,241,.25);
                        font-size:20px;
                        color:white;
                    }

                    .modern-input{
                        border-radius:10px;
                        padding:10px;
                    }
                `}
            </style>

            <Head title="Transaction Report - EasyPOS" />

            <AdminLayout>
                <div className="container-fluid py-4">
                    {/* ================= HEADER ================= */}
                    <div className="saas-page-header saas-card">
                        <div className="saas-header-left">
                            <div className="saas-icon-box bg-primary ">
                                <i className="bi bi-graph-up"></i>
                            </div>

                            <div>
                                <h5 className="saas-title">
                                    Laporan Transaksi
                                </h5>
                                <p className="saas-subtitle">
                                    Monitor transaksi dan generate laporan
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* ================= CONTROL CARD ================= */}
                    <div className="card border-0 shadow-sm mb-4 control-card mt-4">
                        <div className="card-body d-flex align-items-center gap-2 flex-wrap justify-content-between">
                            {/* FILTER BUTTON */}
                            <button
                                className="btn control-btn-saas"
                                onClick={() => setShowFilterModal(true)}
                            >
                                <i className="bi bi-calendar3"></i>
                            </button>

                            {/* EXPORT */}
                            <div className="d-flex gap-2">
                                <button
                                    className="btn btn-danger"
                                    onClick={() => handleExportPDF(true)}
                                >
                                    <i className="bi bi-file-earmark-pdf me-1"></i>
                                    PDF
                                </button>

                                <button
                                    className="btn btn-success"
                                    onClick={() => handleExportExcel(true)}
                                >
                                    <i className="bi bi-file-earmark-excel me-1"></i>
                                    Excel
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* ================= TABLE ================= */}
                    <div className="card border-0 shadow-sm table-card">
                        <div
                            className="table-responsive"
                            style={{ maxHeight: "600px" }}
                        >
                            {reports.length > 0 ? (
                                <table className="table modern-table align-middle mb-0">
                                    <thead className="table-head-saas">
                                        <tr className="text-center">
                                            <th>No</th>
                                            <th>Invoice</th>
                                            <th>Tanggal</th>
                                            <th>Customer</th>
                                            <th>Produk</th>
                                            <th>Harga Pokok</th>
                                            <th>Harga Jual</th>
                                            <th>Qty</th>
                                            <th>Diskon</th>
                                            <th>Total Barang</th>
                                            <th>Subtotal</th>
                                            <th>Total Final</th>
                                            <th>Status</th>
                                        </tr>
                                    </thead>

                                    <tbody>
                                        {reports.map((r, i) => (
                                            <tr key={i}>
                                                <td>{i + 1}</td>
                                                <td>{r.invoice}</td>

                                                <td>
                                                    {new Date(
                                                        r.tanggal,
                                                    ).toLocaleDateString(
                                                        "id-ID",
                                                    )}
                                                </td>

                                                <td>{r.customer ?? "Guest"}</td>

                                                <td>{r.product_name}</td>

                                                <td className="text-end">
                                                    {Number(
                                                        r.cost_price,
                                                    ).toLocaleString("id-ID", {
                                                        style: "currency",
                                                        currency: "IDR",
                                                    })}
                                                </td>

                                                <td className="text-end">
                                                    {Number(
                                                        r.selling_price,
                                                    ).toLocaleString("id-ID", {
                                                        style: "currency",
                                                        currency: "IDR",
                                                    })}
                                                </td>

                                                <td className="text-center">
                                                    {r.quantity}
                                                </td>

                                                <td className="text-danger text-end">
                                                    {Number(
                                                        r.discount,
                                                    ).toLocaleString("id-ID", {
                                                        style: "currency",
                                                        currency: "IDR",
                                                    })}
                                                </td>

                                                <td className="text-end">
                                                    {Number(
                                                        r.subtotal_barang,
                                                    ).toLocaleString("id-ID", {
                                                        style: "currency",
                                                        currency: "IDR",
                                                    })}
                                                </td>

                                                <td className="fw-bold text-end">
                                                    {Number(
                                                        r.subtotal_setelah_diskon,
                                                    ).toLocaleString("id-ID", {
                                                        style: "currency",
                                                        currency: "IDR",
                                                    })}
                                                </td>

                                                <td className="text-success fw-bold text-end">
                                                    {Number(
                                                        r.total_final,
                                                    ).toLocaleString("id-ID", {
                                                        style: "currency",
                                                        currency: "IDR",
                                                    })}
                                                </td>

                                                <td className="text-center">
                                                    <span
                                                        className={`badge status-badge ${
                                                            r.status ===
                                                            "success"
                                                                ? "status-success"
                                                                : r.status ===
                                                                    "pending"
                                                                  ? "status-pending"
                                                                  : "status-failed"
                                                        }`}
                                                    >
                                                        {r.status ?? "pending"}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            ) : (
                                <div className="text-center py-5 text-muted">
                                    Data tidak ditemukan
                                </div>
                            )}
                        </div>

                        {/* TOTAL ROWS */}
                        <div className="px-3 py-2">
                            <small className="text-muted">
                                Total Rows: {reports.length}
                            </small>
                        </div>
                    </div>

                    {/* ================= FILTER MODAL ================= */}
                    {showFilterModal && (
                        <div className="modal fade show d-block modal-backdrop-custom">
                            <div className="modal-dialog modal-dialog-centered">
                                <div className="modal-content border-0 rounded-4 shadow-lg overflow-hidden">
                                    <form onSubmit={handleSubmit}>
                                        {/* HEADER */}
                                        <div className="modal-header border-0 px-4 pt-4 pb-2">
                                            <div>
                                                <h5 className="fw-bold mb-0">
                                                    Filter laporan transaksi
                                                </h5>
                                                <small className="text-muted">
                                                    Pilih renta waktu laporan
                                                </small>
                                            </div>

                                            <button
                                                type="button"
                                                className="btn-close"
                                                onClick={() =>
                                                    setShowFilterModal(false)
                                                }
                                            />
                                        </div>

                                        {/* BODY */}
                                        <div className="modal-body px-4 pb-3">
                                            <div className="row g-3">
                                                {/* START DATE */}
                                                <div className="col-12 col-md-6">
                                                    <label className="form-label small text-muted mb-1">
                                                        Tanggal Awal
                                                    </label>

                                                    <div className="position-relative">
                                                        <input
                                                            type="date"
                                                            className="form-control ps-5 py-2 rounded-3 border-0 shadow-sm"
                                                            value={startDate}
                                                            onChange={(e) =>
                                                                setStartDate(
                                                                    e.target
                                                                        .value,
                                                                )
                                                            }
                                                        />
                                                        <i className="bi bi-calendar position-absolute top-50 start-0 translate-middle-y ms-3 text-muted"></i>
                                                    </div>
                                                </div>

                                                {/* END DATE */}
                                                <div className="col-12 col-md-6">
                                                    <label className="form-label small text-muted mb-1">
                                                        Tanggal Akhir
                                                    </label>

                                                    <div className="position-relative">
                                                        <input
                                                            type="date"
                                                            className="form-control ps-5 py-2 rounded-3 border-0 shadow-sm"
                                                            value={endDate}
                                                            onChange={(e) =>
                                                                setEndDate(
                                                                    e.target
                                                                        .value,
                                                                )
                                                            }
                                                        />
                                                        <i className="bi bi-calendar position-absolute top-50 start-0 translate-middle-y ms-3 text-muted"></i>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* QUICK PRESET */}
                                            <div className="mt-4">
                                                <small className="text-muted d-block mb-2">
                                                    Pilih Cepat
                                                </small>

                                                <div className="d-flex flex-wrap gap-2">
                                                    <button
                                                        type="button"
                                                        className="btn btn-light btn-sm rounded-3"
                                                        onClick={() => {
                                                            const today =
                                                                new Date()
                                                                    .toISOString()
                                                                    .slice(
                                                                        0,
                                                                        10,
                                                                    );
                                                            setStartDate(today);
                                                            setEndDate(today);
                                                        }}
                                                    >
                                                        Hari
                                                    </button>

                                                    <button
                                                        type="button"
                                                        className="btn btn-light btn-sm rounded-3"
                                                        onClick={() => {
                                                            const d =
                                                                new Date();
                                                            const first =
                                                                new Date(
                                                                    d.getFullYear(),
                                                                    d.getMonth(),
                                                                    1,
                                                                )
                                                                    .toISOString()
                                                                    .slice(
                                                                        0,
                                                                        10,
                                                                    );
                                                            const last =
                                                                new Date()
                                                                    .toISOString()
                                                                    .slice(
                                                                        0,
                                                                        10,
                                                                    );
                                                            setStartDate(first);
                                                            setEndDate(last);
                                                        }}
                                                    >
                                                        Bulan ini
                                                    </button>
                                                </div>
                                            </div>
                                        </div>

                                        {/* FOOTER */}
                                        <div className="modal-footer border-0 px-4 pb-4 pt-2">
                                            <button
                                                type="button"
                                                className="btn btn-light rounded-3 px-3"
                                                onClick={() =>
                                                    setShowFilterModal(false)
                                                }
                                            >
                                                Batal
                                            </button>

                                            <button className="btn btn-primary rounded-3 px-4 shadow-sm">
                                                Jalankan Filter
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            </div>

                            {/* BACKDROP */}
                            <style>
                                {`
                                    .modal-backdrop-custom {
                                        background: rgba(0,0,0,0.4);
                                    }
                                `}
                            </style>
                        </div>
                    )}
                </div>
            </AdminLayout>

            {/* ================= STYLE ================= */}
            <style>{`

            `}</style>
        </>
    );
}
