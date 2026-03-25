import React from "react";
import { Head, usePage, Link, router } from "@inertiajs/react";
import Swal from "sweetalert2";
import Pagination from "../../../Components/Pagination";
import AdminLayout from "../../../Layouts/AdminLayout";
import hasAnyPermission from "../../../utils/hasAnyPermission";
import { useState } from "react";

export default function UnitIndex() {
    const { units, filters } = usePage().props;
    const [search, setSearch] = useState(filters?.q || "");

    const handleDelete = (id) => {
        Swal.fire({
            title: "Apakah Anda yakin?",
            text: "Anda tidak akan bisa membatalkan tindakan ini!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#3085d6",
            confirmButtonText: "Ya, hapus!",
        }).then((result) => {
            if (result.isConfirmed) {
                router.delete(`/admin/units/${id}`, {
                    onSuccess: () => {
                        Swal.fire("Dihapus!", "Unit telah dihapus.", "success");
                    },
                    onError: () => {
                        Swal.fire(
                            "Error!",
                            "Terjadi masalah saat menghapus unit.",
                            "error",
                        );
                    },
                });
            }
        });
    };

    return (
        <>
            <Head title="Units - EasyPOS" />

            <AdminLayout>
                {/* HEADER CARD */}
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
                        {/* LEFT: Icon + Title */}
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
                                <i className="bi bi-box-seam text-white fs-5"></i>
                            </div>

                            <div>
                                <h5 className="fw-semibold mb-1">
                                    Units Management
                                </h5>
                                <small className="text-muted">
                                    Manage product units used in transactions
                                </small>
                            </div>
                        </div>
                    </div>

                    {/* Search + Button */}
                    <div className="d-flex align-items-center gap-3 flex-wrap">
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
                                placeholder="Search units..."
                                className="border-0 bg-transparent"
                                style={{
                                    outline: "none",
                                    fontSize: "14px",
                                }}
                                value={search}
                                onChange={(e) => {
                                    const value = e.target.value;
                                    setSearch(value);

                                    router.get(
                                        "/admin/units",
                                        { q: value },
                                        {
                                            preserveState: true,
                                            replace: true,
                                        },
                                    );
                                }}
                            />
                        </div>

                        {hasAnyPermission(["units.create"]) && (
                            <Link
                                href="/admin/units/create"
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
                                Tambah Unit
                            </Link>
                        )}
                    </div>
                </div>

                {/* TABLE CARD */}
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
                                    <th className="text-center py-2" width="60">
                                        #
                                    </th>
                                    <th className="py-2">Nama Unit</th>
                                    <th
                                        className="text-center py-2"
                                        width="120"
                                    >
                                        Action
                                    </th>
                                </tr>
                            </thead>

                            <tbody>
                                {units.data.length > 0 ? (
                                    units.data.map((unit, index) => (
                                        <tr
                                            key={unit.id}
                                            style={{
                                                borderTop: "1px solid #f1f5f9",
                                            }}
                                        >
                                            <td className="text-center py-2">
                                                {index +
                                                    1 +
                                                    (units.current_page - 1) *
                                                        units.per_page}
                                            </td>

                                            <td className="fw-medium py-2">
                                                {unit.name ?? "-"}
                                            </td>

                                            <td className="text-center py-2">
                                                <div className="d-flex justify-content-center gap-2">
                                                    {hasAnyPermission([
                                                        "units.edit",
                                                    ]) && (
                                                        <Link
                                                            href={`/admin/units/${unit.id}/edit`}
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
                                                        "units.delete",
                                                    ]) && (
                                                        <button
                                                            onClick={() =>
                                                                handleDelete(
                                                                    unit.id,
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
                                            colSpan="3"
                                            className="text-center py-4 text-muted"
                                        >
                                            Tidak ada unit ditemukan
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    <div
                        className="px-4 py-3 d-flex justify-content-start"
                        style={{
                            borderTop: "1px solid #f1f3f5",
                            background: "#fff",
                        }}
                    >
                        <Pagination links={units.links} />
                    </div>
                </div>
            </AdminLayout>
        </>
    );
}
