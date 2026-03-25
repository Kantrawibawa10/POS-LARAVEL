import React, { useState } from "react";
import { Head, usePage, Link, router } from "@inertiajs/react";
import Swal from "sweetalert2";
import Pagination from "../../../Components/Pagination";
import AdminLayout from "../../../Layouts/AdminLayout";
import hasAnyPermission from "../../../utils/hasAnyPermission";

export default function UserIndex() {
    const { users } = usePage().props;
    const [filterText, setFilterText] = useState("");

    const filteredUsers = users.data.filter(
        (user) =>
            user.name.toLowerCase().includes(filterText.toLowerCase()) ||
            user.email.toLowerCase().includes(filterText.toLowerCase()),
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
                router.delete(`/admin/users/${id}`, {
                    onSuccess: () =>
                        Swal.fire("Berhasil", "User dihapus", "success"),
                });
            }
        });
    };

    return (
        <>
            <Head title="Users - EasyPOS" />

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
                                <i className="bi bi-people-fill text-white fs-5"></i>
                            </div>

                            <div>
                                <h5 className="fw-semibold mb-1">
                                    Users Management
                                </h5>
                                <small className="text-muted">
                                    Manage system users and access roles
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
                                placeholder="Search"
                                className="border-0 bg-transparent"
                                style={{
                                    outline: "none",
                                    fontSize: "14px",
                                }}
                                value={filterText}
                                onChange={(e) => setFilterText(e.target.value)}
                            />
                        </div>

                        {hasAnyPermission(["users.create"]) && (
                            <Link
                                href="/admin/users/create"
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
                                    <th className="py-3">Name</th>
                                    <th className="py-3">Email</th>
                                    <th className="py-3">Role</th>
                                    <th
                                        className="text-center py-3"
                                        width="150"
                                    >
                                        Action
                                    </th>
                                </tr>
                            </thead>

                            <tbody>
                                {filteredUsers.map((user, index) => (
                                    <tr key={user.id}>
                                        <td className="text-center text-muted py-3">
                                            {index +
                                                1 +
                                                (users.current_page - 1) *
                                                    users.per_page}
                                        </td>

                                        <td className="fw-medium py-3">
                                            {user.name}
                                        </td>

                                        <td className="text-muted py-3">
                                            {user.email}
                                        </td>

                                        <td className="py-3">
                                            <div className="d-flex flex-wrap gap-1">
                                                {user.roles.map((role, i) => (
                                                    <span
                                                        key={i}
                                                        className="px-2 py-1"
                                                        style={{
                                                            fontSize: "12px",
                                                            borderRadius: "8px",
                                                            background:
                                                                "#f1f5f9",
                                                            border: "1px solid #e2e8f0",
                                                            color: "#334155",
                                                        }}
                                                    >
                                                        {role.name}
                                                    </span>
                                                ))}
                                            </div>
                                        </td>

                                        <td className="text-center py-3">
                                            <div className="d-flex justify-content-center gap-2">
                                                {hasAnyPermission([
                                                    "users.edit",
                                                ]) && (
                                                    <Link
                                                        href={`/admin/users/${user.id}/edit`}
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
                                                    "users.delete",
                                                ]) && (
                                                    <button
                                                        onClick={() =>
                                                            handleDelete(
                                                                user.id,
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

                    <div
                        className="px-4 py-3 d-flex justify-content-start"
                        style={{
                            borderTop: "1px solid #f1f3f5",
                            background: "#fff",
                        }}
                    >
                        <Pagination links={users.links} />
                    </div>
                </div>
            </AdminLayout>
        </>
    );
}
