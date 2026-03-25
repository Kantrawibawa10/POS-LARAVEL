import React, { useState } from "react";
import { Head, Link, router, usePage } from "@inertiajs/react";
import Swal from "sweetalert2";
import Pagination from "../../../Components/Pagination";
import AdminLayout from "../../../Layouts/AdminLayout";
import hasAnyPermission from "../../../utils/hasAnyPermission";

export default function SupplierIndex() {
    const { suppliers } = usePage().props;
    const [filterText, setFilterText] = useState("");
    const [statusFilter, setStatusFilter] = useState("");

    const filteredSuppliers = suppliers.data.filter(
        (supplier) =>
            (supplier.name.toLowerCase().includes(filterText.toLowerCase()) || supplier.phone.toLowerCase().includes(filterText.toLowerCase()) || supplier.address.toLowerCase().includes(filterText.toLowerCase())) &&
            (statusFilter ? supplier.status === statusFilter : true),
    );

    const handleDelete = (id) => {
        Swal.fire({
            title: "Delete Supplier?",
            text: "Data yang dihapus tidak dapat dikembalikan.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#6c757d",
            confirmButtonText: "Ya, Hapus",
            cancelButtonText: "Batal",
            reverseButtons: true,
            focusCancel: true,
        }).then((result) => {
            if (!result.isConfirmed) return;

            router.delete(`/admin/suppliers/${id}`, {
                preserveScroll: true,
                preserveState: true,

                onStart: () => {
                    Swal.fire({
                        title: "Menghapus...",
                        text: "Mohon tunggu sebentar",
                        allowOutsideClick: false,
                        allowEscapeKey: false,
                        didOpen: () => {
                            Swal.showLoading();
                        },
                    });
                },

                onSuccess: () => {
                    Swal.fire({
                        toast: true,
                        position: "top-end",
                        icon: "success",
                        title: "Supplier berhasil dihapus",
                        showConfirmButton: false,
                        timer: 3000,
                        timerProgressBar: true,
                    });
                },

                onError: () => {
                    Swal.fire({
                        icon: "error",
                        title: "Gagal menghapus",
                        text: "Terjadi kesalahan pada server.",
                    });
                },
            });
        });
    };

    return (
        <>
            <Head>
                <title>Suppliers - EasyPOS</title>
            </Head>

            <AdminLayout>
                {/* ================= HEADER CARD ================= */}
                <div
                    className="shadow-sm mb-4"
                    style={{
                        background: "#fff",
                        borderRadius: "16px",
                        border: "1px solid #f1f3f5",
                        padding: "24px",
                    }}
                >
                    {/* Top Grid */}
                    <div className="d-flex justify-content-between align-items-start flex-wrap gap-3 mb-4">
                        {/* LEFT - ICON + TITLE */}
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
                                <i className="bi bi-truck text-white fs-5"></i>
                            </div>

                            <div>
                                <h5 className="fw-semibold mb-1">
                                    Suppliers Management
                                </h5>
                                <small className="text-muted">
                                    Manage supplier data and status
                                </small>
                            </div>
                        </div>
                    </div>

                    {/* Bottom Controls */}
                    <div className="d-flex flex-wrap align-items-center gap-3">
                        {/* Search */}
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
                                placeholder="Search supplier..."
                                className="border-0 bg-transparent"
                                style={{ outline: "none", fontSize: "14px" }}
                                value={filterText}
                                onChange={(e) => {
                                    const value = e.target.value;
                                    setFilterText(value);
                                    router.get(
                                        "/admin/suppliers",
                                        { q: value },
                                        {
                                            preserveState: true,
                                            replace: true,
                                        },
                                    );
                                }}
                            />
                        </div>

                        {/* Status Filter */}
                        <select
                            className="form-select"
                            style={{
                                height: "42px",
                                borderRadius: "12px",
                                maxWidth: "180px",
                                fontSize: "14px",
                            }}
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                        >
                            <option value="">All Statuses</option>
                            <option value="active">Active</option>
                            <option value="inactive">Inactive</option>
                        </select>

                        {/* Button */}
                        {hasAnyPermission(["suppliers.create"]) && (
                            <Link
                                href="/admin/suppliers/create"
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
                                Tambah Supplier
                            </Link>
                        )}
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
                                    <th className="text-center py-3">No.</th>
                                    <th className="py-3">Name</th>
                                    <th className="py-3">Phone</th>
                                    <th className="py-3">Address</th>
                                    <th className="py-3">Status</th>
                                    <th className="text-center py-3">
                                        Actions
                                    </th>
                                </tr>
                            </thead>

                            <tbody>
                                {filteredSuppliers.length > 0 ? (
                                    filteredSuppliers.map((supplier, index) => (
                                        <tr key={supplier.id}>
                                            <td className="text-center text-muted py-3">
                                                {index +
                                                    1 +
                                                    (suppliers.current_page -
                                                        1) *
                                                        suppliers.per_page}
                                            </td>

                                            <td className="fw-medium py-3">
                                                {supplier.name || "-"}
                                            </td>

                                            <td className="py-3 text-muted">
                                                {supplier.phone || "-"}
                                            </td>

                                            <td className="py-3 text-muted">
                                                {supplier.address || "-"}
                                            </td>

                                            <td className="py-3">
                                                <span
                                                    style={{
                                                        fontSize: "12px",
                                                        padding: "4px 10px",
                                                        borderRadius: "8px",
                                                        background:
                                                            supplier.status ===
                                                            "active"
                                                                ? "#dcfce7"
                                                                : "#f1f5f9",
                                                        color:
                                                            supplier.status ===
                                                            "active"
                                                                ? "#166534"
                                                                : "#475569",
                                                    }}
                                                >
                                                    {supplier.status
                                                        .charAt(0)
                                                        .toUpperCase() +
                                                        supplier.status.slice(
                                                            1,
                                                        )}
                                                </span>
                                            </td>

                                            <td className="text-center py-3">
                                                <div className="d-flex justify-content-center gap-2">
                                                    {hasAnyPermission([
                                                        "suppliers.edit",
                                                    ]) && (
                                                        <Link
                                                            href={`/admin/suppliers/${supplier.id}/edit`}
                                                            className="d-flex align-items-center justify-content-center"
                                                            style={{
                                                                width: "36px",
                                                                height: "36px",
                                                                borderRadius:
                                                                    "10px",
                                                                border: "1px solid #cbd5e1",
                                                                color: "#2563eb",
                                                                background:
                                                                    "#fff",
                                                            }}
                                                        >
                                                            <i className="bi bi-pencil"></i>
                                                        </Link>
                                                    )}

                                                    {hasAnyPermission([
                                                        "suppliers.delete",
                                                    ]) && (
                                                        <button
                                                            onClick={() =>
                                                                handleDelete(
                                                                    supplier.id,
                                                                )
                                                            }
                                                            className="d-flex align-items-center justify-content-center"
                                                            style={{
                                                                width: "36px",
                                                                height: "36px",
                                                                borderRadius:
                                                                    "10px",
                                                                border: "1px solid #cbd5e1",
                                                                color: "#ef4444",
                                                                background:
                                                                    "#fff",
                                                            }}
                                                        >
                                                            <i className="bi bi-trash"></i>
                                                        </button>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td
                                            colSpan="6"
                                            className="text-center py-4 text-muted"
                                        >
                                            No suppliers found
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination Left */}
                    <div
                        className="px-4 py-3 d-flex justify-content-start"
                        style={{
                            borderTop: "1px solid #f1f3f5",
                        }}
                    >
                        <Pagination links={suppliers.links} />
                    </div>
                </div>
            </AdminLayout>
        </>
    );
}
