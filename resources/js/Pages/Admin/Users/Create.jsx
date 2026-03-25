import React, { useState } from "react";
import { usePage, useForm, Head } from "@inertiajs/react";
import Swal from "sweetalert2";
import AdminLayout from "../../../Layouts/AdminLayout";

export default function UserCreate() {
    const { errors, roles } = usePage().props;

    const [showPassword, setShowPassword] = useState(false);
    const [showPasswordConfirmation, setShowPasswordConfirmation] =
        useState(false);

    const { data, setData, post, processing, reset } = useForm({
        name: "",
        email: "",
        password: "",
        password_confirmation: "",
        roles: "",
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post("/admin/users", {
            onSuccess: () => {
                Swal.fire({
                    title: "Success!",
                    text: "User created successfully!",
                    icon: "success",
                    timer: 1500,
                    showConfirmButton: false,
                });
            },
            onError: () => {
                Swal.fire({
                    title: "Failed!",
                    text: "There was an error creating the user.",
                    icon: "error",
                    showConfirmButton: true,
                });
            },
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

            <Head title="Create User - EasyPOS" />

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
                                    Tambah User Baru
                                </h5>
                                <small className="text-muted">
                                    Isi informasi user dengan lengkap dan benar
                                </small>
                            </div>
                        </div>

                        <form onSubmit={handleSubmit}>
                            <div className="row g-4">
                                {/* LEFT COLUMN */}
                                <div className="col-md-6">
                                    {/* Full Name */}
                                    <div>
                                        <label className="form-label">
                                            Full Name
                                        </label>
                                        <input
                                            type="text"
                                            className={`form-control modern-input ${errors.name ? "is-invalid" : ""}`}
                                            value={data.name}
                                            onChange={(e) =>
                                                setData("name", e.target.value)
                                            }
                                            placeholder="Enter Full Name"
                                        />
                                        {errors.name && (
                                            <div className="alert alert-danger mt-2 py-2 px-3">
                                                {errors.name}
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="col-md-6">
                                    {/* Email */}
                                    <div>
                                        <label className="form-label">
                                            Email Address
                                        </label>
                                        <input
                                            type="email"
                                            className={`form-control modern-input ${errors.email ? "is-invalid" : ""}`}
                                            value={data.email}
                                            onChange={(e) =>
                                                setData("email", e.target.value)
                                            }
                                            placeholder="Enter Email Address"
                                        />
                                        {errors.email && (
                                            <div className="alert alert-danger mt-2 py-2 px-3">
                                                {errors.email}
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* RIGHT COLUMN */}
                                <div className="col-md-6">
                                    {/* Password */}
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
                                                className={`form-control modern-input ${errors.password ? "is-invalid" : ""}`}
                                                value={data.password}
                                                onChange={(e) =>
                                                    setData(
                                                        "password",
                                                        e.target.value,
                                                    )
                                                }
                                                placeholder="Enter Password"
                                            />
                                            <span
                                                className="input-group-text"
                                                onClick={() =>
                                                    setShowPassword(
                                                        !showPassword,
                                                    )
                                                }
                                                style={{
                                                    cursor: "pointer",
                                                    borderRadius:
                                                        "0 12px 12px 0",
                                                    background: "#f9fafb",
                                                }}
                                            >
                                                <i
                                                    className={
                                                        showPassword
                                                            ? "bi bi-eye-slash"
                                                            : "bi bi-eye"
                                                    }
                                                ></i>
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <div className="col-md-6">
                                    {/* Password Confirmation */}
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
                                                className={`form-control modern-input ${errors.password_confirmation ? "is-invalid" : ""}`}
                                                value={
                                                    data.password_confirmation
                                                }
                                                onChange={(e) =>
                                                    setData(
                                                        "password_confirmation",
                                                        e.target.value,
                                                    )
                                                }
                                                placeholder="Confirm Password"
                                            />
                                            <span
                                                className="input-group-text"
                                                onClick={() =>
                                                    setShowPasswordConfirmation(
                                                        !showPasswordConfirmation,
                                                    )
                                                }
                                                style={{
                                                    cursor: "pointer",
                                                    borderRadius:
                                                        "0 12px 12px 0",
                                                    background: "#f9fafb",
                                                }}
                                            >
                                                <i
                                                    className={
                                                        showPasswordConfirmation
                                                            ? "bi bi-eye-slash"
                                                            : "bi bi-eye"
                                                    }
                                                ></i>
                                            </span>
                                        </div>
                                    </div>
                                </div>

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
                                        {errors.roles && (
                                            <div className="alert alert-danger mt-2 py-2 px-3">
                                                {errors.roles}
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="col-md-12 mb-2">
                                    <div className="d-flex justify-content-end gap-2">
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
                                            disabled={processing}
                                            className="btn btn-primary"
                                        >
                                            <>
                                                <i class="bi bi-save me-2"></i>
                                                {processing
                                                ? "Saving..."
                                                : "Simpan Data"}
                                            </>
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
