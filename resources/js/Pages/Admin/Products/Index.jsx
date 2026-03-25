import React, { useState, useRef } from "react";
import { Head, usePage, Link, router } from "@inertiajs/react";
import Swal from "sweetalert2";
import Barcode from "react-barcode";
import Pagination from "../../../Components/Pagination";
import AdminLayout from "../../../Layouts/AdminLayout";

export default function ProductIndex() {
    const { products, filters } = usePage().props;

    // STATE HANYA UNTUK INPUT
    const [search, setSearch] = useState(filters?.q || "");

    // Menambahkan ref untuk setiap barcode
    const barcodeRefs = useRef({});

    // Fungsi untuk menangani penghapusan produk
    const handleDelete = (id) => {
        Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#3085d6",
            confirmButtonText: "Yes, delete it!",
        }).then((result) => {
            if (result.isConfirmed) {
                router.delete(`/admin/products/${id}`, {
                    onSuccess: () => {
                        Swal.fire({
                            title: "Deleted!",
                            text: "Produk has been deleted.",
                            icon: "success",
                            timer: 2000, // tampil 2 detik
                            timerProgressBar: true,
                            showConfirmButton: false,
                            willClose: () => {
                                window.location.reload();
                            },
                        });
                    },
                    onError: () => {
                        Swal.fire({
                            title: "Error!",
                            text: "There was a problem deleting the product.",
                            icon: "error",
                            confirmButtonColor: "#d33",
                        });
                    },
                });
            }
        });
    };

    // Fungsi untuk menangani download barcode
    const handleDownloadBarcode = (productId, barcodeValue) => {
        const container = barcodeRefs.current[productId];
        if (!container) return;

        const svg = container.querySelector("svg");
        if (!svg) return;

        const serializer = new XMLSerializer();
        const svgString = serializer.serializeToString(svg);

        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");

        // 🔥 INI KUNCI UTAMA (AMBIL UKURAN SVG ASLI + TEKS)
        const bbox = svg.getBBox();

        const scale = 4; // resolusi tinggi
        canvas.width = bbox.width * scale;
        canvas.height = bbox.height * scale;

        const img = new Image();
        const blob = new Blob([svgString], {
            type: "image/svg+xml;charset=utf-8",
        });
        const url = URL.createObjectURL(blob);

        img.onload = () => {
            ctx.imageSmoothingEnabled = false; // 🔥 barcode tetap tajam

            // 🔥 gambar sesuai bbox
            ctx.drawImage(
                img,
                bbox.x,
                bbox.y,
                bbox.width,
                bbox.height,
                0,
                0,
                canvas.width,
                canvas.height,
            );

            URL.revokeObjectURL(url);

            const pngUrl = canvas.toDataURL("image/png");
            const a = document.createElement("a");
            a.href = pngUrl;
            a.download = `barcode-${barcodeValue}.png`;
            a.click();
        };

        img.src = url;
    };

    return (
        <>
            <Head title="Products - EasyPOS" />

            <AdminLayout>
                {/* ================= HEADER CARD ================= */}
                <div
                    className="shadow-sm mb-4"
                    style={{
                        background: "#fff",
                        borderRadius: "16px",
                        border: "1px solid #f1f3f5",
                        padding: "24px",
                    }}
                >
                    {/* TOP SECTION */}
                    <div className="d-flex justify-content-between align-items-start flex-wrap gap-3 mb-4">
                        <div className="d-flex align-items-center gap-3">
                            <div
                                className="bg-primary"
                                style={{
                                    width: "44px",
                                    height: "44px",
                                    borderRadius: "14px",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                }}
                            >
                                <i className="bi bi-box-seam text-white fs-5"></i>
                            </div>

                            <div>
                                <h5 className="fw-semibold mb-1">
                                    Products Management
                                </h5>
                                <small className="text-muted">
                                    Kelola semua produk yang tersedia di sistem
                                </small>
                            </div>
                        </div>
                    </div>

                    {/* SEARCH + BUTTON */}
                    <div className="d-flex align-items-center gap-3 flex-wrap">
                        <div
                            className="d-flex align-items-center px-3"
                            style={{
                                height: "42px",
                                border: "1px solid #e5e7eb",
                                borderRadius: "12px",
                                background: "#f9fafb",
                                minWidth: "280px",
                            }}
                        >
                            <i className="bi bi-search text-muted me-2"></i>
                            <input
                                type="text"
                                placeholder="Search products..."
                                className="border-0 bg-transparent"
                                style={{
                                    outline: "none",
                                    fontSize: "14px",
                                }}
                                value={search}
                                onChange={(e) => {
                                    const value = e.target.value;
                                    setSearch(value);

                                    router.get(
                                        "/admin/products",
                                        { q: value },
                                        {
                                            preserveState: true,
                                            replace: true,
                                        },
                                    );
                                }}
                            />
                        </div>

                        <Link
                            href="/admin/products/create"
                            className="d-flex align-items-center justify-content-center px-4 bg-primary"
                            style={{
                                height: "42px",
                                borderRadius: "12px",
                                color: "#fff",
                                fontWeight: "500",
                                textDecoration: "none",
                            }}
                        >
                            <i className="bi bi-plus-lg me-2"></i>
                            Tambah Produk
                        </Link>
                    </div>
                </div>

                {/* ================= TABLE CARD ================= */}
                <div
                    className="shadow-sm"
                    style={{
                        borderRadius: "16px",
                        background: "#fff",
                        overflow: "hidden",
                        border: "1px solid #f1f3f5",
                    }}
                >
                    <div className="table-responsive">
                        <table className="table align-middle mb-0">
                            <thead
                                style={{
                                    background: "#f8fafc",
                                    fontSize: "13px",
                                    color: "#64748b",
                                }}
                            >
                                <tr>
                                    <th width="60" className="text-center py-2">
                                        #
                                    </th>
                                    <th className="py-2">Produk</th>
                                    <th className="py-2">Kode</th>
                                    <th className="py-2">Kategori</th>
                                    <th className="py-2">Harga Pokok</th>
                                    <th className="py-2">Harga Jual</th>
                                    <th className="text-center py-2">Stock</th>
                                    <th
                                        className="text-center py-2"
                                        width="120"
                                    >
                                        Action
                                    </th>
                                </tr>
                            </thead>

                            <tbody>
                                {products.data.length > 0 ? (
                                    products.data.map((product, index) => (
                                        <tr
                                            key={product.id}
                                            style={{
                                                borderTop: "1px solid #f1f5f9",
                                            }}
                                        >
                                            <td className="text-center py-2">
                                                {index +
                                                    1 +
                                                    (products.current_page -
                                                        1) *
                                                        products.per_page}
                                            </td>

                                            {/* PRODUCT + IMAGE */}
                                            <td className="py-2">
                                                <div className="d-flex align-items-center gap-3">
                                                    {product.image_url && (
                                                        <img
                                                            src={product.image_url} // 🔥 fallback jika image null
                                                            alt={product.name}
                                                            width="48"
                                                            height="48"
                                                            style={{
                                                                borderRadius:
                                                                    "10px",
                                                                objectFit:
                                                                    "cover",
                                                            }}
                                                        />
                                                    )}
                                                    <div className="fw-medium">
                                                        {product.name}
                                                    </div>
                                                </div>
                                            </td>

                                            <td className="py-2">
                                                {product.production_code}
                                            </td>

                                            <td className="py-2">
                                                <span
                                                    style={{
                                                        background: "#f1f5f9",
                                                        padding: "4px 10px",
                                                        borderRadius: "999px",
                                                        fontSize: "12px",
                                                    }}
                                                >
                                                    {product.category?.name ??
                                                        "No Category"}
                                                </span>
                                            </td>

                                            <td className="py-2">
                                                Rp{" "}
                                                {Number(
                                                    product.cost_price ?? 0,
                                                ).toLocaleString()}
                                            </td>

                                            <td className="fw-semibold py-2">
                                                Rp{" "}
                                                {Number(
                                                    product.selling_price ?? 0,
                                                ).toLocaleString()}
                                            </td>

                                            <td className="text-center py-2">
                                                <span
                                                    className={`badge rounded-pill px-3 ${
                                                        product.stock_total
                                                            ?.total_stock > 10
                                                            ? "bg-success"
                                                            : product
                                                                    .stock_total
                                                                    ?.total_stock >
                                                                0
                                                              ? "bg-warning text-dark"
                                                              : "bg-danger"
                                                    }`}
                                                >
                                                    {product.stock_total
                                                        ?.total_stock ?? 0}
                                                </span>
                                            </td>

                                            <td className="text-center py-2">
                                                <div className="d-flex justify-content-center gap-2">
                                                    <Link
                                                        href={`/admin/products/${product.id}/edit`}
                                                        className="d-flex align-items-center justify-content-center"
                                                        style={{
                                                            width: "36px",
                                                            height: "36px",
                                                            borderRadius:
                                                                "10px",
                                                            border: "1px solid #cbd5e1",
                                                            color: "#4f46e5",
                                                            background: "#fff",
                                                        }}
                                                    >
                                                        <i className="bi bi-pencil"></i>
                                                    </Link>

                                                    <button
                                                        onClick={() =>
                                                            handleDelete(
                                                                product.id,
                                                            )
                                                        }
                                                        className="d-flex align-items-center justify-content-center"
                                                        style={{
                                                            width: "36px",
                                                            height: "36px",
                                                            borderRadius:
                                                                "10px",
                                                            border: "1px solid #cbd5e1",
                                                            color: "#ef4444",
                                                            background: "#fff",
                                                        }}
                                                    >
                                                        <i className="bi bi-trash"></i>
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td
                                            colSpan="8"
                                            className="text-center py-4 text-muted"
                                        >
                                            Tidak ada produk ditemukan
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    <div
                        className="px-4 py-3 d-flex justify-content-start"
                        style={{
                            borderTop: "1px solid #f1f3f5",
                            background: "#fff",
                        }}
                    >
                        <Pagination links={products.links} />
                    </div>
                </div>
            </AdminLayout>
        </>
    );
}
