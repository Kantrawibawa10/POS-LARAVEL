import React, { useCallback, useState } from "react";
import { Head, usePage, useForm, router } from "@inertiajs/react";
import Swal from "sweetalert2";
import AdminLayout from "../../../Layouts/AdminLayout";
import Select from "react-select";

const FormGroup = React.memo(({ label, children, error }) => (
    <div className="mb-3">
        <label className="fw-semibold mb-2 d-block">{label}</label>
        {children}
        {error && <small className="text-danger d-block mt-1">{error}</small>}
    </div>
));

export default function ProductEdit() {
    const { product, categories, units } = usePage().props;

    const { data, setData, errors, processing } = useForm({
        name: product.name,
        barcode: product.barcode,
        category_id: product.category_id,
        unit_id: product.unit_id,
        production_code: product.production_code,
        cost_price: product.cost_price,
        selling_price: product.selling_price,
        image: null,
    });

    const handleBack = () => window.history.back();

    const updateProduct = (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append("name", data.name);
        formData.append("barcode", data.barcode);
        formData.append("category_id", data.category_id);
        formData.append("unit_id", data.unit_id);
        formData.append("production_code", data.production_code);
        formData.append("cost_price", data.cost_price);
        formData.append("selling_price", data.selling_price);
        if (data.image) {
            formData.append("image", data.image);
        }
        formData.append("_method", "PUT");

        router.post(`/admin/products/${product.id}`, formData, {
            forceFormData: true,
            onSuccess: () => {
                Swal.fire({
                    title: "Success!",
                    text: "Data updated successfully!",
                    icon: "success",
                    showConfirmButton: false,
                    timer: 1500,
                });
            },
        });
    };

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

            <Head title="Edit Product - EasyPOS" />

            <AdminLayout>
                <div className="container-fluid py-4">
                    <div className="saas-page-header saas-card">
                        <div className="saas-header-left">
                            <div className="saas-icon-box gradient-green bg-primary">
                                <i className="bi bi-folder-plus"></i>
                            </div>

                            <div>
                                <h5 className="saas-title">
                                    Ubah Produk {data.name}
                                </h5>
                                <p className="saas-subtitle">
                                    Perbarui informasi produk yang sudah ada
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

                    {/* ================= FORM CARD ================= */}
                    <div className="saas-card mt-4">
                        <form
                            onSubmit={updateProduct}
                            encType="multipart/form-data"
                        >
                            <div className="row g-4">
                                {/* LEFT */}
                                <div className="col-md-6">
                                    <FormGroup
                                        label="Kode Produk"
                                        error={errors.production_code}
                                    >
                                        <input
                                            name="production_code"
                                            type="text"
                                            value={data.production_code}
                                            onChange={(e) =>
                                                setData(
                                                    "production_code",
                                                    e.target.value,
                                                )
                                            }
                                            className="form-control modern-input"
                                            required
                                        />
                                    </FormGroup>
                                </div>
                                <div className="col-md-6">
                                    <FormGroup
                                        label="Nama Produk"
                                        error={errors.name}
                                    >
                                        <input
                                            name="name"
                                            type="text"
                                            value={data.name}
                                            onChange={(e) =>
                                                setData("name", e.target.value)
                                            }
                                            className="form-control modern-input"
                                            required
                                        />
                                    </FormGroup>
                                </div>

                                {/* RIGHT */}
                                <div className="col-md-6">
                                    <FormGroup
                                        label="Kategori"
                                        error={errors.category_id}
                                    >
                                        <Select
                                            className="react-select-container"
                                            classNamePrefix="react-select"
                                            placeholder="Pilih kategori"
                                            options={categories.map(
                                                (category) => ({
                                                    value: category.id,
                                                    label: category.name,
                                                }),
                                            )}
                                            value={
                                                categories
                                                    .map((category) => ({
                                                        value: category.id,
                                                        label: category.name,
                                                    }))
                                                    .find(
                                                        (opt) =>
                                                            opt.value ===
                                                            data.category_id,
                                                    ) || null
                                            }
                                            onChange={(selected) =>
                                                setData(
                                                    "category_id",
                                                    selected
                                                        ? selected.value
                                                        : "",
                                                )
                                            }
                                            isClearable
                                        />
                                    </FormGroup>
                                </div>

                                <div className="col-md-6">
                                    <FormGroup
                                        label="Satuan"
                                        error={errors.unit_id}
                                    >
                                        <Select
                                            className="react-select-container"
                                            classNamePrefix="react-select"
                                            placeholder="Pilih satuan"
                                            options={units.map((unit) => ({
                                                value: unit.id,
                                                label: unit.name,
                                            }))}
                                            value={
                                                units
                                                    .map((unit) => ({
                                                        value: unit.id,
                                                        label: unit.name,
                                                    }))
                                                    .find(
                                                        (opt) =>
                                                            opt.value ===
                                                            data.unit_id,
                                                    ) || null
                                            }
                                            onChange={(selected) =>
                                                setData(
                                                    "unit_id",
                                                    selected
                                                        ? selected.value
                                                        : "",
                                                )
                                            }
                                            isClearable
                                        />
                                    </FormGroup>
                                </div>

                                <div className="col-md-6">
                                    <FormGroup
                                        label="Harga Pokok"
                                        error={errors.cost_price}
                                    >
                                        <input
                                            name="cost_price"
                                            type="number"
                                            value={data.cost_price}
                                            onChange={(e) =>
                                                setData(
                                                    "cost_price",
                                                    e.target.value,
                                                )
                                            }
                                            className="form-control modern-input"
                                            required
                                        />
                                    </FormGroup>
                                </div>

                                <div className="col-md-6">
                                    <FormGroup
                                        label="Harga Jual"
                                        error={errors.selling_price}
                                    >
                                        <input
                                            name="selling_price"
                                            type="number"
                                            value={data.selling_price}
                                            onChange={(e) =>
                                                setData(
                                                    "selling_price",
                                                    e.target.value,
                                                )
                                            }
                                            className="form-control modern-input"
                                            required
                                        />
                                    </FormGroup>
                                </div>
                            </div>

                            <div className="d-flex justify-content-end gap-3 mt-5">
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
