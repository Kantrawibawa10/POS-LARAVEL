import React, { useMemo } from "react";
import { Head, useForm, usePage } from "@inertiajs/react";
import Swal from "sweetalert2";
import AdminLayout from "../../../Layouts/AdminLayout";

export default function RoleEdit() {
    const { permissions, role, rolePermissions } = usePage().props;

    const { data, setData, put, processing, errors } = useForm({
        name: role.name,
        permissions: rolePermissions || [],
    });

    const handlePermissionChange = (e) => {
        const { value, checked } = e.target;
        const permId = parseInt(value);
        setData(
            "permissions",
            checked
                ? [...data.permissions, permId]
                : data.permissions.filter((id) => id !== permId),
        );
    };

    /*
        |--------------------------------------------------------------------------
        | GROUP PERMISSIONS (SaaS STANDARD)
        |--------------------------------------------------------------------------
        */
    const groupedPermissions = useMemo(() => {
        const groups = {
            view: [],
            create: [],
            modify: [],
            delete: [],
        };

        permissions.forEach((perm) => {
            const name = perm.name.toLowerCase();

            if (
                name.includes("dashboard") ||
                name.includes("index") ||
                name.includes("view")
            ) {
                groups.view.push(perm);
            } else if (name.includes("create") || name.includes("store")) {
                groups.create.push(perm);
            } else if (
                name.includes("edit") ||
                name.includes("update") ||
                name.includes("modify")
            ) {
                groups.modify.push(perm);
            } else if (name.includes("delete") || name.includes("destroy")) {
                groups.delete.push(perm);
            }
        });

        return groups;
    }, [permissions]);

    const handleSubmit = (e) => {
        e.preventDefault();
        put(`/admin/roles/${role.id}`, {
            onSuccess: () => {
                Swal.fire({
                    title: "Berhasil!",
                    text: "Role berhasil diperbarui.",
                    icon: "success",
                    timer: 1500,
                    showConfirmButton: false,
                });
            },
            onError: () => {
                Swal.fire({
                    title: "Gagal!",
                    text: "Terjadi kesalahan saat memperbarui role.",
                    icon: "error",
                    showConfirmButton: true,
                });
            },
        });
    };

    function PermissionSection({ title, items = [], selected = [], onChange }) {
        if (!items.length) return null;

        return (
            <div className="mb-4">
                <div className="permission-header mb-3">{title}</div>

                <div className="row px-4">
                    {items.map((perm) => (
                        <div key={perm.id} className="col-12 col-md-6 col-lg-4">
                            <div className="form-check permission-item gap-2">
                                <input
                                    className="form-check-input"
                                    type="checkbox"
                                    value={perm.id}
                                    id={`perm-${perm.id}`}
                                    checked={selected.includes(Number(perm.id))}
                                    onChange={onChange}
                                />

                                <label
                                    className="form-check-label small"
                                    htmlFor={`perm-${perm.id}`}
                                >
                                    {perm.name}
                                </label>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <>
            <Head title="Edit Role - EasyPOS" />

            <AdminLayout>
                <div className="row mt-4">
                    <div className="col-12">
                        <div className="card border-0 shadow-sm">
                            {/* ===== SaaS HEADER ===== */}
                            <div className="saas-page-header">
                                <div className="saas-header-left">
                                    <div className="saas-icon-box bg-primary">
                                        <i className="bi bi-shield-fill-check"></i>
                                    </div>

                                    <div>
                                        <p className="saas-title">
                                            Ubah Role {role.name}
                                        </p>
                                        <p className="saas-subtitle">
                                            Update System Permissions Access
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* ===== FORM ===== */}
                            <div className="card-body">
                                <div className="saas-form-container">
                                    <form onSubmit={handleSubmit}>
                                        {/* ROLE NAME */}
                                        <div className="mb-3">
                                            <label className="form-label fw-bold">
                                                Role Name
                                            </label>
                                            <input
                                                type="text"
                                                className={`form-control ${
                                                    errors.name
                                                        ? "is-invalid"
                                                        : ""
                                                }`}
                                                value={data.name}
                                                onChange={(e) =>
                                                    setData(
                                                        "name",
                                                        e.target.value,
                                                    )
                                                }
                                                placeholder="Enter Role Name"
                                            />
                                            {errors.name && (
                                                <div className="alert alert-danger mt-2 py-1 px-2">
                                                    {errors.name}
                                                </div>
                                            )}
                                        </div>
                                        <hr />
                                        {/* ===== PERMISSIONS ===== */}
                                        <label className="fw-bold mb-3">
                                            Permissions
                                        </label>
                                        <PermissionSection
                                            title="Permission View Form"
                                            items={groupedPermissions.view}
                                            selected={data.permissions}
                                            onChange={handlePermissionChange}
                                        />
                                        <PermissionSection
                                            title="Permission Create Form"
                                            items={groupedPermissions.create}
                                            selected={data.permissions}
                                            onChange={handlePermissionChange}
                                        />
                                        <PermissionSection
                                            title="Permission Modify Form"
                                            items={groupedPermissions.modify}
                                            selected={data.permissions}
                                            onChange={handlePermissionChange}
                                        />
                                        <PermissionSection
                                            title="Permission Delete Form"
                                            items={groupedPermissions.delete}
                                            selected={data.permissions}
                                            onChange={handlePermissionChange}
                                        />
                                        {errors.permissions && (
                                            <div className="alert alert-danger mt-2 py-1 px-2">
                                                {errors.permissions}
                                            </div>
                                        )}
                                        {/* BUTTON */}
                                        <div className="d-flex justify-content-end mt-4 gap-2">
                                            <button
                                                type="button"
                                                className="btn btn-danger"
                                                onClick={() =>
                                                    window.history.back()
                                                }
                                            >
                                                <i class="bi bi-arrow-left me-2"></i>
                                                Kembali
                                            </button>

                                            <button
                                                type="button"
                                                className="btn btn-warning"
                                                onClick={() => reset()}
                                            >
                                                <i className="bi bi-arrow-counterclockwise me-2"></i>
                                                Reset
                                            </button>

                                            <button
                                                type="submit"
                                                className="btn btn-primary me-2"
                                                disabled={processing}
                                            >
                                                {processing ? (
                                                    <>
                                                        <span className="spinner-border spinner-border-sm me-2"></span>
                                                        Loading...
                                                    </>
                                                ) : (
                                                    <>
                                                        <i className="bi bi-save me-2"></i>
                                                        Simpan Data
                                                    </>
                                                )}
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </AdminLayout>

            {/* ===== LOCAL STYLE (SAME AS CREATE) ===== */}
            <style>{`
            .permission-header{
                font-size:14px;
                font-weight:600;
                border-left:4px solid #0d6efd;
                padding-left:10px;
                color:#111827;
            }

            .permission-item{
                padding:6px 8px;
                border-radius:8px;
                transition:.2s;
            }

            .permission-item:hover{
                background:#f9fafb;
            }

            .saas-page-header{
                padding:20px 24px;
                border-bottom:1px solid #f1f1f1;
                display:flex;
                align-items:center;
            }

            .saas-header-left{
                display:flex;
                align-items:center;
                gap:14px;
            }

            .saas-icon-box{
                width:42px;
                height:42px;
                border-radius:12px;
                display:flex;
                align-items:center;
                justify-content:center;
                color:white;
                font-size:18px;
            }

            .saas-title{
                font-weight:600;
                margin:0;
            }

            .saas-subtitle{
                font-size:13px;
                color:#6b7280;
                margin:0;
            }

            .saas-form-container{
                padding: 10px 14px;
                max-width: 1100px;
                margin: 0 auto;
            }

            /* ===== PERMISSION GROUP ===== */

            .permission-group{
                margin-bottom:18px;
            }

            .permission-header{
                font-size:13px;
                font-weight:600;
                border-left:4px solid #0d6efd;
                padding-left:10px;
                margin-bottom:10px;
                color:#111827;
            }

            /* GRID COMPACT */
            .permission-grid{
                display:grid;
                grid-template-columns:repeat(auto-fill,minmax(260px,1fr));
                gap:6px 14px;
            }

            /* ITEM */
            .permission-item{
                display:flex;
                align-items:center;
                padding:6px 10px;
                border-radius:8px;
                cursor:pointer;
                transition:.15s ease;
                font-size:14px;
            }

            .permission-item:hover{
                background:#f9fafb;
            }

            /* checkbox alignment */
            .permission-item input{
                margin-top:0;
            }
            `}</style>
        </>
    );
}
