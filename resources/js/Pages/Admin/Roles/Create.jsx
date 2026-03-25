import React, { useMemo } from "react";
import { useForm, Head, usePage } from "@inertiajs/react";
import Swal from "sweetalert2";
import AdminLayout from "../../../Layouts/AdminLayout";

export default function RoleCreate() {
    const { errors, permissions } = usePage().props;

    const { data, setData, post, processing, reset } = useForm({
        name: "",
        permissions: [],
    });

    /*
    |--------------------------------------------------------------------------
    | Permission Handler
    |--------------------------------------------------------------------------
    */
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

    /*
    |--------------------------------------------------------------------------
    | Submit
    |--------------------------------------------------------------------------
    */
    const handleSubmit = (e) => {
        e.preventDefault();

        post("/admin/roles", {
            onSuccess: () =>
                Swal.fire({
                    title: "Berhasil!",
                    text: "Role baru berhasil dibuat.",
                    icon: "success",
                    timer: 1500,
                    showConfirmButton: false,
                }),
            onError: () =>
                Swal.fire({
                    title: "Gagal!",
                    text: "Terjadi kesalahan saat membuat role.",
                    icon: "error",
                }),
        });
    };

    /*
    |--------------------------------------------------------------------------
    | Permission Section Renderer
    |--------------------------------------------------------------------------
    */
    const PermissionSection = ({ title, items }) => {
        if (!items.length) return null;

        return (
            <div className="mb-4">
                <h6 className="permission-header mb-3">{title}</h6>

                <div className="row px-4">
                    {items.map((permission) => (
                        <div
                            key={permission.id}
                            className="col-12 col-md-6 col-lg-4"
                        >
                            <div className="form-check permission-item">
                                <input
                                    className="form-check-input"
                                    type="checkbox"
                                    value={permission.id}
                                    id={`perm-${permission.id}`}
                                    checked={data.permissions.includes(
                                        permission.id,
                                    )}
                                    onChange={handlePermissionChange}
                                />

                                <label
                                    className="form-check-label small"
                                    htmlFor={`perm-${permission.id}`}
                                >
                                    {permission.name}
                                </label>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    };

    return (
        <>
            <Head title="Create Roles - EasyPOS" />

            <AdminLayout>
                <div className="row mt-4">
                    <div className="col-12">
                        <div className="card border-0 shadow-sm">
                            {/* ===== SaaS HEADER ===== */}
                            <div className="saas-page-header">
                                <div className="saas-header-inner">
                                    <div className="saas-header-left">
                                        <div className="saas-icon-box bg-primary">
                                            <i className="bi bi-shield-fill-plus"></i>
                                        </div>

                                        <div>
                                            <p className="saas-title">
                                                Tambah Role Baru
                                            </p>
                                            <p className="saas-subtitle">
                                                Manage System Permissions Access
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* ===== FORM ===== */}
                            <div className="card-body">
                                <form onSubmit={handleSubmit}>
                                    {/* ROLE NAME */}
                                    <div className="mb-3">
                                        <label className="form-label fw-bold">
                                            Role Name
                                        </label>

                                        <input
                                            type="text"
                                            className={`form-control ${
                                                errors.name ? "is-invalid" : ""
                                            }`}
                                            value={data.name}
                                            onChange={(e) =>
                                                setData("name", e.target.value)
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
                                    />

                                    <PermissionSection
                                        title="Permission Create Form"
                                        items={groupedPermissions.create}
                                    />

                                    <PermissionSection
                                        title="Permission Modify Form"
                                        items={groupedPermissions.modify}
                                    />

                                    <PermissionSection
                                        title="Permission Delete Form"
                                        items={groupedPermissions.delete}
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
                                            onClick={() => window.history.back()}
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
                                            className="btn btn-primary"
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
            </AdminLayout>

            {/* ===== LOCAL STYLE ===== */}
            <style>{`
    /* ===============================
       SAAS FORM CONTAINER (FIX EDGE)
    =============================== */
    .card-body{
        padding: 22px 26px !important;
    }

    form{
        max-width: 1050px;
        margin: 0 auto;
    }

    /* ===============================
       PERMISSION HEADER
    =============================== */
    .permission-header{
        font-size:13px;
        font-weight:600;
        border-left:4px solid #0d6efd;
        padding-left:10px;
        margin-bottom:10px;
        color:#111827;
    }

    /* ===============================
       PERMISSION GRID (COMPACT)
    =============================== */
    .permission-grid{
        display:grid;
        grid-template-columns:repeat(auto-fill,minmax(260px,1fr));
        gap:6px 14px;
    }

    /* ===============================
       PERMISSION ITEM
    =============================== */
    .permission-item{
        display:flex;
        align-items:center;
        gap:8px;
        padding:6px 10px;
        border-radius:8px;
        transition:.15s ease;
        cursor:pointer;
        font-size:14px;
    }

    .permission-item:hover{
        background:#f9fafb;
    }

    /* checked highlight (SaaS feel) */
    .permission-item:has(input:checked){
        background:#ecfdf5;
    }

    .permission-item input{
        margin-top:0;
    }

    /* ===============================
       SAAS HEADER
    =============================== */
    .saas-page-header{
    padding: 24px 24px 16px 24px; /* sama dengan card-body */
    border-bottom: 1px solid #f1f3f5;
    background: #fff;
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
        flex-shrink:0;
    }

    .saas-title{
        font-weight:600;
        margin:0;
        font-size:16px;
    }

    .saas-subtitle{
        font-size:13px;
        color:#6b7280;
        margin:0;
    }

    /* ===============================
       FORM SPACING FIX
    =============================== */
    hr{
        margin:20px 0;
        opacity:.08;
    }

    .mb-3{
        margin-bottom:18px !important;
    }

`}</style>
        </>
    );
}
