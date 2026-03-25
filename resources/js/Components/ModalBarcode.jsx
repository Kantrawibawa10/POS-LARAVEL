import React from "react";
import Barcode from "react-barcode";

export default function ModalBarcode({ show, stock, onClose }) {
    if (!show || !stock) return null;

    const productName = stock.product?.name ?? "Produk";

    const downloadBarcode = (code) => {
        const svg = document.getElementById(`barcode-${code}`);
        if (!svg) return;

        const canvas = document.createElement("canvas");
        const img = new Image();

        img.onload = () => {
            canvas.width = img.width;
            canvas.height = img.height;
            canvas.getContext("2d").drawImage(img, 0, 0);

            const link = document.createElement("a");
            link.download = `barcode-${code}.png`;
            link.href = canvas.toDataURL("image/png");
            link.click();
        };

        img.src =
            "data:image/svg+xml;base64," +
            btoa(new XMLSerializer().serializeToString(svg));
    };

    return (
        <>
            <div className="modal fade show d-block saas-modal">
                <div className="modal-dialog modal-xl modal-dialog-centered">
                    <div className="modal-content saas-modal-content">
                        {/* ================= HEADER ================= */}
                        <div className="saas-modal-header">
                            <div className="d-flex align-items-center gap-3">
                                <div className="saas-icon-box">
                                    <i className="bi bi-upc-scan"></i>
                                </div>

                                <div>
                                    <h5 className="mb-0 fw-semibold">
                                        Barcode Generator
                                    </h5>
                                    <small className="text-muted">
                                        {productName}
                                    </small>
                                </div>
                            </div>

                            <button className="btn-close" onClick={onClose} />
                        </div>

                        {/* ================= BODY ================= */}
                        <div className="modal-body">
                            <div className="table-responsive">
                                <table className="table saas-table align-middle">
                                    <thead>
                                        <tr>
                                            <th width="60">No</th>
                                            <th>Produk</th>
                                            <th className="text-center">
                                                Barcode
                                            </th>
                                            <th
                                                width="150"
                                                className="text-center"
                                            >
                                                Action
                                            </th>
                                        </tr>
                                    </thead>

                                    <tbody>
                                        {Array.isArray(stock.barcodes) &&
                                        stock.barcodes.length > 0 ? (
                                            stock.barcodes.map(
                                                (item, index) => (
                                                    <tr key={item.id}>
                                                        <td className="text-muted text-center">
                                                            {index + 1}
                                                        </td>

                                                        <td className="fw-medium">
                                                            {productName}
                                                        </td>

                                                        <td className="text-center">
                                                            <div className="barcode-card">
                                                                <Barcode
                                                                    id={`barcode-${item.barcode}`}
                                                                    value={
                                                                        item.barcode
                                                                    }
                                                                    format="CODE128"
                                                                    width={2}
                                                                    height={60}
                                                                    displayValue
                                                                    renderer="svg"
                                                                />
                                                            </div>
                                                        </td>

                                                        <td className="text-center">
                                                            <button
                                                                className="btn saas-btn-outline"
                                                                onClick={() =>
                                                                    downloadBarcode(
                                                                        item.barcode,
                                                                    )
                                                                }
                                                            >
                                                                <i className="bi bi-download me-1"></i>
                                                                Download
                                                            </button>
                                                        </td>
                                                    </tr>
                                                ),
                                            )
                                        ) : (
                                            <tr>
                                                <td
                                                    colSpan="4"
                                                    className="text-center text-muted py-5"
                                                >
                                                    Barcode tidak ditemukan
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="modal-backdrop fade show"></div>

            {/* ================= STYLE ================= */}
            <style>{`

/* MODAL */
.saas-modal-content{
    border-radius:18px;
    border:none;
    overflow:hidden;
}

.modal-body{
    padding:18px 26px 14px 26px !important;
}

/* HEADER */
.saas-modal-header{
    padding:22px 26px;
    border-bottom:1px solid #f1f3f5;
    display:flex;
    align-items:center;
    justify-content:space-between;
    background:#fff;
}

/* ICON */
.saas-icon-box{
    width:44px;
    height:44px;
    border-radius:14px;
    background:linear-gradient(135deg,#6366f1,#8b5cf6);
    display:flex;
    align-items:center;
    justify-content:center;
    color:#fff;
    font-size:18px;
}

/* TABLE STYLE */
.saas-table thead th{
    font-size:13px;
    text-transform:uppercase;
    letter-spacing:.4px;
    color:#6b7280;
    border-bottom:1px solid #f1f3f5;
}

.saas-table td,
.saas-table th{
    padding:10px 12px !important;
    vertical-align:middle;
}

.saas-table tbody tr{
    transition:.15s ease;
}

.saas-table tbody tr:hover{
    background:#fafafa;
}

/* BARCODE CARD */
.barcode-card{
    background:#fff;
    border:1px solid #f1f3f5;
    border-radius:12px;
    padding:8px 10px;
    display:inline-block;
}

.table{
    margin-bottom:0 !important;
}

/* BUTTON */
.saas-btn-outline{
    border:1px solid #e5e7eb;
    border-radius:10px;
    background:#fff;
    transition:.2s;
}

.saas-btn-outline:hover{
    background:#f9fafb;
}

/* FOOTER */
.saas-modal-footer{
    padding:16px 26px;
    border-top:1px solid #f1f3f5;
    display:flex;
    justify-content:flex-end;
    background:#fff;
}

`}</style>
        </>
    );
}
