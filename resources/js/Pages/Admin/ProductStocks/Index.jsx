import React, { useState, useEffect } from "react";
import { Head, usePage, Link, router } from "@inertiajs/react";
import Swal from "sweetalert2";
import Pagination from "../../../Components/Pagination";
import AdminLayout from "../../../Layouts/AdminLayout";
import hasAnyPermission from "../../../utils/hasAnyPermission";
import ModalBarcode from "../../../Components/ModalBarcode";

export default function ProductStockIndex() {
    const {
        productStocks = { data: [] },
        suppliers = [],
        filters = { q: "" },
    } = usePage().props;
    const [search, setSearch] = useState(filters.q || "");

    const [filterText, setFilterText] = useState(filters.q || "");
    const [selectedSupplier, setSelectedSupplier] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [selectedStock, setSelectedStock] = useState(null);
    const props = usePage().props;

    // ✅ FILTER AMAN
    const filteredStocks = productStocks.data.filter((stock) => {
        const search = filterText.trim().toLowerCase();

        const supplierName = stock.supplier?.name?.toLowerCase() || "";
        const productName = stock.product?.name?.toLowerCase() || "";

        const matchSearch =
            supplierName.includes(search) || productName.includes(search);

        const matchSupplier = selectedSupplier
            ? stock.supplier?.id === Number(selectedSupplier)
            : true;

        return matchSearch && matchSupplier;
    });

    const formatDate = (receivedAt, createdAt) => {
        const date = receivedAt || createdAt;

        if (!date) return "-";

        const d = new Date(date);

        if (isNaN(d)) return "-";

        return d.toISOString().split("T")[0]; // yyyy-mm-dd
    };

    useEffect(() => {
        const delay = setTimeout(() => {
            router.get(
                "/admin/stocks",
                { q: search, page: 1 },
                {
                    preserveState: true,
                    replace: true,
                },
            );
        }, 400);

        return () => clearTimeout(delay);
    }, [search]);

    const handleDelete = (id) => {
        Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            confirmButtonText: "Yes, delete it!",
        }).then((result) => {
            if (result.isConfirmed) {
                router.delete(`/admin/stocks/${id}`, {
                    onSuccess: () =>
                        Swal.fire(
                            "Deleted!",
                            "Product stock deleted.",
                            "success",
                        ),
                });
            }
        });
    };

    return (
        <>
            <Head title="Stock - EasyPOS" />

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
                                style={{
                                    width: "44px",
                                    height: "44px",
                                    borderRadius: "14px",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                }}

                                className="bg-primary"
                            >
                                <i className="bi bi-box-seam text-white fs-5"></i>
                            </div>

                            <div>
                                <h5 className="fw-semibold mb-1">
                                    Stock Management
                                </h5>
                                <small className="text-muted">
                                    Kelola stok produk berdasarkan supplier
                                </small>
                            </div>
                        </div>
                    </div>

                    {/* FILTER SECTION */}
                    <div className="d-flex align-items-center gap-3 flex-wrap">
                        {/* Search */}
                        <div
                            className="d-flex align-items-center px-3"
                            style={{
                                height: "42px",
                                border: "1px solid #e5e7eb",
                                borderRadius: "12px",
                                background: "#f9fafb",
                                minWidth: "250px",
                            }}
                        >
                            <i className="bi bi-search text-muted me-2"></i>
                            <input
                                type="text"
                                placeholder="Search Stocks..."
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
                                        "/admin/stocks",
                                        { q: value, page: 1 },
                                        {
                                            preserveState: true,
                                            replace: true,
                                        },
                                    );
                                }}
                            />
                        </div>

                        {/* Supplier Dropdown */}
                        <select
                            className="form-select"
                            style={{
                                height: "42px",
                                borderRadius: "12px",
                                border: "1px solid #e5e7eb",
                                maxWidth: "220px",
                            }}
                            value={selectedSupplier}
                            onChange={(e) =>
                                setSelectedSupplier(e.target.value)
                            }
                        >
                            <option value="">Semua Supplier</option>
                            {suppliers.map((s) => (
                                <option key={s.id} value={s.id}>
                                    {s.name}
                                </option>
                            ))}
                        </select>

                        {hasAnyPermission(["stocks.create"]) && (
                            <Link
                                href="/admin/stocks/create"
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
                                Tambah Stok
                            </Link>
                        )}
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
                                    <th className="py-2">Supplier</th>
                                    <th className="py-2">Stok</th>
                                    <th className="text-center py-2">
                                        Tanggal
                                    </th>
                                    <th
                                        className="text-center py-2"
                                        width="150"
                                    >
                                        Action
                                    </th>
                                </tr>
                            </thead>

                            <tbody>
                                {filteredStocks.length > 0 ? (
                                    productStocks.data.map((stock, i) => (
                                        <tr
                                            key={stock.id}
                                            style={{
                                                borderTop: "1px solid #f1f5f9",
                                            }}
                                        >
                                            <td className="text-center py-2">
                                                {i +
                                                    1 +
                                                    (productStocks.current_page -
                                                        1) *
                                                        productStocks.per_page}
                                            </td>

                                            <td className="fw-medium py-2">
                                                {stock.product?.name ?? "-"}
                                            </td>

                                            <td className="py-2">
                                                {stock.supplier?.name ?? "-"}
                                            </td>

                                            <td className="fw-semibold py-2">
                                                {stock.stock_quantity ?? 0}
                                            </td>

                                            <td className="text-center py-2">
                                                {formatDate(
                                                    stock.received_at ??
                                                        stock.created_at,
                                                )}
                                            </td>

                                            <td className="text-center py-2">
                                                <div className="d-flex justify-content-center gap-2">
                                                    <button
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
                                                        onClick={() => {
                                                            setSelectedStock(
                                                                stock,
                                                            );
                                                            setShowModal(true);
                                                        }}
                                                    >
                                                        <i className="bi bi-upc-scan"></i>
                                                    </button>

                                                    {/* {hasAnyPermission([
                                                        "stocks.edit",
                                                    ]) && (
                                                        <Link
                                                            href={`/admin/stocks/${stock.id}/edit`}
                                                            className="d-flex align-items-center justify-content-center"
                                                            style={{
                                                                width: "36px",
                                                                height: "36px",
                                                                borderRadius:
                                                                    "10px",
                                                                border: "1px solid #cbd5e1",
                                                                color: "#4f46e5",
                                                                background:
                                                                    "#fff",
                                                                textDecoration:
                                                                    "none",
                                                            }}
                                                        >
                                                            <i className="bi bi-pencil"></i>
                                                        </Link>
                                                    )} */}

                                                    {hasAnyPermission([
                                                        "stocks.delete",
                                                    ]) && (
                                                        <button
                                                            onClick={() =>
                                                                handleDelete(
                                                                    stock.id,
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
                                                                background:
                                                                    "#fff",
                                                            }}
                                                        >
                                                            <i className="bi bi-trash"></i>
                                                        </button>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td
                                            colSpan="6"
                                            className="text-center py-4 text-muted"
                                        >
                                            Tidak ada data stok.
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
                        <Pagination links={productStocks.links} />
                    </div>
                </div>

                <ModalBarcode
                    show={showModal}
                    stock={selectedStock}
                    onClose={() => setShowModal(false)}
                />
            </AdminLayout>
        </>
    );
}
