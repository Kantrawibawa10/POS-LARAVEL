import React, { useState } from "react";
import { Link, usePage, router, Head } from "@inertiajs/react";
import Swal from "sweetalert2";
import Pagination from "../../../Components/Pagination";
import AdminLayout from "../../../Layouts/AdminLayout";
import hasAnyPermission from "../../../utils/hasAnyPermission";

export default function RoleIndex() {
    const { roles } = usePage().props;
    const [filterText, setFilterText] = useState("");

    const filteredRoles = roles.data.filter(
        (role) =>
            role.name.toLowerCase().includes(filterText.toLowerCase())
    );

    const handleDelete = (id) => {
        Swal.fire({
            title: "Yakin ingin menghapus?",
            text: "Data tidak dapat dikembalikan!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#dc3545",
            cancelButtonColor: "#6c757d",
            confirmButtonText: "Hapus",
        }).then((result) => {
            if (result.isConfirmed) {
                router.delete(`/admin/roles/${id}`, {
                    onSuccess: () =>
                        Swal.fire("Berhasil", "Role dihapus", "success"),
                });
            }
        });
    };

    return (
        <>
            <Head title="Roles - EasyPOS" />

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
                    {/* Top Section (Icon + Title) */}
                    <div className="d-flex align-items-center gap-3 mb-4">
                        {/* Gradient Icon */}
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
                            <i className="bi bi-shield-lock text-white fs-5"></i>
                        </div>

                        <div>
                            <h5 className="fw-semibold mb-1">
                                Roles Management
                            </h5>
                            <small className="text-muted">
                                Manage system access roles
                            </small>
                        </div>
                    </div>

                    {/* Bottom Section (Search + Button) */}
                    <div className="d-flex align-items-center gap-3 flex-wrap">
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
                                placeholder="Search role..."
                                className="border-0 bg-transparent"
                                style={{
                                    outline: "none",
                                    fontSize: "14px",
                                }}
                                value={filterText}
                                onChange={(e) => setFilterText(e.target.value)}
                            />
                        </div>

                        {/* Button */}
                        {hasAnyPermission(["roles.index"]) && (
                            <Link
                                href="/admin/roles/create"
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
                                    <th className="text-center py-3" width="60">
                                        #
                                    </th>
                                    <th className="py-3">Role Name</th>
                                    <th
                                        className="text-center py-3"
                                        width="140"
                                    >
                                        Action
                                    </th>
                                </tr>
                            </thead>

                            <tbody>
                                {filteredRoles.map((role, index) => (
                                    <tr key={role.id}>
                                        <td className="text-center text-muted py-3">
                                            {index +
                                                1 +
                                                (roles.current_page - 1) *
                                                    roles.per_page}
                                        </td>

                                        <td className="fw-medium py-3">
                                            {role.name}
                                        </td>

                                        <td className="text-center py-3">
                                            <div className="d-flex justify-content-center gap-2">
                                                {hasAnyPermission([
                                                    "roles.edit",
                                                ]) && (
                                                    <Link
                                                        href={`/admin/roles/${role.id}/edit`}
                                                        className="d-flex align-items-center justify-content-center"
                                                        style={{
                                                            width: "36px",
                                                            height: "36px",
                                                            borderRadius:
                                                                "10px",
                                                            border: "1px solid #cbd5e1",
                                                            background: "#fff",
                                                        }}
                                                    >
                                                        <i className="bi bi-pencil text-primary"></i>
                                                    </Link>
                                                )}

                                                {hasAnyPermission([
                                                    "roles.delete",
                                                ]) && (
                                                    <button
                                                        onClick={() =>
                                                            handleDelete(
                                                                role.id,
                                                            )
                                                        }
                                                        className="d-flex align-items-center justify-content-center"
                                                        style={{
                                                            width: "36px",
                                                            height: "36px",
                                                            borderRadius:
                                                                "10px",
                                                            border: "1px solid #cbd5e1",
                                                            background: "#fff",
                                                        }}
                                                    >
                                                        <i className="bi bi-trash text-danger"></i>
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    <div
                        className="d-flex justify-content-start align-items-center px-4 py-3"
                        style={{
                            borderTop: "1px solid #f1f3f5",
                            background: "#fff",
                            fontSize: "13px",
                        }}
                    >
                        <Pagination links={roles.links} />
                    </div>
                </div>
            </AdminLayout>
        </>
    );
}
