import React, { useState } from "react";
import { useForm, Head } from "@inertiajs/react";
import Swal from "sweetalert2";
import AdminLayout from "../../../Layouts/AdminLayout";
import { usePage } from "@inertiajs/react";
import { useEffect } from "react";
import { router } from "@inertiajs/react";

export default function StockOpnameEdit({ stockOpname, products }) {
    const isLocked = stockOpname.status === "completed";

    const { data, setData, put, processing } = useForm({
        opname_date: stockOpname.opname_date,
        status: stockOpname.status,
        products: stockOpname.details.map((d) => ({
            product_id: d.product_id,
            physical_quantity: d.physical_quantity,
        })),
    });

    const [selectedProduct, setSelectedProduct] = useState("");
    const [qty, setQty] = useState("");

    const { flash } = usePage().props;

    useEffect(() => {
        if (flash.success) {
            Swal.fire({
                icon: "success",
                title: "Berhasil, Stock Opname Updated",
                text: flash.success,
                showConfirmButton: false,
                timer: 2000,
                timerProgressBar: true,
            });
        }

        if (flash.error) {
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: flash.error,
            });
        }
    }, [flash]);

    /* ================= ADD PRODUCT ================= */
    const handleAddProduct = () => {
        if (!selectedProduct || qty === "") {
            Swal.fire("Warning", "Product & Qty wajib diisi", "warning");
            return;
        }

        const exists = data.products.find(
            (p) => p.product_id === Number(selectedProduct),
        );

        if (exists) {
            Swal.fire("Warning", "Produk sudah ditambahkan", "warning");
            return;
        }

        setData("products", [
            ...data.products,
            {
                product_id: Number(selectedProduct),
                physical_quantity: Number(qty),
            },
        ]);

        setSelectedProduct("");
        setQty("");
    };

    /* ================= REMOVE ================= */
    const handleRemove = (id) => {
        setData(
            "products",
            data.products.filter((p) => p.product_id !== id),
        );
    };

    /* ================= SUBMIT ================= */
    const handleSubmit = (e) => {
        e.preventDefault();

        router.put(`/admin/stock-opnames/${stockOpname.id}`, data, {
            preserveScroll: true,
            onSuccess: () => {
                Swal.fire({
                    icon: "success",
                    title: "Berhasil 🎉",
                    text: "Stock Opname Successfully Updated",
                    showConfirmButton: false,
                    timer: 2000,
                }).then(() => {
                    router.visit("/admin/stock-opnames");
                });
            },
        });
    };

    return (
        <>
            <style>
                {`
            .modern-input {
                height:46px;
                border-radius:12px;
                border:1px solid #e5e7eb;
                background:#fff;
                transition:.2s;
            }

            .modern-input:focus{
                border-color:#6366f1;
                box-shadow:0 0 0 3px rgba(99,102,241,.15);
            }

            .table-modern thead{
                background:#f9fafb;
            }

            .table-modern td,
            .table-modern th{
                vertical-align:middle;
            }
        `}
            </style>

            <Head title="Edit Stock Opname - EasyPOS" />

            <AdminLayout>
                <div className="container-fluid py-4">
                    <div
                        style={{
                            background: "#fff",
                            borderRadius: 18,
                            padding: 36,
                            maxWidth: 1100,
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
                                    background:
                                        "linear-gradient(135deg,#6366f1,#8b5cf6)",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    boxShadow:
                                        "0 6px 16px rgba(99,102,241,.35)",
                                }}
                            >
                                <i className="bi bi-pencil-square text-white fs-5"></i>
                            </div>

                            <div>
                                <h5 className="fw-semibold mb-1">
                                    Edit Stock Opname
                                </h5>
                                <small className="text-muted">
                                    Update dan verifikasi data stok opname
                                </small>
                            </div>
                        </div>

                        <form onSubmit={handleSubmit}>
                            {/* ================= TOP FORM ================= */}
                            <div className="row g-4 mb-4">
                                {/* DATE */}
                                <div className="col-md-4">
                                    <label className="fw-semibold mb-2">
                                        Opname Date
                                    </label>
                                    <input
                                        type="date"
                                        className="form-control modern-input"
                                        value={data.opname_date}
                                        disabled={isLocked}
                                        onChange={(e) =>
                                            setData(
                                                "opname_date",
                                                e.target.value,
                                            )
                                        }
                                    />
                                </div>

                                {/* STATUS */}
                                <div className="col-md-4">
                                    <label className="fw-semibold mb-2">
                                        Status
                                    </label>
                                    <select
                                        className="form-select modern-input"
                                        value={data.status}
                                        disabled={isLocked}
                                        onChange={(e) =>
                                            setData("status", e.target.value)
                                        }
                                    >
                                        <option value="pending">Pending</option>
                                        <option value="completed">
                                            Completed
                                        </option>
                                        <option value="canceled">
                                            Canceled
                                        </option>
                                    </select>
                                </div>
                            </div>

                            {/* ================= ADD PRODUCT (ONLY IF EDITABLE) ================= */}
                            {!isLocked && (
                                <div
                                    className="mb-5"
                                    style={{
                                        border: "1px solid #f1f3f5",
                                        borderRadius: 14,
                                        padding: 24,
                                        background: "#fafafa",
                                    }}
                                >
                                    <div className="row g-3">
                                        <div className="col-md-6">
                                            <label className="fw-semibold mb-2">
                                                Product
                                            </label>

                                            <select
                                                className="form-select modern-input"
                                                value={selectedProduct}
                                                onChange={(e) =>
                                                    setSelectedProduct(
                                                        e.target.value,
                                                    )
                                                }
                                            >
                                                <option value="">
                                                    Pilih Produk
                                                </option>

                                                {products.map((p) => (
                                                    <option
                                                        key={p.id}
                                                        value={p.id}
                                                    >
                                                        {p.name}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>

                                        <div className="col-md-4">
                                            <label className="fw-semibold mb-2">
                                                Qty Fisik
                                            </label>

                                            <input
                                                type="number"
                                                min="0"
                                                className="form-control modern-input"
                                                value={qty}
                                                onChange={(e) =>
                                                    setQty(e.target.value)
                                                }
                                            />
                                        </div>

                                        <div className="col-md-2 d-flex align-items-end">
                                            <button
                                                type="button"
                                                onClick={handleAddProduct}
                                                className="btn text-white w-100"
                                                style={{
                                                    height: 46,
                                                    borderRadius: 12,
                                                    background:
                                                        "linear-gradient(135deg,#22c55e,#16a34a)",
                                                    border: "none",
                                                }}
                                            >
                                                Tambah
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* ================= TABLE ================= */}
                            <div
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
                                            <th width="180">Qty Fisik</th>
                                            <th>Qty Sistem</th>
                                            {!isLocked && (
                                                <th
                                                    width="80"
                                                    className="text-center"
                                                >
                                                    Aksi
                                                </th>
                                            )}
                                        </tr>
                                    </thead>

                                    <tbody>
                                        {data.products.map((item) => {
                                            const product = products.find(
                                                (p) => p.id === item.product_id,
                                            );

                                            return (
                                                <tr key={item.product_id}>
                                                    <td className="fw-semibold">
                                                        {product?.name}
                                                    </td>

                                                    <td>
                                                        {isLocked ? (
                                                            item.physical_quantity
                                                        ) : (
                                                            <input
                                                                type="number"
                                                                className="form-control modern-input"
                                                                value={
                                                                    item.physical_quantity
                                                                }
                                                                onChange={(
                                                                    e,
                                                                ) => {
                                                                    const updated =
                                                                        [
                                                                            ...data.products,
                                                                        ];

                                                                    const idx =
                                                                        updated.findIndex(
                                                                            (
                                                                                p,
                                                                            ) =>
                                                                                p.product_id ===
                                                                                item.product_id,
                                                                        );

                                                                    updated[
                                                                        idx
                                                                    ].physical_quantity =
                                                                        e.target.value;

                                                                    setData(
                                                                        "products",
                                                                        updated,
                                                                    );
                                                                }}
                                                            />
                                                        )}
                                                    </td>

                                                    <td>
                                                        {product?.stock_total
                                                            ?.total_stock ?? 0}
                                                    </td>

                                                    {!isLocked && (
                                                        <td className="text-center">
                                                            <button
                                                                type="button"
                                                                onClick={() =>
                                                                    handleRemove(
                                                                        item.product_id,
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
                                                                ✕
                                                            </button>
                                                        </td>
                                                    )}
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>

                            {/* ================= ACTION ================= */}
                            {!isLocked && (
                                <div className="d-flex justify-content-end mt-5">
                                    <button
                                        disabled={processing}
                                        className="btn text-white px-4"
                                        style={{
                                            borderRadius: 12,
                                            background:
                                                "linear-gradient(135deg,#6366f1,#8b5cf6)",
                                            border: "none",
                                        }}
                                    >
                                        <i className="fa fa-save me-2"></i>
                                        Update Opname
                                    </button>
                                </div>
                            )}
                        </form>
                    </div>
                </div>
            </AdminLayout>
        </>
    );
}
