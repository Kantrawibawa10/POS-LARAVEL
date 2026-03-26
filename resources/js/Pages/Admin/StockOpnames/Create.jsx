import React, { useState } from "react";
import { useForm, usePage, Head } from "@inertiajs/react";
import Swal from "sweetalert2";
import AdminLayout from "../../../Layouts/AdminLayout";
import { FaTrash } from "react-icons/fa";
import Select from "react-select";

export default function StockOpnameCreate() {
    const { products } = usePage().props;

    const { data, setData, post, processing, reset, errors } = useForm({
        opname_date: "",
        status: "pending",
        products: [],
    });

    const [selectedProduct, setSelectedProduct] = useState("");
    const [physicalQty, setPhysicalQty] = useState(0);

    /* ================= ADD ITEM ================= */
    const handleAdd = () => {
        if (!data.opname_date || !selectedProduct || physicalQty === "") {
            Swal.fire(
                "Warning",
                "Lengkapi tanggal, produk, dan qty fisik",
                "warning",
            );
            return;
        }

        // Cegah produk duplikat
        if (data.products.some((p) => p.product_id == selectedProduct)) {
            Swal.fire("Warning", "Produk sudah ditambahkan", "warning");
            return;
        }

        setData("products", [
            ...data.products,
            {
                product_id: selectedProduct,
                physical_quantity: physicalQty,
            },
        ]);

        setSelectedProduct("");
        setPhysicalQty(0);
    };

    /* ================= UPDATE QTY ================= */
    const updateQty = (index, value) => {
        const updated = [...data.products];
        updated[index].physical_quantity = value;
        setData("products", updated);
    };

    /* ================= REMOVE ITEM ================= */
    const removeItem = (index) => {
        const updated = [...data.products];
        updated.splice(index, 1);
        setData("products", updated);
    };

    /* ================= SUBMIT ================= */
    const handleSubmit = (e) => {
        e.preventDefault();

        if (data.products.length === 0) {
            Swal.fire("Warning", "Tambahkan minimal 1 produk", "warning");
            return;
        }

        post("/admin/stock-opnames", {
            onSuccess: () => {
                Swal.fire("Success", "Stock opname saved (Pending)", "success");
                reset();
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
                transition: all .2s ease;
            }

            .modern-input:focus {
                border-color: #6366f1;
                box-shadow: 0 0 0 3px rgba(99,102,241,.15);
            }

            .table-modern thead {
                background:#f9fafb;
            }

            .table-modern td,
            .table-modern th {
                vertical-align: middle;
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

            <Head title="Create Stock Opname - EasyPOS" />

            <AdminLayout>
                <div className="container-fluid py-4">
                    <div
                        style={{
                            background: "#ffffff",
                            borderRadius: "18px",
                            padding: "36px",
                            maxWidth: "1100px",
                            margin: "0 auto",
                            boxShadow: "0 10px 30px rgba(0,0,0,0.04)",
                            border: "1px solid #f1f3f5",
                        }}
                    >
                        {/* ================= HEADER ================= */}
                        <div className="d-flex align-items-center gap-3 mb-4">
                            <div
                                style={{
                                    width: 48,
                                    height: 48,
                                    borderRadius: 14,
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    boxShadow:
                                        "0 6px 16px rgba(99,102,241,0.35)",
                                }}
                                className="bg-primary"
                            >
                                <i className="bi bi-box-seam text-white fs-5"></i>
                            </div>

                            <div>
                                <h5 className="fw-semibold mb-1">
                                    Buat Stock Opname
                                </h5>
                                <small className="text-muted">
                                    Verifikasi stok fisik terhadap sistem
                                    inventory
                                </small>
                            </div>
                        </div>

                        {/* ================= FORM ================= */}
                        <form onSubmit={handleSubmit}>
                            <div className="row g-4">
                                {/* DATE */}
                                <div className="col-md-3">
                                    <label className="fw-semibold mb-2">
                                        Tanggal Opname
                                    </label>

                                    <input
                                        type="date"
                                        className={`form-control modern-input ${
                                            errors.opname_date
                                                ? "is-invalid"
                                                : ""
                                        }`}
                                        value={data.opname_date}
                                        onChange={(e) =>
                                            setData(
                                                "opname_date",
                                                e.target.value,
                                            )
                                        }
                                    />
                                </div>

                                {/* PRODUCT */}
                                <div className="col-md-5">
                                    <label className="fw-semibold mb-2">
                                        Nama Barang
                                    </label>

                                    <Select
                                        className="react-select-container"
                                        classNamePrefix="react-select"
                                        placeholder="Pilih Produk"
                                        options={products.map((p) => ({
                                            value: p.id,
                                            label: `${p.name} | Stock: ${p.stock_total?.total_stock ?? 0}`,
                                        }))}
                                        value={
                                            products
                                                .map((p) => ({
                                                    value: p.id,
                                                    label: `${p.name} | Stock: ${
                                                        p.stock_total
                                                            ?.total_stock ?? 0
                                                    }`,
                                                }))
                                                .find(
                                                    (opt) =>
                                                        opt.value ===
                                                        selectedProduct,
                                                ) || null
                                        }
                                        onChange={(selected) =>
                                            setSelectedProduct(
                                                selected ? selected.value : "",
                                            )
                                        }
                                        isClearable
                                    />
                                </div>

                                {/* QTY */}
                                <div className="col-md-2">
                                    <label className="fw-semibold mb-2">
                                        Qty Fisik
                                    </label>

                                    <input
                                        type="number"
                                        min="0"
                                        className="form-control modern-input"
                                        value={physicalQty}
                                        onChange={(e) =>
                                            setPhysicalQty(e.target.value)
                                        }
                                    />
                                </div>

                                {/* ADD BUTTON */}
                                <div className="col-md-2 d-flex align-items-end">
                                    <button
                                        type="button"
                                        onClick={handleAdd}
                                        className="btn text-white w-100 btn-primary"
                                        style={{
                                            height: 46,
                                            borderRadius: 12,
                                            border: "none",
                                        }}
                                    >
                                        <i class="bi bi-plus-lg me-2"></i>
                                        Tambah
                                    </button>
                                </div>
                            </div>

                            {/* ================= TABLE ================= */}
                            <div
                                className="mt-5"
                                style={{
                                    borderRadius: 14,
                                    overflow: "hidden",
                                    border: "1px solid #f1f3f5",
                                }}
                            >
                                <table className="table table-modern mb-0">
                                    <thead>
                                        <tr>
                                            <th>Product</th>
                                            <th>Kode</th>
                                            <th>Qty System</th>
                                            <th width="180">Qty Fisik</th>
                                            <th
                                                width="80"
                                                className="text-center"
                                            >
                                                Action
                                            </th>
                                        </tr>
                                    </thead>

                                    <tbody>
                                        {data.products.length === 0 && (
                                            <tr>
                                                <td
                                                    colSpan="5"
                                                    className="text-center text-muted py-4"
                                                >
                                                    Belum ada produk ditambahkan
                                                </td>
                                            </tr>
                                        )}

                                        {data.products.map((item, index) => {
                                            const product = products.find(
                                                (p) => p.id == item.product_id,
                                            );

                                            return (
                                                <tr key={index}>
                                                    <td className="fw-semibold">
                                                        {product?.name}
                                                    </td>

                                                    <td>
                                                        {
                                                            product?.production_code
                                                        }
                                                    </td>

                                                    <td>
                                                        {product?.stock_total
                                                            ?.total_stock ?? 0}
                                                    </td>

                                                    <td>
                                                        <input
                                                            type="number"
                                                            min="0"
                                                            className="form-control modern-input"
                                                            value={
                                                                item.physical_quantity
                                                            }
                                                            onChange={(e) =>
                                                                updateQty(
                                                                    index,
                                                                    e.target
                                                                        .value,
                                                                )
                                                            }
                                                        />
                                                    </td>

                                                    <td className="text-center">
                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                removeItem(
                                                                    index,
                                                                )
                                                            }
                                                            className="btn"
                                                            style={{
                                                                width: 36,
                                                                height: 36,
                                                                borderRadius: 10,
                                                                border: "1px solid #e5e7eb",
                                                                color: "#ef4444",
                                                                background:
                                                                    "#fff",
                                                            }}
                                                        >
                                                            <FaTrash />
                                                        </button>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>

                            {/* ================= ACTION ================= */}
                            <div className="d-flex justify-content-end gap-3 mt-5 gap-2">
                                <button
                                    type="button"
                                    className="btn btn-danger"
                                    onClick={() => window.history.back()}
                                >
                                    <i class="bi bi-arrow-left me-2"></i>
                                    Kembali
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
