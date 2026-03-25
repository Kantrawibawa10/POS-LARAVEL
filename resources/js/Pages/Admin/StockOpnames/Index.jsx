import React, { useState } from "react";
import { Head, usePage, Link } from "@inertiajs/react";
import Pagination from "../../../Components/Pagination";
import AdminLayout from "../../../Layouts/AdminLayout";
import Swal from "sweetalert2";
import { router } from "@inertiajs/react";

export default function StockOpnameIndex() {
    const { stockOpnames } = usePage().props;

    const [search, setSearch] = useState("");

    const isCompleted = (status) => status === "completed";

    /* ================= STATUS BADGE ================= */
    const getStatusBadge = (status) => {
        switch (status.toLowerCase()) {
            case "pending":
                return "bg-warning text-dark";
            case "completed":
                return "bg-success";
            case "canceled":
                return "bg-danger";
            default:
                return "bg-secondary";
        }
    };

    /* ================= FILTER ================= */
    const filteredStockOpnames = stockOpnames.data.filter(
        (item) =>
            item.opname_date.toLowerCase().includes(search.toLowerCase()) ||
            item.status.toLowerCase().includes(search.toLowerCase()),
    );

    const iconBtn = (color) => ({
        width: "36px",
        height: "36px",
        borderRadius: "10px",
        border: "1px solid #cbd5e1",
        color: color,
        background: "#fff",
        transition: "all .15s ease",
    });

    const handleDelete = (id) => {
        Swal.fire({
            title: "Hapus data?",
            text: "Data stock opname akan dihapus permanen",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#ef4444",
            cancelButtonColor: "#6b7280",
            confirmButtonText: "Ya, Hapus",
        }).then((result) => {
            if (result.isConfirmed) {
                router.delete(`/admin/stock-opnames/${id}`, {
                    preserveScroll: true,
                    onSuccess: () => {
                        Swal.fire(
                            "Deleted!",
                            "Stock Opname deleted",
                            "success",
                        );
                    },
                });
            }
        });
    };

    return (
        <>
            <Head title="Stock Opnames - EasyPOS" />

            <AdminLayout>
                {/* ================= HEADER CARD (SaaS STANDARD) ================= */}
                <div
                    className="shadow-sm mb-4"
                    style={{
                        background: "#fff",
                        borderRadius: "16px",
                        border: "1px solid #f1f3f5",
                        padding: "24px",
                    }}
                >
                    {/* TOP */}
                    <div className="d-flex justify-content-between align-items-start flex-wrap gap-3 mb-4">
                        {/* LEFT TITLE */}
                        <div className="d-flex align-items-center gap-3">
                            <div
                                style={{
                                    width: "44px",
                                    height: "44px",
                                    borderRadius: "14px",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                }}
                                className="bg-primary"
                            >
                                <i className="bi bi-clipboard-data text-white fs-5"></i>
                            </div>

                            <div>
                                <h5 className="fw-semibold mb-1">
                                    Stock Opname Management
                                </h5>
                                <small className="text-muted">
                                    Monitoring dan penyesuaian stok fisik barang
                                </small>
                            </div>
                        </div>
                    </div>

                    {/* SEARCH + BUTTON */}
                    <div className="d-flex align-items-center gap-3 flex-wrap">
                        {/* SEARCH */}
                        <div
                            className="d-flex align-items-center px-3"
                            style={{
                                height: "42px",
                                border: "1px solid #e5e7eb",
                                borderRadius: "12px",
                                background: "#f9fafb",
                                minWidth: "280px",
                            }}
                        >
                            <i className="bi bi-search text-muted me-2"></i>

                            <input
                                type="text"
                                placeholder="Search date or status..."
                                className="border-0 bg-transparent"
                                style={{ outline: "none", fontSize: "14px" }}
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </div>

                        {/* BUTTON */}
                        <Link
                            href="/admin/stock-opnames/create"
                            className="d-flex align-items-center justify-content-center px-4 bg-primary"
                            style={{
                                height: "42px",
                                borderRadius: "12px",
                                color: "#fff",
                                fontWeight: "500",
                                textDecoration: "none",
                            }}
                        >
                            <i className="bi bi-plus-lg me-2"></i>
                            Lakukan Stock Opname
                        </Link>
                    </div>
                </div>

                {/* ================= TABLE CARD ================= */}
                <div
                    className="shadow-sm"
                    style={{
                        borderRadius: "16px",
                        background: "#fff",
                        overflow: "hidden",
                        border: "1px solid #f1f3f5",
                    }}
                >
                    <div className="table-responsive">
                        <table className="table align-middle mb-0">
                            <thead
                                style={{
                                    background: "#f8fafc",
                                    fontSize: "13px",
                                    color: "#64748b",
                                }}
                            >
                                <tr>
                                    <th width="70" className="text-center py-2">
                                        #
                                    </th>
                                    <th>Date</th>
                                    <th>Status</th>
                                    <th className="text-center">Action</th>
                                </tr>
                            </thead>

                            <tbody>
                                {filteredStockOpnames.length > 0 ? (
                                    filteredStockOpnames.map((item, index) => (
                                        <tr
                                            key={item.id}
                                            style={{
                                                borderTop: "1px solid #f1f5f9",
                                            }}
                                        >
                                            <td className="text-center py-2">
                                                {index +
                                                    1 +
                                                    (stockOpnames.current_page -
                                                        1) *
                                                        stockOpnames.per_page}
                                            </td>

                                            <td className="fw-medium">
                                                {item.opname_date}
                                            </td>

                                            <td>
                                                <span
                                                    className={`badge rounded-pill px-3 ${getStatusBadge(
                                                        item.status,
                                                    )}`}
                                                >
                                                    {item.status}
                                                </span>
                                            </td>

                                            <td className="text-center">
                                                <div className="d-flex justify-content-center gap-2">
                                                    {isCompleted(
                                                        item.status,
                                                    ) ? (
                                                        <>
                                                            {/* LOCKED */}
                                                            <button
                                                                disabled
                                                                title="Stock opname locked"
                                                                className="d-flex align-items-center justify-content-center"
                                                                style={iconBtn(
                                                                    "#ef4444",
                                                                )}
                                                            >
                                                                <i className="bi bi-lock"></i>
                                                            </button>

                                                            {/* VIEW */}
                                                            <Link
                                                                href={`/admin/stock-opnames/${item.id}`}
                                                                title="View"
                                                                className="d-flex align-items-center justify-content-center"
                                                                style={iconBtn(
                                                                    "#4f46e5",
                                                                )}
                                                            >
                                                                <i className="bi bi-eye"></i>
                                                            </Link>
                                                        </>
                                                    ) : (
                                                        <>
                                                            {/* EDIT */}
                                                            <Link
                                                                href={`/admin/stock-opnames/${item.id}/edit`}
                                                                title="Edit"
                                                                className="d-flex align-items-center justify-content-center"
                                                                style={iconBtn(
                                                                    "#0ea5e9",
                                                                )}
                                                            >
                                                                <i className="bi bi-pencil"></i>
                                                            </Link>

                                                            {/* VIEW */}
                                                            <Link
                                                                href={`/admin/stock-opnames/${item.id}`}
                                                                title="View"
                                                                className="d-flex align-items-center justify-content-center"
                                                                style={iconBtn(
                                                                    "#4f46e5",
                                                                )}
                                                            >
                                                                <i className="bi bi-eye"></i>
                                                            </Link>

                                                            {/* DELETE */}
                                                            <button
                                                                onClick={() =>
                                                                    handleDelete(
                                                                        item.id,
                                                                    )
                                                                }
                                                                title="Delete"
                                                                className="d-flex align-items-center justify-content-center"
                                                                style={iconBtn(
                                                                    "#ef4444",
                                                                )}
                                                            >
                                                                <i className="bi bi-trash"></i>
                                                            </button>
                                                        </>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td
                                            colSpan="4"
                                            className="text-center py-4 text-muted"
                                        >
                                            Tidak ada data stock opname
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* PAGINATION */}
                    <div
                        className="px-4 py-3 d-flex justify-content-start"
                        style={{
                            borderTop: "1px solid #f1f3f5",
                            background: "#fff",
                        }}
                    >
                        <Pagination links={stockOpnames.links} />
                    </div>
                </div>
            </AdminLayout>
        </>
    );
}
