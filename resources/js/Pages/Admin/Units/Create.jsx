import React from "react";
import { useForm, Head } from "@inertiajs/react";
import Swal from "sweetalert2";
import AdminLayout from "../../../Layouts/AdminLayout";

export default function UnitCreate() {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: "",
    });

    const handleSubmit = (e) => {
        e.preventDefault();

        post("/admin/units", {
            onSuccess: () => {
                Swal.fire({
                    title: "Success!",
                    text: "Unit created successfully!",
                    icon: "success",
                    showConfirmButton: false,
                    timer: 1500,
                });
                reset();
            },
        });
    };

    const handleBack = () => window.history.back();

    return (
        <>
            <style>
                {`
                    .saas-page-header{
                        padding:22px 24px;
                        border-bottom:1px solid #f1f5f9;
                        display:flex;
                        justify-content:space-between;
                        align-items:center;
                        background:white;
                    }

                    .saas-header-left{
                        display:flex;
                        align-items:center;
                        gap:14px;
                    }

                    .saas-icon-box{
                        width:44px;
                        height:44px;
                        border-radius:12px;
                        display:flex;
                        align-items:center;
                        justify-content:center;
                        color:white;
                        font-size:18px;
                    }

                    .saas-title{
                        margin:0;
                        font-weight:600;
                    }

                    .saas-subtitle{
                        font-size:13px;
                        color:#6b7280;
                        margin:0;
                    }

                    .saas-card{
                        background:white;
                        border-radius:14px;
                        padding:28px;
                        box-shadow:0 1px 2px rgba(0,0,0,.04);
                        border:1px solid #f1f5f9;
                    }

                    .saas-form-footer{
                        margin-top:30px;
                        padding-top:20px;
                        border-top:1px solid #f1f5f9;
                        display:flex;
                        justify-content:flex-end;
                    }

                    .modern-textarea {
                        border-radius: 12px;
                        border: 1px solid #e5e7eb;
                        background: #ffffff;
                        transition: all 0.2s ease;
                    }

                    .modern-textarea:focus {
                        border-color: #6366f1;
                        box-shadow: 0 0 0 3px rgba(99,102,241,0.15);
                    }

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

                    .role-box {
                        border: 1px solid #e5e7eb;
                        border-radius: 12px;
                        padding: 10px 14px;
                        cursor: pointer;
                        transition: 0.2s;
                        display: flex;
                        align-items: center;
                    }

                    .role-box:hover {
                        border-color: #6366f1;
                        background: #f9fafb;
                    }

                    /* highlight saat checked */
                    .role-box input:checked + span,
                    .role-box input:checked {
                        accent-color: #6366f1;
                    }

                    .react-select__control {
                        border-radius: 12px !important;
                        border: 1px solid #e5e7eb !important;
                        min-height: 42px;
                        box-shadow: none !important;
                    }

                    .react-select__control--is-focused {
                        border-color: #6366f1 !important;
                        box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.15) !important;
                    }

                    .react-select__menu {
                        border-radius: 10px;
                        overflow: hidden;
                        font-size: 14px;
                    }
                `}
            </style>

            <Head title="Create Unit - EasyPOS" />

            <AdminLayout>
                <div className="container-fluid py-4">
                    {/* ================= PAGE HEADER ================= */}
                    <div className="saas-page-header saas-card">
                        <div className="saas-header-left">
                            <div className="saas-icon-box bg-primary">
                                <i className="bi bi-tag-fill"></i>
                            </div>

                            <div>
                                <h5 className="saas-title">Tambah Unit</h5>
                                <p className="saas-subtitle">
                                    Add a new measurement unit for products
                                </p>
                            </div>
                        </div>

                        <button
                            onClick={handleBack}
                            className="btn btn-light border"
                        >
                            <i className="bi bi-arrow-left me-1"></i> Kembali
                        </button>
                    </div>

                    {/* ================= CONTENT ================= */}
                    <div className="saas-card mt-4">
                        <form onSubmit={handleSubmit}>
                            {/* UNIT NAME */}
                            <div className="mb-4">
                                <label className="form-label fw-semibold">
                                    Nama Unit
                                </label>

                                <input
                                    type="text"
                                    className={`form-control modern-input ${
                                        errors.name ? "is-invalid" : ""
                                    }`}
                                    placeholder="Enter Unit Name"
                                    value={data.name}
                                    onChange={(e) =>
                                        setData("name", e.target.value)
                                    }
                                />

                                {errors.name && (
                                    <div className="invalid-feedback">
                                        {errors.name}
                                    </div>
                                )}
                            </div>

                            {/* ACTION BAR */}
                            <div className="d-flex justify-content-end gap-2 border-top pt-3">
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
                                            Saving...
                                        </>
                                    ) : (
                                        <>
                                            <i class="bi bi-save me-2"></i>
                                            Simpan Data
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </AdminLayout>
        </>
    );
}
