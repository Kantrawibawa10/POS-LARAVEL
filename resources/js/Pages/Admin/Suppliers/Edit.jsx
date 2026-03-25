import React, { useState, useEffect } from "react";
import { useForm, Head, usePage } from "@inertiajs/react";
import Swal from "sweetalert2";
import AdminLayout from "../../../Layouts/AdminLayout";
import Select from "react-select";

export default function SupplierEdit() {
    const { supplier, provinces } = usePage().props;

    const { data, setData, put, processing, errors } = useForm({
        name: supplier.name || "",
        address: supplier.address || "",
        phone: supplier.phone || "",
        description: supplier.description || "",
        status: supplier.status || "active",
        province_id: supplier.province_id || "",
        city_id: supplier.city_id || "",
    });

    const [cities, setCities] = useState([]);
    const [loadingCities, setLoadingCities] = useState(false);

    /* ================= FETCH CITY ================= */
    const handleProvinceChange = async (provinceId, isInit = false) => {
        setData("province_id", provinceId);

        // ❗ hanya reset jika bukan init
        if (!isInit) {
            setData("city_id", "");
        }

        if (!provinceId) {
            setCities([]);
            return;
        }

        setLoadingCities(true);

        try {
            const res = await fetch(`/admin/get-cities/${provinceId}`);
            const json = await res.json();
            setCities(json);
        } catch (err) {
            console.error(err);
        } finally {
            setLoadingCities(false);
        }
    };

    useEffect(() => {
        if (data.province_id) {
            handleProvinceChange(data.province_id, true); // ✅ init mode
        }
    }, []);

    const provinceOptions = provinces.map((p) => ({
        value: p.id,
        label: p.name,
    }));

    const cityOptions = cities.map((c) => ({
        value: c.id,
        label: c.name,
    }));

    /* ================= SUBMIT ================= */
    const handleSubmit = (e) => {
        e.preventDefault();

        put(`/admin/suppliers/${supplier.id}`, {
            onSuccess: () => {
                Swal.fire({
                    icon: "success",
                    title: "Success",
                    text: "Supplier updated successfully",
                    timer: 1500,
                    showConfirmButton: false,
                });
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
            <Head title="Edit Supplier - EasyPOS" />
            <AdminLayout>
                <div className="container-fluid px-4">
                    {/* ================= PAGE HEADER ================= */}
                    <div className="saas-page-header saas-card">
                        <div className="saas-header-left">
                            <div className="saas-icon-box bg-primary">
                                <i className="bi bi-truck"></i>
                            </div>

                            <div>
                                <h5 className="saas-title">
                                    Ubah Supplier {data.name}
                                </h5>
                                <p className="saas-subtitle">
                                    Update supplier information
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
                            <div className="row g-4">
                                {/* NAME */}
                                <div className="col-md-6">
                                    <label className="form-label fw-semibold">
                                        Nama Supplier
                                    </label>
                                    <input
                                        type="text"
                                        className={`form-control modern-input ${errors.name && "is-invalid"}`}
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

                                {/* PHONE */}
                                <div className="col-md-6">
                                    <label className="form-label fw-semibold">
                                        Phone Number
                                    </label>
                                    <input
                                        type="text"
                                        className={`form-control modern-input ${errors.phone && "is-invalid"}`}
                                        value={data.phone}
                                        onChange={(e) =>
                                            setData("phone", e.target.value)
                                        }
                                    />
                                </div>

                                {/* PROVINCE */}
                                <div className="col-md-6">
                                    <label className="form-label fw-semibold">
                                        Provinsi
                                    </label>

                                    <Select
                                        className="react-select-container"
                                        classNamePrefix="react-select"
                                        placeholder="Pilih Provinsi"
                                        options={provinceOptions}
                                        value={
                                            provinceOptions.find(
                                                (opt) =>
                                                    opt.value ===
                                                    Number(data.province_id),
                                            ) || null
                                        }
                                        onChange={(selected) =>
                                            handleProvinceChange(
                                                selected ? selected.value : "",
                                            )
                                        }
                                        isClearable
                                    />
                                </div>

                                {/* CITY */}
                                <div className="col-md-6">
                                    <label className="form-label fw-semibold">
                                        City
                                    </label>
                                    <Select
                                        className="react-select-container"
                                        classNamePrefix="react-select"
                                        placeholder={
                                            loadingCities
                                                ? "Loading cities..."
                                                : "Pilih Kota"
                                        }
                                        options={cityOptions}
                                        value={
                                            cityOptions.find(
                                                (opt) =>
                                                    opt.value ===
                                                    Number(data.city_id),
                                            ) || null
                                        }
                                        onChange={(selected) =>
                                            setData(
                                                "city_id",
                                                selected ? selected.value : "",
                                            )
                                        }
                                        isClearable
                                        isDisabled={
                                            !data.province_id || loadingCities
                                        }
                                        isLoading={loadingCities}
                                        noOptionsMessage={() =>
                                            loadingCities
                                                ? "Loading..."
                                                : "Tidak ada kota"
                                        }
                                    />
                                </div>

                                {/* ADDRESS */}
                                <div className="col-md-12">
                                    <label className="form-label fw-semibold">
                                        Address
                                    </label>
                                    <textarea
                                        type="text"
                                        className={`form-control modern-textarea ${
                                            errors.address ? "is-invalid" : ""
                                        }`}
                                        value={data.address}
                                        onChange={(e) =>
                                            setData("address", e.target.value)
                                        }
                                        placeholder="Alamat lengkap suplier"
                                        rows="4"
                                    />
                                </div>

                                {/* STATUS */}
                                <div className="col-md-12">
                                    <div>
                                        <label className="form-label fw-semibold">
                                            Status
                                        </label>

                                        <div className="row g-2 mt-1">
                                            {[
                                                {
                                                    label: "Active",
                                                    value: "active",
                                                },
                                                {
                                                    label: "Inactive",
                                                    value: "inactive",
                                                },
                                            ].map((item) => (
                                                <div
                                                    key={item.value}
                                                    className="col-12 col-md-6"
                                                >
                                                    <label className="role-box w-100">
                                                        <input
                                                            type="radio"
                                                            name="status"
                                                            value={item.value}
                                                            className="form-check-input me-2"
                                                            checked={
                                                                data.status ===
                                                                item.value
                                                            }
                                                            onChange={(e) =>
                                                                setData(
                                                                    "status",
                                                                    e.target
                                                                        .value,
                                                                )
                                                            }
                                                        />
                                                        {item.label}
                                                    </label>
                                                </div>
                                            ))}
                                        </div>

                                        {errors.status && (
                                            <div className="alert alert-danger mt-2 py-2 px-3">
                                                {errors.status}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* ACTION */}
                            <div className="saas-form-footer gap-2">
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
