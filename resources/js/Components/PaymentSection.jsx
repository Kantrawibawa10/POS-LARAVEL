import React from "react";
import { formatRupiah } from "../utils/rupiah";

const PaymentSection = ({
    subTotal = 0,
    discount = 0,
    onDiscountChange,
    paymentMethod,
    onPaymentMethodChange,
    cash = 0,
    onCashChange,
    onProcessPayment,
    isProcessing = false,
}) => {
    // cek apakah cart kosong
    const isCartEmpty = subTotal <= 0;

    // total setelah diskon
    const grandTotal = Math.max(0, subTotal - discount);

    // uang kembalian
    const change = Math.max(0, cash - grandTotal);

    return (
        <div className="card shadow-lg">
            <div className="card-body">
                <div className="row g-4">
                    {/* LEFT */}
                    <div className="col-md-6">
                        {/* Discount */}
                        <div className="mb-3">
                            <h5>Discount</h5>

                            <div className="input-group">
                                <span className="input-group-text">Rp</span>

                                <input
                                    type="number"
                                    className="form-control p-3"
                                    placeholder="0"
                                    value={discount}
                                    onChange={onDiscountChange}
                                    disabled={isProcessing || isCartEmpty}
                                />
                            </div>

                            {/* Notifikasi */}
                            {isCartEmpty && (
                                <small className="text-danger">
                                    Tambahkan produk ke cart terlebih dahulu
                                    untuk menggunakan diskon.
                                </small>
                            )}
                        </div>

                        {/* Payment Method */}
                        <div className="mb-3">
                            <h5>Payment Method</h5>

                            <div className="d-flex">
                                <div className="form-check me-3">
                                    <input
                                        className="form-check-input"
                                        type="radio"
                                        value="cash"
                                        checked={paymentMethod === "cash"}
                                        onChange={onPaymentMethodChange}
                                        disabled={isProcessing}
                                    />
                                    <label className="form-check-label">
                                        Cash
                                    </label>
                                </div>

                                <div className="form-check">
                                    <input
                                        className="form-check-input"
                                        type="radio"
                                        value="online"
                                        checked={paymentMethod === "online"}
                                        onChange={onPaymentMethodChange}
                                        disabled={isProcessing}
                                    />
                                    <label className="form-check-label">
                                        Online
                                    </label>
                                </div>
                            </div>
                        </div>

                        {/* Cash */}
                        {paymentMethod === "cash" && (
                            <div className="mb-3">
                                <h5>Cash</h5>

                                <div className="input-group">
                                    <span className="input-group-text">Rp</span>

                                    <input
                                        type="number"
                                        className="form-control p-3"
                                        value={cash}
                                        onChange={onCashChange}
                                        disabled={isProcessing || isCartEmpty}
                                    />
                                </div>
                            </div>
                        )}
                    </div>

                    {/* RIGHT */}
                    <div className="col-md-6">
                        {/* Grand Total */}
                        <div className="p-4 bg-light rounded-3 mb-4">
                            <h6>Grand Total</h6>

                            <h2 className="text-primary" style={{ fontSize: "25px" }}>
                                {formatRupiah(grandTotal)}
                            </h2>

                            {discount > 0 && (
                                <div className="text-success">
                                    Diskon: {formatRupiah(discount)}
                                </div>
                            )}
                        </div>

                        {/* Change */}
                        {paymentMethod === "cash" && (
                            <div className="p-4 bg-primary bg-opacity-10 rounded-3 mb-4">
                                <h6>Change (Uang Kembalian)</h6>

                                <h2 className="text-primary" style={{ fontSize: "25px" }}>
                                    {formatRupiah(change)}
                                </h2>
                            </div>
                        )}

                        {/* Button */}
                    </div>

                    <div className="col-md-12">
                        <div className="d-grid">
                            <button
                                className="btn btn-success py-3"
                                onClick={onProcessPayment}
                                disabled={isProcessing || isCartEmpty}
                            >
                                {isProcessing ? (
                                    <>
                                        <span className="spinner-border spinner-border-sm me-2"></span>
                                        Processing...
                                    </>
                                ) : (
                                    <>
                                        <i className="bi bi-cash-stack me-2"></i>
                                        Process Payment
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PaymentSection;
