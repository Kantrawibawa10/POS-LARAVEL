import React, { useState, useMemo } from "react";
import { Head, usePage, Link } from "@inertiajs/react";
import AdminLayout from "../../../Layouts/AdminLayout";

export default function ShowStockOpname() {
    const { stockOpname } = usePage().props;

    const [filterText, setFilterText] = useState("");
    const [showExportModal, setShowExportModal] = useState(false);

    /* ======================================================
        FILTER DATA (Optimized)
    ====================================================== */
    const filteredDetails = useMemo(() => {
        return stockOpname.details.filter((detail) => {
            const name = detail.product?.name?.toLowerCase() || "";

            return (
                name.includes(filterText.toLowerCase()) ||
                String(detail.physical_quantity).includes(filterText)
            );
        });
    }, [filterText, stockOpname.details]);

    /* ======================================================
        DIFFERENCE FORMATTER
    ====================================================== */
    const formatDifference = (value) => {
        const number = Number(value);

        if (number > 0)
            return {
                label: `+${number}`,
                class: "bg-success-subtle text-success",
            };

        if (number < 0)
            return {
                label: `${number}`,
                class: "bg-danger-subtle text-danger",
            };

        return {
            label: "0",
            class: "bg-secondary-subtle text-secondary",
        };
    };

    /* ======================================================
        EXPORT EXCEL
    ====================================================== */
    const handleExport = () => {
        const today = new Date().toISOString().slice(0, 10);

        let table = `
        <table border="1">
            <thead>
                <tr>
                    <th>No</th>
                    <th>Product</th>
                    <th>Physical</th>
                    <th>System</th>
                    <th>Difference</th>
                </tr>
            </thead>
            <tbody>
        `;

        stockOpname.details.forEach((item, i) => {
            table += `
            <tr>
                <td>${i + 1}</td>
                <td>${item.product?.name ?? "-"}</td>
                <td>${item.physical_quantity}</td>
                <td>${item.product?.stock_total?.total_stock ?? 0}</td>
                <td>${item.quantity_difference}</td>
            </tr>`;
        });

        table += "</tbody></table>";

        const blob = new Blob(["\ufeff", table], {
            type: "application/vnd.ms-excel",
        });

        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");

        link.href = url;
        link.download = `stock-opname-${today}.xls`;
        link.click();

        URL.revokeObjectURL(url);
        setShowExportModal(false);
    };

    return (
        <AdminLayout>
            <Head title="Detail Stock Opname" />

            <div className="container-fluid p-4">
                {/* ================= SaaS HEADER ================= */}
                <div className="saas-page-header">
                    <div className="saas-header-left">
                        <div className="saas-icon-gradient">
                            <i className="bi bi-clipboard-data"></i>
                        </div>

                        <div>
                            <h5 className="saas-title">Stock Opname Detail</h5>
                            <p className="saas-subtitle">
                                Monitoring stock difference & validation
                            </p>
                        </div>
                    </div>

                    <button
                        className="btn btn-success rounded-pill px-4"
                        onClick={() => setShowExportModal(true)}
                    >
                        <i className="bi bi-file-earmark-excel me-2"></i>
                        Export Excel
                    </button>
                </div>

                {/* ================= ACTION BAR ================= */}
                <div className="card border-0 shadow-sm rounded-4 mb-4">
                    <div className="card-body d-flex flex-wrap gap-3 justify-content-between align-items-center">
                        <input
                            type="text"
                            className="form-control rounded-3"
                            style={{ maxWidth: 320 }}
                            placeholder="Search product..."
                            value={filterText}
                            onChange={(e) => setFilterText(e.target.value)}
                        />

                        <Link
                            href="/admin/stock-opnames"
                            className="btn btn-light rounded-pill px-4"
                        >
                            ← Back
                        </Link>
                    </div>
                </div>

                {/* ================= TABLE CARD ================= */}
                <div className="card border-0 shadow-sm rounded-4">
                    <div className="card-body p-3 p-lg-4">
                        {/* IMPORTANT: spacing wrapper */}
                        <div className="table-responsive saas-table-wrapper">
                            <table className="table align-middle saas-table mb-0">
                                <thead>
                                    <tr className="text-center">
                                        <th>No</th>
                                        <th className="text-start">Product</th>
                                        <th>Physical</th>
                                        <th>System</th>
                                        <th>Selisih</th>
                                        <th>Total Stock</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {filteredDetails.length ? (
                                        filteredDetails.map((detail, index) => {
                                            const diff = formatDifference(
                                                detail.quantity_difference,
                                            );

                                            return (
                                                <tr key={detail.id}>
                                                    <td className="text-center">
                                                        {index + 1}
                                                    </td>

                                                    <td className="fw-semibold text-start">
                                                        {detail.product?.name ??
                                                            "-"}
                                                    </td>

                                                    <td className="text-center">
                                                        {
                                                            detail.physical_quantity
                                                        }
                                                    </td>

                                                    <td className="text-center">
                                                        {detail.product
                                                            ?.stock_total
                                                            ?.total_stock ?? 0}
                                                    </td>

                                                    <td className="text-center">
                                                        <span
                                                            className={`badge rounded-pill px-3 py-2 ${diff.class}`}
                                                        >
                                                            {diff.label}
                                                        </span>
                                                    </td>

                                                    <td className="text-center fw-bold">
                                                        {detail.product
                                                            ?.stock_total
                                                            ?.total_stock ?? 0}
                                                    </td>
                                                </tr>
                                            );
                                        })
                                    ) : (
                                        <tr>
                                            <td
                                                colSpan="6"
                                                className="text-center py-5 text-muted"
                                            >
                                                No data found
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>

            {/* ================= EXPORT MODAL ================= */}
            {showExportModal && (
                <div className="modal fade show d-block">
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content rounded-4 border-0 shadow-lg">
                            <div className="modal-header">
                                <h5 className="fw-semibold">
                                    Export Stock Opname
                                </h5>
                                <button
                                    className="btn-close"
                                    onClick={() => setShowExportModal(false)}
                                />
                            </div>

                            <div className="modal-body text-muted">
                                Export data ke Excel (.xls)
                            </div>

                            <div className="modal-footer">
                                <button
                                    className="btn btn-light"
                                    onClick={() => setShowExportModal(false)}
                                >
                                    Cancel
                                </button>

                                <button
                                    className="btn btn-success"
                                    onClick={handleExport}
                                >
                                    Export
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <style>{`

/* ===== SaaS HEADER ===== */
.saas-page-header {
  background: #fff;
  border-radius: 18px;
  padding: 20px 24px;
  box-shadow: 0 6px 25px rgba(0,0,0,0.04);
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.saas-header-left {
  display: flex;
  align-items: center;
  gap: 14px;
}

.saas-icon-gradient {
  width: 46px;
  height: 46px;
  border-radius: 14px;
  background: linear-gradient(135deg,#22c55e,#16a34a);
  color: white;
  display:flex;
  align-items:center;
  justify-content:center;
  font-size:20px;
}

.saas-title {
  font-weight:600;
  margin:0;
}

.saas-subtitle {
  font-size:13px;
  color:#6b7280;
  margin:0;
}

/* ===== TABLE SaaS FIX ===== */
.saas-table-wrapper {
  padding: 6px;
}

.saas-table thead th {
  background:#f9fafb;
  border-bottom:1px solid #f1f5f9;
  font-weight:600;
}

.saas-table tbody tr {
  transition: all .15s ease;
}

.saas-table tbody tr:hover {
  background:#f9fafb;
}

`}</style>
        </AdminLayout>
    );
}
