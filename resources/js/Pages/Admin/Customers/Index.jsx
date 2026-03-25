import React, { useState } from "react";
import { Head, usePage, Link, router } from "@inertiajs/react";
import Swal from "sweetalert2";
import Pagination from "../../../Components/Pagination";
import AdminLayout from "../../../Layouts/AdminLayout";
import hasAnyPermission from "../../../utils/hasAnyPermission";

export default function CustomerIndex() {
    const { customers, filters = {} } = usePage().props;
    const [search, setSearch] = useState(filters.q || "");

    const handleDelete = (id) => {
        Swal.fire({
            title: "Apakah Anda yakin?",
            text: "Data ini akan dihapus permanen!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#dc3545",
            cancelButtonColor: "#6c757d",
            confirmButtonText: "Ya, hapus",
        }).then((result) => {
            if (result.isConfirmed) {
                router.delete(`/admin/customers/${id}`, {
                    preserveScroll: true,
                    onSuccess: () => {
                        Swal.fire("Berhasil!", "Customer dihapus.", "success");
                    },
                });
            }
        });
    };

    return (
        <>
            <Head title="Customers - EasyPOS" />

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
                    {/* Top Section */}
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
                                <i className="bi bi-people text-white fs-5"></i>
                            </div>

                            <div>
                                <h5 className="fw-semibold mb-1">
                                    Customers Management
                                </h5>
                                <small className="text-muted">
                                    Kelola seluruh data customer
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
                                minWidth: "280px",
                            }}
                        >
                            <i className="bi bi-search text-muted me-2"></i>
                            <input
                                type="text"
                                placeholder="Search name / phone..."
                                className="border-0 bg-transparent"
                                style={{ outline: "none", fontSize: "14px" }}
                                value={search}
                                onChange={(e) => {
                                    const value = e.target.value;
                                    setSearch(value);

                                    router.get(
                                        "/admin/customers",
                                        { q: value },
                                        {
                                            preserveState: true,
                                            replace: true,
                                        },
                                    );
                                }}
                            />
                        </div>

                        {/* Add Button */}
                        {hasAnyPermission(["customers.create"]) && (
                            <Link
                                href="/admin/customers/create"
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
                                Tambah Customer
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
                                    <th width="60" className="text-center py-3">
                                        #
                                    </th>
                                    <th className="py-3">Name</th>
                                    <th className="py-3">Phone</th>
                                    <th className="py-3">Address</th>
                                    <th className="py-3">Gender</th>
                                    <th
                                        width="150"
                                        className="text-center py-3"
                                    >
                                        Actions
                                    </th>
                                </tr>
                            </thead>

                            <tbody>
                                {customers.data.length > 0 ? (
                                    customers.data.map((customer, index) => (
                                        <tr key={customer.id}>
                                            <td className="text-center text-muted py-3">
                                                {index +
                                                    1 +
                                                    (customers.current_page -
                                                        1) *
                                                        customers.per_page}
                                            </td>

                                            <td className="fw-medium py-3">
                                                {customer.name ?? "-"}
                                            </td>

                                            <td className="py-3 text-muted">
                                                {customer.phone ?? "-"}
                                            </td>

                                            <td className="py-3 text-muted">
                                                {customer.address ?? "-"}
                                            </td>

                                            <td className="py-3">
                                                <span
                                                    style={{
                                                        fontSize: "12px",
                                                        padding: "4px 10px",
                                                        borderRadius: "8px",
                                                        background:
                                                            customer.gender ===
                                                            "male"
                                                                ? "#dbeafe"
                                                                : customer.gender ===
                                                                    "female"
                                                                  ? "#fee2e2"
                                                                  : "#f1f5f9",
                                                        color:
                                                            customer.gender ===
                                                            "male"
                                                                ? "#1e3a8a"
                                                                : customer.gender ===
                                                                    "female"
                                                                  ? "#991b1b"
                                                                  : "#475569",
                                                    }}
                                                >
                                                    {customer.gender
                                                        ? customer.gender
                                                              .charAt(0)
                                                              .toUpperCase() +
                                                          customer.gender.slice(
                                                              1,
                                                          )
                                                        : "N/A"}
                                                </span>
                                            </td>

                                            <td className="text-center py-3">
                                                <div className="d-flex justify-content-center gap-2">
                                                    {hasAnyPermission([
                                                        "customers.edit",
                                                    ]) && (
                                                        <Link
                                                            href={`/admin/customers/${customer.id}/edit`}
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
                                                        "customers.delete",
                                                    ]) && (
                                                        <button
                                                            onClick={() =>
                                                                handleDelete(
                                                                    customer.id,
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
                                            className="text-center py-5 text-muted"
                                        >
                                            Tidak ada data customer
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
                        <Pagination links={customers.links} />
                    </div>
                </div>
            </AdminLayout>
        </>
    );
}
