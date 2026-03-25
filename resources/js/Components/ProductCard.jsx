import React from "react";
import Swal from "sweetalert2";
import { formatRupiah } from "../utils/rupiah";

const ProductCard = ({ product, onSelect }) => {
    if (!product) return null;

    const isOutOfStock = !product.stock || Number(product.stock) <= 0;
    const stockQuantity = Number(product.stock ?? 0);

    const handleClick = () => {
        if (isOutOfStock) {
            Swal.fire({
                icon: "error",
                title: "Stock Anda Telah Habis",
                text: `Produk "${product.name}" sedang tidak tersedia.`,
                confirmButtonText: "OK",
            });
            return;
        }

        onSelect(product);
    };

    return (
        <div
            className={`card h-100 shadow-sm ${
                isOutOfStock ? "border-danger opacity-75" : ""
            }`}
            style={{
                cursor: isOutOfStock ? "not-allowed" : "pointer",
                position: "relative",
            }}
            onClick={handleClick}
        >
            {isOutOfStock && (
                <span
                    className="badge bg-danger"
                    style={{
                        position: "absolute",
                        top: "10px",
                        right: "10px",
                        zIndex: 2,
                    }}
                >
                    Stock Habis
                </span>
            )}

            <div className="card border-0 shadow-sm rounded-4 overflow-hidden h-100 transition">
                {/* IMAGE */}
                <div className="position-relative">
                    <img
                        // src={product.image ?? "../../assets/images/produk.png"}
                        src={"../assets/images/produk.png"}
                        alt={product.name}
                        className="w-100"
                        style={{
                            height: "100%",
                            objectFit: "cover",
                        }}
                    />
                </div>

                {/* BODY */}
                <div className="card-body text-center py-3">
                    <h6 className="fw-semibold mb-2">{product.name}</h6>

                    <p className="text-muted mb-2 small">
                        {formatRupiah(product.selling_price)}
                    </p>

                    <small
                        className={`fw-semibold ${
                            isOutOfStock ? "text-danger" : "text-success"
                        }`}
                    >
                        {isOutOfStock
                            ? "Stock Anda Telah Habis"
                            : `Stock: ${stockQuantity}`}
                    </small>
                </div>
            </div>
        </div>
    );
};

export default ProductCard;
