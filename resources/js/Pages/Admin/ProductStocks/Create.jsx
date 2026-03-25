import React, { useState, useEffect, useMemo } from "react";
import { usePage, Head, useForm } from "@inertiajs/react";
import Swal from "sweetalert2";
import AdminLayout from "../../../Layouts/AdminLayout";
import Select from "react-select";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

export default function ProductStockCreate() {
    const {
        products_all = [], // SEMUA produk (tanpa pagination)
        stock_products = [], // relasi stok masuk
        suppliers = [],
    } = usePage().props;

    const [selectedProduct, setSelectedProduct] = useState(null);
    const [selectedSupplier, setSelectedSupplier] = useState(null);
    const [search, setSearch] = useState("");
    const [isLoading, setIsLoading] = useState(true);

    const { data, setData, post, processing, reset, errors } = useForm({
        product_id: "",
        supplier_id: "",
        stock_quantity: "",
        received_at: "",
        production_code: "",
    });

    // matikan loading saat data siap
    useEffect(() => {
        if (products_all.length > 0) {
            setIsLoading(false);
        }
    }, [products_all]);

    // ==============================
    // HITUNG STOK (HANYA DARI stock_products)
    // ==============================
    const getCombinedStock = (productId) => {
        return stock_products
            .filter((s) => s.product_id === productId)
            .reduce((sum, s) => sum + Number(s.stock_quantity || 0), 0);
    };

    // ==============================
    // SEARCH LOKAL (TANPA ROUTER)
    // ==============================
    const filteredProducts = useMemo(() => {
        const keyword = search.toLowerCase();

        return products_all.filter((p) => {
            const name = p.name?.toLowerCase() || "";
            const barcode = p.barcode?.toLowerCase() || "";

            return name.includes(keyword) || barcode.includes(keyword);
        });
    }, [products_all, search]);

    // ==============================
    // SUBMIT FORM
    // ==============================
    const handleSubmit = (e) => {
        e.preventDefault();

        post("/admin/stocks", {
            onSuccess: () => {
                Swal.fire({
                    title: "Success!",
                    text: "Product stock created successfully!",
                    icon: "success",
                    showConfirmButton: false,
                    timer: 1500,
                });

                reset();
                setSelectedProduct(null);
                setSelectedSupplier(null);
                setSearch("");
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

                    .cursor-pointer{
                        cursor:pointer;
                    }
                `}
            </style>

            <Head title="Add Product Stock - EasyPOS" />

            <AdminLayout>
                {/* ================= CONTENT ================= */}
                <div className="container-fluid py-4">
                    <div className="saas-page-header saas-card">
                        <div className="saas-header-left">
                            <div className="saas-icon-box gradient-green bg-primary">
                                <i className="bi bi-box-seam"></i>
                            </div>

                            <div>
                                <h5 className="saas-title">
                                    Tambah Stock Produk
                                </h5>
                                <p className="saas-subtitle">
                                    Record incoming stock from suppliers
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
                        <form onSubmit={handleSubmit}>
                            {/* PRODUCT PICKER */}
                            <div className="mb-4">
                                <label className="form-label fw-semibold">
                                    Product
                                </label>

                                <input
                                    type="text"
                                    className="form-control modern-input cursor-pointer"
                                    placeholder="Click to select product"
                                    value={selectedProduct?.name || ""}
                                    readOnly
                                    data-bs-toggle="modal"
                                    data-bs-target="#productModal"
                                />

                                {errors.product_id && (
                                    <div className="invalid-feedback d-block">
                                        {errors.product_id}
                                    </div>
                                )}
                            </div>

                            {/* CURRENT STOCK */}
                            {selectedProduct && (
                                <div className="mb-4">
                                    <label className="form-label fw-semibold">
                                        Stock Saat Ini (Tersedia)
                                    </label>
                                    <input
                                        className="form-control modern-input bg-light"
                                        value={selectedProduct.current_stock} // Mengambil data real-time dari backend
                                        disabled
                                    />
                                </div>
                            )}

                            {/* SUPPLIER */}
                            <div className="mb-4">
                                <label className="form-label fw-semibold">
                                    Supplier
                                </label>

                                <Select
                                    className="react-select-container"
                                    classNamePrefix="react-select"
                                    placeholder="Select Supplier"
                                    options={suppliers.map((supplier) => ({
                                        value: supplier.id,
                                        label: supplier.name,
                                    }))}
                                    value={
                                        suppliers
                                            .map((supplier) => ({
                                                value: supplier.id,
                                                label: supplier.name,
                                            }))
                                            .find(
                                                (opt) =>
                                                    opt.value ===
                                                    data.supplier_id,
                                            ) || null
                                    }
                                    onChange={(selected) =>
                                        setData(
                                            "supplier_id",
                                            selected ? selected.value : "",
                                        )
                                    }
                                    isClearable
                                />
                            </div>

                            {/* QUANTITY */}
                            <div className="mb-4">
                                <label className="form-label fw-semibold">
                                    Jumlah Stok
                                </label>

                                <input
                                    type="number"
                                    className="form-control modern-input"
                                    value={data.stock_quantity}
                                    placeholder="Masukan jumlah stok terbaru"
                                    onChange={(e) =>
                                        setData(
                                            "stock_quantity",
                                            e.target.value,
                                        )
                                    }
                                />
                            </div>

                            {/* DATE */}
                            <div className="mb-4">
                                <label className="form-label fw-semibold">
                                    Tanggal Barang Masuk
                                </label>

                                <DatePicker
                                    selected={
                                        data.received_at
                                            ? new Date(data.received_at)
                                            : null
                                    }
                                    onChange={(date) =>
                                        setData(
                                            "received_at",
                                            date.toISOString().split("T")[0],
                                        )
                                    }
                                    dateFormat="dd MMMM yyyy"
                                    placeholderText="Pilih tanggal"
                                    className={`form-control modern-input w-100 ${errors.received_at ? "is-invalid" : ""}`}
                                    wrapperClassName="w-100"
                                    showMonthDropdown
                                    showYearDropdown
                                    dropdownMode="select"
                                />

                                {errors.received_at && (
                                    <div className="invalid-feedback">
                                        {errors.received_at}
                                    </div>
                                )}
                            </div>

                            {/* ACTION BAR */}
                            <div className="d-flex justify-content-end gap-2 border-top pt-3">
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

                {/* ================= MODAL (SaaS CLEAN STYLE) ================= */}
                <div className="modal fade" id="productModal" tabIndex="-1">
                    <div className="modal-dialog modal-xl modal-dialog-centered">
                        <div className="modal-content border-0 rounded-4 shadow-lg overflow-hidden p-3">
                            {/* HEADER */}
                            <div className="px-4 pt-4 pb-3 border-bottom bg-white">
                                <div className="d-flex justify-content-between align-items-center">
                                    <div>
                                        <h5 className="fw-bold mb-0">
                                            Select Product
                                        </h5>
                                        <small className="text-muted">
                                            Fast selection with real-time search
                                        </small>
                                    </div>
                                    <button
                                        className="btn-close"
                                        data-bs-dismiss="modal"
                                    />
                                </div>

                                {/* SEARCH */}
                                <div className="mt-3 position-relative">
                                    <input
                                        className="form-control ps-5 py-2 rounded-3 border-0 shadow-sm"
                                        placeholder="Search product name / code..."
                                        value={search}
                                        onChange={(e) =>
                                            setSearch(e.target.value)
                                        }
                                    />
                                    <i className="bi bi-search position-absolute top-50 start-0 translate-middle-y ms-3 text-muted"></i>
                                </div>
                            </div>

                            {/* BODY */}
                            <div
                                className="modal-body p-4"
                                style={{ maxHeight: "70vh", overflowY: "auto" }}
                            >
                                {isLoading ? (
                                    <div className="text-center py-5">
                                        <div className="spinner-border text-success" />
                                        <p className="text-muted mt-3 mb-0">
                                            Fetching products...
                                        </p>
                                    </div>
                                ) : filteredProducts.length ? (
                                    <div className="row g-3">
                                        {filteredProducts.map((product) => (
                                            <div
                                                key={product.id}
                                                className="col-md-6 col-lg-4"
                                            >
                                                <div
                                                    className="p-3 rounded-4 border bg-white h-100 product-card"
                                                    onClick={() => {
                                                        setSelectedProduct(
                                                            product,
                                                        );
                                                        setData(
                                                            "product_id",
                                                            product.id,
                                                        );
                                                    }}
                                                    data-bs-dismiss="modal"
                                                >
                                                    {/* TOP */}
                                                    <div className="d-flex justify-content-between align-items-start mb-2">
                                                        <span className="text-muted small">
                                                            {
                                                                product.production_code
                                                            }
                                                        </span>

                                                        <span
                                                            className={`badge rounded-pill px-3 py-2 ${
                                                                product.current_stock >
                                                                0
                                                                    ? "bg-success-subtle text-success"
                                                                    : "bg-danger-subtle text-danger"
                                                            }`}
                                                        >
                                                            {
                                                                product.current_stock
                                                            }
                                                        </span>
                                                    </div>

                                                    {/* NAME */}
                                                    <div className="fw-semibold mb-3">
                                                        {product.name}
                                                    </div>

                                                    {/* ACTION */}
                                                    <div className="d-flex justify-content-end">
                                                        <button className="btn btn-sm btn-success rounded-3 px-3 shadow-sm">
                                                            Select
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-5 text-muted">
                                        <i className="bi bi-search fs-2 d-block mb-2"></i>
                                        No product found
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* STYLE ENHANCEMENT */}
                    <style>
                        {`
                            .product-card {
                                transition: all 0.2s ease;
                                cursor: pointer;
                            }

                            .product-card:hover {
                                transform: translateY(-4px);
                                box-shadow: 0 10px 25px rgba(0,0,0,0.08);
                                border-color: #19875433;
                            }

                            .product-card:active {
                                transform: scale(0.98);
                            }
                        `}
                    </style>
                </div>
            </AdminLayout>
        </>
    );
}
