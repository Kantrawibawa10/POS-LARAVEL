import React, { useState, useEffect } from "react";
import { useForm, usePage } from "@inertiajs/react";
import Swal from "sweetalert2";

export default function Login() {
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const { flash } = usePage().props;

    const { data, setData, post, errors } = useForm({
        email: "",
        password: "",
    });

    const loginHandler = (e) => {
        e.preventDefault();

        if (isLoading) return; // prevent double submit

        setIsLoading(true);

        post("/login", {
            onFinish: () => setIsLoading(false),

            onError: () => {
                Swal.fire({
                    toast: true,
                    position: "top-end",
                    icon: "error",
                    title: "Email atau password salah",
                    timer: 2500,
                    showConfirmButton: false,
                    timerProgressBar: true,
                });
            },
        });
    };

    return (
        <section className="min-vh-100 d-flex align-items-center bg-light">
            <div className="container-fluid">
                <div className="row min-vh-100">
                    {/* LEFT - BRANDING */}
                    <div className="col-lg-6 d-none d-lg-flex align-items-center justify-content-center bg-primary bg-opacity-10">
                        <div className="text-center px-5">
                            <img
                                src="https://is3.cloudhost.id/kodemastery/pos.webp"
                                alt="EasyPOS"
                                className="img-fluid mb-4"
                                style={{ maxWidth: "420px" }}
                            />
                            <h2 className="fw-bold mb-2">
                                Welcome to{" "}
                                <span className="text-primary">EasyPOS</span>
                            </h2>
                            <p className="text-muted fs-6 mb-0">
                                Everything You Need!
                            </p>
                        </div>
                    </div>

                    {/* RIGHT - LOGIN */}
                    <div className="col-12 col-lg-6 d-flex align-items-center justify-content-center bg-white">
                        <div className="w-100" style={{ maxWidth: "420px" }}>
                            <div className="text-center mb-4">
                                <span className="fs-1">👋</span>
                                <h1 className="h3 fw-bold mt-2 mb-1">
                                    EasyPOS!
                                </h1>
                                <p className="text-muted">
                                    Silakan masuk dengan akun Anda
                                </p>
                            </div>

                            <form onSubmit={loginHandler}>
                                {/* EMAIL */}
                                <div className="mb-3">
                                    <label className="form-label fw-semibold">
                                        Alamat Email
                                    </label>
                                    <input
                                        type="email"
                                        className={`form-control form-control-lg ${
                                            errors.email ? "is-invalid" : ""
                                        }`}
                                        placeholder="you@example.com"
                                        value={data.email}
                                        onChange={(e) =>
                                            setData("email", e.target.value)
                                        }
                                    />
                                    {errors.email && (
                                        <div className="invalid-feedback">
                                            {errors.email}
                                        </div>
                                    )}
                                </div>

                                {/* PASSWORD WITH EYE */}
                                <div className="mb-4">
                                    <label className="form-label fw-semibold">
                                        Kata Sandi
                                    </label>

                                    <div className="input-group input-group-lg">
                                        <input
                                            type={
                                                showPassword
                                                    ? "text"
                                                    : "password"
                                            }
                                            className={`form-control ${
                                                errors.password
                                                    ? "is-invalid"
                                                    : ""
                                            }`}
                                            placeholder="••••••••"
                                            value={data.password}
                                            onChange={(e) =>
                                                setData(
                                                    "password",
                                                    e.target.value,
                                                )
                                            }
                                        />
                                        <button
                                            type="button"
                                            className="btn btn-outline-secondary"
                                            onClick={() =>
                                                setShowPassword(!showPassword)
                                            }
                                            tabIndex={-1}
                                        >
                                            {showPassword ? (
                                                <i className="bi bi-eye-slash"></i>
                                            ) : (
                                                <i className="bi bi-eye"></i>
                                            )}
                                        </button>
                                    </div>

                                    {errors.password && (
                                        <div className="invalid-feedback d-block">
                                            {errors.password}
                                        </div>
                                    )}
                                </div>

                                {/* BUTTON */}
                                <button
                                    type="submit"
                                    className="btn btn-primary btn-lg w-100"
                                    disabled={isLoading}
                                >
                                    {isLoading ? (
                                        <span className="spinner-border spinner-border-sm" />
                                    ) : (
                                        "Login"
                                    )}
                                </button>
                            </form>

                            <p className="text-center text-muted small mt-4 mb-0">
                                © {new Date().getFullYear()} EasyPOS. All rights
                                reserved.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
