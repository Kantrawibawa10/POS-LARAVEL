import React, { useCallback, useState } from "react";
import { useForm, usePage, Head } from "@inertiajs/react";
import Swal from "sweetalert2";
import AdminLayout from "../../../Layouts/AdminLayout";
import Select from "react-select";

export default function ProductCreate() {
    const { categories, units, barcode, errors } = usePage().props;
    const [preview, setPreview] = useState(null);

    const { data, setData, post, processing, reset } = useForm({
        name: "",
        production_code: barcode || "",
        category_id: "",
        unit_id: "",
        cost_price: "",
        selling_price: "",
        image: null,
    });

    // 🔥 handler stabil (tidak bikin re-render aneh di mobile)
    const handleChange = useCallback((e) => {
        const { name, type, value, files } = e.target;

        if (type === "file") {
            const file = files[0];

            setData(name, file);

            if (file) {
                const imageUrl = URL.createObjectURL(file);
                setPreview(imageUrl);
            }
        } else {
            setData(name, value);
        }
        setData(e.target.name, e.target.value);
    }, []);

    const submit = (e) => {
        e.preventDefault();

        post("/admin/products", {
            forceFormData: true,
            preserveScroll: true,
            preserveState: true, // ⬅️ penting untuk mobile keyboard
            onSuccess: () => {
                Swal.fire({
                    title: "Success!",
                    text: "Product created successfully!",
                    icon: "success",
                    showConfirmButton: false,
                    timer: 1500,
                });

                reset();
            },
        });
    };

    console.log(barcode); // Debugging errors

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

            <Head title="Create Product - EasyPOS" />

            <AdminLayout>
                <div className="container-fluid py-4">
                    <div className="saas-page-header saas-card">
                        <div className="saas-header-left">
                            <div className="saas-icon-box gradient-green bg-primary">
                                <i className="bi bi-folder-plus"></i>
                            </div>

                            <div>
                                <h5 className="saas-title">
                                    Tambah Produk Baru
                                </h5>
                                <p className="saas-subtitle">
                                    Isi detail produk dengan lengkap dan benar
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
                        <form onSubmit={submit} encType="multipart/form-data">
                            <div className="row">
                                {/* LEFT */}
                                <div className="col-md-6">
                                    <FormGroup
                                        label="Kode Produksi"
                                        error={errors.production_code}
                                    >
                                        <input
                                            name="production_code"
                                            type="text"
                                            placeholder="Kode Produksi"
                                            value={data.production_code}
                                            onChange={handleChange}
                                            className="form-control modern-input"
                                            readOnly
                                        />
                                        <small className="text-muted">
                                            Digunakan sebagai prefix barcode
                                        </small>
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
                                            placeholder="Nama Produk"
                                            value={data.name}
                                            onChange={handleChange}
                                            className="form-control modern-input"
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
                                            placeholder="Rp."
                                            onChange={handleChange}
                                            className="form-control modern-input"
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
                                            placeholder="Rp."
                                            value={data.selling_price}
                                            onChange={handleChange}
                                            className="form-control modern-input"
                                        />
                                    </FormGroup>
                                </div>
                            </div>

                            {/* BUTTON (TIDAK DIUBAH) */}
                            <div className="d-flex justify-content-end gap-3 mt-5">
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

/* ================= COMPONENT ================= */

const FormGroup = ({ label, children, error }) => (
    <div className="mb-3">
        <label className="fw-semibold mb-2 d-block">{label}</label>
        {children}
        {error && <small className="text-danger d-block mt-1">{error}</small>}
    </div>
);
