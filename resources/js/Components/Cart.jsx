import React from "react";
import DataTable from "react-data-table-component";
import { formatRupiah } from "../utils/rupiah";
import { setCartItems } from "../Pages/hooks/useSalesReducer";

const Cart = ({ cartItems = [], dispatch, onDelete }) => {
    const handleIncrease = (id) => {
        const updated = cartItems.map((item) => {
            if (item.id === id) {
                const newQty = item.quantity + 1;

                return {
                    ...item,
                    quantity: newQty,
                    total_price: newQty * item.selling_price,
                };
            }
            return item;
        });

        dispatch(setCartItems(updated));
    };

    const handleDecrease = (id) => {
        const updated = cartItems.map((item) => {
            if (item.id === id && item.quantity > 1) {
                const newQty = item.quantity - 1;

                return {
                    ...item,
                    quantity: newQty,
                    total_price: newQty * item.selling_price,
                };
            }
            return item;
        });

        dispatch(setCartItems(updated));
    };

    const columns = [
        {
            name: "No",
            selector: (row, index) => index + 1,
            width: "60px",
            center: true,
        },
        {
            name: "Product Item",
            selector: (row) => row.name,
            grow: 2,
        },
        {
            name: "Qty",
            cell: (row) => (
                <div className="d-flex align-items-center gap-2">
                    <button
                        className="btn btn-sm btn-outline-secondary"
                        onClick={() => handleDecrease(row.id)}
                        disabled={row.quantity <= 1}
                    >
                        -
                    </button>

                    <span className="fw-bold">{row.quantity}</span>

                    <button
                        className="btn btn-sm btn-outline-primary"
                        onClick={() => handleIncrease(row.id)}
                        disabled={row.quantity >= row.stock} // optional batas stock
                    >
                        +
                    </button>
                </div>
            ),
            center: true,
            width: "160px",
        },
        {
            name: "Total",
            selector: (row) => formatRupiah(row.total_price),
            right: true,
        },
        {
            name: "Actions",
            cell: (row) => (
                <button
                    className="btn btn-sm btn-danger"
                    onClick={() => onDelete(row.id)}
                >
                    <i className="bi bi-trash"></i>
                </button>
            ),
            button: true,
            width: "80px",
            center: true,
        },
    ];

    return (
        <div className="card shadow-sm">
            <div className="card-body p-2">
                <DataTable
                    columns={columns}
                    data={cartItems}
                    highlightOnHover
                    striped
                    responsive
                    dense
                    noDataComponent={
                        <div className="py-3 text-muted text-center">
                            Belum ada produk di keranjang
                        </div>
                    }
                />
            </div>
        </div>
    );
};

export default Cart;
