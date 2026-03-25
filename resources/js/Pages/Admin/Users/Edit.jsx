import React, { useState } from "react";
import { usePage, useForm, Head } from "@inertiajs/react";
import Swal from "sweetalert2";
import AdminLayout from "../../../Layouts/AdminLayout";

export default function UserEdit() {
    const { errors, roles, user } = usePage().props;

    const [showPassword, setShowPassword] = useState(false);
    const [showPasswordConfirmation, setShowPasswordConfirmation] =
        useState(false);

    const { data, setData, put, processing, reset } = useForm({
        name: user.name || "",
        email: user.email || "",
        password: "",
        password_confirmation: "",
        roles: user.roles.length ? user.roles[0].name : "",
    });

    const handleSubmit = (e) => {
        e.preventDefault();

        const payload = { ...data };

        if (!payload.password) {
            delete payload.password;
            delete payload.password_confirmation;
        }

        put(`/admin/users/${user.id}`, {
            data: payload,
            onSuccess: () =>
                Swal.fire({
                    icon: "success",
                    title: "Updated!",
                    text: "User updated successfully",
                    timer: 1500,
                    showConfirmButton: false,
                }),
            onError: () =>
                Swal.fire({
                    icon: "error",
                    title: "Failed",
                    text: "Update failed",
                }),
        });
    };

    return (
        <>
            <style>
                {`
                    .modern-input {
                        height: 46px;
                        border-radius: 12px;
                        border: 1px solid #e5e7eb;
                        background: #ffffff;
                        transition: all 0.2s ease;
                    }

                    .modern-input:focus {
                        border-color: #6366f1;
                        box-shadow: 0 0 0 3px rgba(99,102,241,0.15);
                    }

                    .modern-radio {
                        accent-color: #6366f1;
                        cursor: pointer;
                    }

                    .form-label {
                        font-weight: 600;
                        font-size: 14px;
                        margin-bottom: 6px;
                    }
                    .role-box{
                        padding:10px;
                        border-radius:10px;
                        border:1px solid #f1f5f9;
                        transition:.2s;
                    }

                    .role-box:hover{
                        background:#f9fafb;
                    }
                `}
            </style>

            <Head title="Edit User - EasyPOS" />

            <AdminLayout>
                <div className="container-fluid py-4">
                    <div
                        style={{
                            background: "#ffffff",
                            borderRadius: "18px",
                            padding: "36px",
                            maxWidth: "900px",
                            margin: "0 auto",
                            boxShadow: "0 10px 30px rgba(0,0,0,0.04)",
                            border: "1px solid #f1f3f5",
                        }}
                    >
                        {/* HEADER SaaS */}
                        <div className="d-flex align-items-center gap-3 mb-4">
                            <div
                                style={{
                                    width: "48px",
                                    height: "48px",
                                    borderRadius: "14px",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    boxShadow:
                                        "0 6px 16px rgba(99,102,241,0.35)",
                                }}
                                className="bg-primary"
                            >
                                <i className="bi bi-people text-white fs-5"></i>
                            </div>

                            <div>
                                <h5 className="fw-semibold mb-1">
                                    Ubah User {user.name}
                                </h5>
                                <small className="text-muted">
                                    Isi informasi user dengan lengkap dan benar
                                </small>
                            </div>
                        </div>

                        <form onSubmit={handleSubmit}>
                            <div className="row g-4">
                                {/* NAME */}
                                <div className="col-md-6">
                                    <div>
                                        <label className="form-label">
                                            Full Name
                                        </label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            value={data.name}
                                            onChange={(e) =>
                                                setData("name", e.target.value)
                                            }
                                        />
                                        {errors.name && (
                                            <div className="error-text">
                                                {errors.name}
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* EMAIL */}
                                <div className="col-md-6">
                                    <div>
                                        <label className="form-label">
                                            Email Address
                                        </label>
                                        <input
                                            type="email"
                                            className="form-control"
                                            value={data.email}
                                            onChange={(e) =>
                                                setData("email", e.target.value)
                                            }
                                        />
                                        {errors.email && (
                                            <div className="error-text">
                                                {errors.email}
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* PASSWORD */}
                                <div className="col-md-6">
                                    <div>
                                        <label className="form-label">
                                            Password
                                        </label>

                                        <div className="input-group">
                                            <input
                                                type={
                                                    showPassword
                                                        ? "text"
                                                        : "password"
                                                }
                                                className="form-control modern-input"
                                                value={data.password}
                                                onChange={(e) =>
                                                    setData(
                                                        "password",
                                                        e.target.value,
                                                    )
                                                }
                                                placeholder="Leave blank to keep current password"
                                            />

                                            <span
                                                className="input-group-text"
                                                onClick={() =>
                                                    setShowPassword(
                                                        !showPassword,
                                                    )
                                                }
                                            >
                                                <i
                                                    className={`bi ${showPassword ? "bi-eye-slash" : "bi-eye"}`}
                                                />
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* PASSWORD CONFIRM */}
                                <div className="col-md-6">
                                    <div>
                                        <label className="form-label">
                                            Password Confirmation
                                        </label>

                                        <div className="input-group">
                                            <input
                                                type={
                                                    showPasswordConfirmation
                                                        ? "text"
                                                        : "password"
                                                }
                                                className="form-control"
                                                value={
                                                    data.password_confirmation
                                                }
                                                onChange={(e) =>
                                                    setData(
                                                        "password_confirmation",
                                                        e.target.value,
                                                    )
                                                }
                                            />

                                            <span
                                                className="input-group-text"
                                                onClick={() =>
                                                    setShowPasswordConfirmation(
                                                        !showPasswordConfirmation,
                                                    )
                                                }
                                            >
                                                <i
                                                    className={`bi ${
                                                        showPasswordConfirmation
                                                            ? "bi-eye-slash"
                                                            : "bi-eye"
                                                    }`}
                                                />
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* ROLES */}
                                <div className="col-md-12">
                                    <div>
                                        <label className="form-label">
                                            Roles
                                        </label>

                                        <div className="row g-2 mt-1">
                                            {roles.map((role) => (
                                                <div
                                                    key={role.id}
                                                    className="col-md-6"
                                                >
                                                    <label className="role-box w-100">
                                                        <input
                                                            type="radio"
                                                            className="form-check-input me-2"
                                                            name="roles"
                                                            value={role.name}
                                                            checked={
                                                                data.roles ===
                                                                role.name
                                                            }
                                                            onChange={(e) =>
                                                                setData(
                                                                    "roles",
                                                                    e.target
                                                                        .value,
                                                                )
                                                            }
                                                        />
                                                        {role.name}
                                                    </label>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                {/* ACTION */}
                                <div className="col-md-12">
                                    <div className="d-flex justify-content-end gap-2">
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
                                            className="btn btn-primary"
                                            disabled={processing}
                                        >
                                            {processing ? (
                                                <>
                                                    <span className="spinner-border spinner-border-sm me-2"></span>
                                                    Updating...
                                                </>
                                            ) : (
                                                <>
                                                    <i className="bi bi-save me-2"></i>
                                                    Simpan Data
                                                </>
                                            )}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </AdminLayout>
        </>
    );
}
