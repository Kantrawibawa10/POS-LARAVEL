import React, { useState } from "react";
import { Head, usePage, Link, router } from "@inertiajs/react";
import Swal from "sweetalert2";
import Pagination from "../../../Components/Pagination";
import AdminLayout from "../../../Layouts/AdminLayout";
import hasAnyPermission from "../../../utils/hasAnyPermission";

export default function CategoryIndex() {
    const { categories, filters } = usePage().props; // Mendapatkan data categories dan filters dari props
    const [filterText, setFilterText] = useState(filters?.q || ""); // State untuk filter pencarian

    // Filter categories berdasarkan input pencarian
    const filteredCategories = categories.data.filter((category) =>
        category.name.toLowerCase().includes(filterText.toLowerCase()),
    );

    const handleDelete = (id) => {
        Swal.fire({
            title: "Apakah Anda yakin?",
            text: "Anda tidak akan bisa mengembalikannya lagi!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#3085d6",
            confirmButtonText: "Ya, hapus!",
        }).then((result) => {
            if (result.isConfirmed) {
                // Panggil route delete
                router.delete(`/admin/categories/${id}`, {
                    onSuccess: () => {
                        Swal.fire(
                            "Dihapus!",
                            "Kategori telah dihapus.",
                            "success",
                        );
                        window.location.reload(); // Refresh halaman setelah berhasil menghapus
                    },
                    onError: () => {
                        Swal.fire(
                            "Error!",
                            "Terjadi masalah saat menghapus kategori.",
                            "error",
                        );
                    },
                });
            }
        });
    };

    return (
        <>
            <Head title="Categories - EasyPOS" />

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
                    {/* Top Grid: Title Left - Breadcrumb Right */}
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
                                <i className="bi bi-tags-fill text-white fs-5"></i>
                            </div>

                            <div>
                                <h5 className="fw-semibold mb-1">
                                    Categories Management
                                </h5>
                                <small className="text-muted">
                                    Manage system categories and their
                                    properties
                                </small>
                            </div>
                        </div>
                    </div>

                    {/* Bottom Section (Search + Button) */}
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
                                placeholder="Search categories..."
                                className="border-0 bg-transparent"
                                style={{
                                    outline: "none",
                                    fontSize: "14px",
                                }}
                                value={filterText}
                                onChange={(e) => {
                                    const value = e.target.value;
                                    setFilterText(value);

                                    router.get(
                                        "/admin/categories",
                                        { q: value },
                                        {
                                            preserveState: true,
                                            replace: true,
                                        },
                                    );
                                }}
                            />
                        </div>

                        {hasAnyPermission(["categories.create"]) && (
                            <Link
                                href="/admin/categories/create"
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
                                Tambah Data
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
                                    <th className="py-2">Nama</th>
                                    <th
                                        className="text-center py-2"
                                        width="120"
                                    >
                                        Action
                                    </th>
                                </tr>
                            </thead>

                            <tbody>
                                {filteredCategories.length > 0 ? (
                                    filteredCategories.map(
                                        (category, index) => (
                                            <tr
                                                key={category.id}
                                                style={{
                                                    borderTop:
                                                        "1px solid #f1f5f9",
                                                }}
                                            >
                                                {/* FIX NaN HERE */}
                                                <td className="text-center py-2">
                                                    {index +
                                                        1 +
                                                        (categories.current_page -
                                                            1) *
                                                            categories.per_page}
                                                </td>

                                                <td className="fw-medium py-2">
                                                    {category.name}
                                                </td>

                                                <td className="text-center py-2">
                                                    <div className="d-flex justify-content-center gap-2">
                                                        {hasAnyPermission([
                                                            "categories.edit",
                                                        ]) && (
                                                            <Link
                                                                href={`/admin/categories/${category.id}/edit`}
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
                                                            "categories.delete",
                                                        ]) && (
                                                            <button
                                                                onClick={() =>
                                                                    handleDelete(
                                                                        category.id,
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
                                        ),
                                    )
                                ) : (
                                    <tr>
                                        <td
                                            colSpan="4"
                                            className="text-center py-4 text-muted"
                                        >
                                            Tidak ada kategori ditemukan
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    <div
                        className="px-4 py-3 d-flex justify-content-start"
                        style={{
                            borderTop: "1px solid #f1f3f5",
                            background: "#fff",
                        }}
                    >
                        <Pagination links={categories.links} />
                    </div>
                </div>
            </AdminLayout>
        </>
    );
}
