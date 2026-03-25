import React, { useEffect, useRef, useCallback, useState } from "react";
import { usePage, router, Link, Head } from "@inertiajs/react";
import Swal from "sweetalert2";
import ReactToPrint from "react-to-print";
import BarcodeScannerComponent from "react-qr-barcode-scanner";
import { Html5Qrcode } from "html5-qrcode";
import { FaTrash } from "react-icons/fa";

// Impor utilitas dan komponen
import { formatRupiah } from "../../../utils/rupiah";
import ProductList from "../../../Components/ProductList";
import Cart from "../../../Components/Cart";
import PaymentSection from "../../../Components/PaymentSection";
import CustomerSelector from "../../../Components/CustomerSelector";
import ModalProduk from "../../../Components/ModalProduk";
import Receipt from "../../../Components/Receipt";
import AdminLayout from "../../../Layouts/AdminLayout";
import Sidebar from "../../../Components/Sidebar";

// Impor custom hook dan action untuk manajemen state
import useSalesReducer, {
    setSelectedCustomer,
    setSelectedProduct,
    setQuantity,
    setShowModal,
    setCartItems,
    setProducts,
    calculateSubtotal,
    filterProducts,
    resetSelections,
    setDiscount,
    setCash,
    setPaymentMethod,
    setSearchTerm,
    setShowReceiptModal,
    setShowSnapModal,
    setSelectedCategory,
    setChange,
} from "../../hooks/useSalesReducer";

const Sales = () => {
    // Props dari controller
    const {
        errors,
        auth,
        payment_link_url,
        carts = [],
        categories = [],
        products = [],
        customers = [],
    } = usePage().props;

    // Inisialisasi reducer & state
    const { state, dispatch } = useSalesReducer();

    // Refs
    const componentRef = useRef();
    const reactToPrintRef = useRef();
    const isPayingRef = useRef(false);
    const scannerRef = useRef(null);
    const html5QrCodeRef = useRef(null);

    // Ref untuk input pencarian produk
    const searchInputRef = useRef(null);

    // State lokal
    const [transactionSnapshot, setTransactionSnapshot] = useState(null);
    const [showScanner, setShowScanner] = useState(false); // State untuk menampilkan scanner
    // const [cartItems, setCartItems] = useState([]);

    <BarcodeScannerComponent
        width={260}
        height={260}
        onUpdate={handleBarcodeDetected}
        formats={["code_128", "ean_13", "ean_8", "code_39"]}
    />;

    /*
   |--------------------------------------------------------------------------
   | Fungsi-fungsi Callback & Handler
   |--------------------------------------------------------------------------
   */

    // Menampilkan notifikasi menggunakan SweetAlert2
    const showAlert = useCallback((title, text, icon, options = {}) => {
        Swal.fire({
            title,
            text,
            icon,
            confirmButtonText: "OK",
            ...options,
        });
    }, []);

    // Menampilkan/Tutup modal Bootstrap
    const toggleModal = useCallback((modalId, show) => {
        const modalElement = document.getElementById(modalId);
        if (modalElement) {
            const modalInstance = show
                ? new window.bootstrap.Modal(modalElement)
                : window.bootstrap.Modal.getInstance(modalElement);
            show ? modalInstance.show() : modalInstance.hide();
        }
    }, []);

    // Handler perubahan input numerik (untuk discount, cash, quantity)
    const handleInputChange = (actionCreator) => (e) => {
        const value = e.target.value.replace(/[^\d]/g, ""); // hanya angka
        dispatch(actionCreator(value));
    };

    // Memilih produk dari daftar
    const handleSelectProduct = (product) => {
        const existingItem = state.cartItems.find(
            (item) => item.id === product.id,
        );

        let updatedCart;

        if (existingItem) {
            // Jika sudah ada → tambah qty
            updatedCart = state.cartItems.map((item) =>
                item.id === product.id
                    ? {
                          ...item,
                          quantity: item.quantity + 1,
                          total_price: (item.quantity + 1) * item.selling_price,
                      }
                    : item,
            );
        } else {
            // Jika belum ada → tambah baru
            updatedCart = [
                ...state.cartItems,
                {
                    id: product.id,
                    name: product.name,
                    selling_price: product.selling_price,
                    quantity: 1,
                    total_price: product.selling_price,
                },
            ];
        }

        dispatch(setCartItems(updatedCart));
    };

    // Menghapus item dari cart
    const handleDeleteProduct = (id) => {
        Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, delete it!",
        }).then((result) => {
            if (result.isConfirmed) {
                router.delete(`/admin/sales/delete-from-cart/${id}`, {
                    onSuccess: () => {
                        const updatedCart = state.cartItems.filter(
                            (item) => item.id !== id,
                        );
                        dispatch(setCartItems(updatedCart));
                        showAlert(
                            "Deleted",
                            "Your items have been deleted.",
                            "warning",
                            {
                                toast: true,
                                position: "top-end",
                                showConfirmButton: false,
                                timer: 3000,
                            },
                        );
                    },
                    onError: (errors) => {
                        const message =
                            errors.error ||
                            Object.values(errors)[0] ||
                            "Terjadi kesalahan.";

                        showAlert("Error!", message, "error");
                    },
                });
            }
        });
    };

    // Menambah produk ke cart
    const handleAddToCart = (product = null) => {
        const selectedProduct = product || state.selectedProduct;

        if (!selectedProduct || !selectedProduct.id) {
            return showAlert("Error!", "Please select a product.", "error");
        }

        const quantity = Number(state.quantity) || 1;

        const existingItem = state.cartItems.find(
            (item) => item.id === selectedProduct.id,
        );

        let updatedCart;

        if (existingItem) {
            updatedCart = state.cartItems.map((item) =>
                item.id === selectedProduct.id
                    ? {
                          ...item,
                          quantity: item.quantity + quantity,
                          total_price:
                              (item.quantity + quantity) * item.selling_price,
                      }
                    : item,
            );
        } else {
            updatedCart = [
                ...state.cartItems,
                {
                    id: selectedProduct.id,
                    product_id: selectedProduct.id,
                    name: selectedProduct.name,
                    selling_price: selectedProduct.selling_price,
                    quantity: quantity,
                    total_price: selectedProduct.selling_price * quantity,
                },
            ];
        }

        dispatch(setCartItems(updatedCart));
        dispatch(resetSelections());
    };

    // Mencetak struk
    const handlePrintReceipt = () => {
        setTimeout(() => reactToPrintRef.current?.handlePrint(), 100);
    };

    // Menangani respon dari pembayaran Snap
    const handleSnapResponse = (title, text, icon, success, callback) => {
        dispatch(setShowSnapModal(false));
        toggleModal("snapModal", false);
        showAlert(title, text, icon, {
            toast: icon === "success",
            position: icon === "success" ? "top-end" : "center",
            showConfirmButton: icon !== "success",
            timer: icon === "success" ? 3000 : undefined,
        });

        if (success) handlePrintReceipt(); // Cetak struk jika sukses
        if (callback) callback();

        // Reset status pembayaran jika gagal/cancel
        if (!success) isPayingRef.current = false;
    };

    // Memproses pembayaran
    const handleProcessPayment = async () => {
        const subTotal = state.subTotal;
        const discount = parseFloat(state.discount) || 0;
        const totalAmount = subTotal - discount;

        // Jika pembayaran tunai, pastikan cash >= totalAmount
        const cash =
            state.paymentMethod === "cash" ? parseFloat(state.cash) || 0 : null;

        if (state.paymentMethod === "cash" && cash < totalAmount) {
            return showAlert(
                "Uang Tunai Tidak Cukup!",
                "Jumlah uang tunai tidak boleh kurang dari jumlah total.",
                "error",
            );
        }

        // Simpan snapshot data transaksi (untuk cetak struk)
        const snapshot = {
            cartItems: [...state.cartItems],
            subTotal,
            discount,
            totalAmount,
            cash,
            change: state.change,
        };
        setTransactionSnapshot(snapshot);

        // Data untuk dikirim ke server
        const transactionData = {
            customer_id: state.selectedCustomer || null,
            total_amount: totalAmount,
            cash: cash,
            change: state.paymentMethod === "cash" ? state.change : null,
            discount: discount,
            cart_items: state.cartItems,
            payment_method: state.paymentMethod,
        };

        try {
            await router.post("/admin/sales/process-payment", transactionData, {
                onSuccess: (page) => {
                    const paymentRef = page.props.payment_link_url;

                    if (state.paymentMethod === "online" && paymentRef) {
                        // Jika pembayaran online, tampilkan modal Snap
                        dispatch(setShowSnapModal(true));
                    } else if (state.paymentMethod === "cash") {
                        // 1. Tampilkan notifikasi bahwa payment sukses
                        showAlert(
                            "Payment Successful!",
                            "Transaction has been completed.",
                            "success",
                            {
                                toast: true,
                                position: "top-end",
                                showConfirmButton: false,
                                timer: 3000,
                            },
                        );

                        // 2. Tampilkan SweetAlert untuk konfirmasi cetak struk
                        Swal.fire({
                            title: "Cetak Struk?",
                            text: "Apakah Anda ingin mencetak struk sekarang?",
                            icon: "question",
                            showCancelButton: true,
                            confirmButtonText: "Yes, print it",
                            cancelButtonText: "No, later",
                        }).then((result) => {
                            if (result.isConfirmed) {
                                // Jika user menekan "Yes", tampilkan modal Receipt
                                dispatch(setShowReceiptModal(true));
                            }
                        });

                        dispatch(setCash(""));
                        dispatch(setChange(0));
                        dispatch(setDiscount(""));
                        dispatch(setQuantity(1));
                    } else {
                        // Jika ada metode lain, atau Anda ingin fallback ke logika sebelumnya
                        showAlert(
                            "Payment Successful!",
                            "Transaction has been completed.",
                            "success",
                            {
                                toast: true,
                                position: "top-end",
                                showConfirmButton: false,
                                timer: 3000,
                            },
                        );

                        // Tampilkan modal Receipt
                        dispatch(setShowReceiptModal(true));

                        // Reset state setelah sukses
                        dispatch(setCash(""));
                        dispatch(setChange(0));
                        dispatch(setDiscount(""));
                        dispatch(setQuantity(1));
                    }
                },
                onError: (errors) => {
                    const message =
                        errors.error ||
                        Object.values(errors)[0] ||
                        "Failed to process payment.";

                    showAlert("Error!", message, "error");
                },
            });
        } catch (error) {
            showAlert(
                "Error!",
                "An error occurred while processing the payment.",
                "error",
            );
        }
    };

    /*
   |--------------------------------------------------------------------------
   | useEffect Hooks
   |--------------------------------------------------------------------------
   */

    // Fokus pada input pencarian saat komponen dimuat
    useEffect(() => {
        if (searchInputRef.current) {
            searchInputRef.current.focus();
        }
    }, []);

    // Fokus kembali pada input pencarian setelah menutup modal produk
    useEffect(() => {
        if (!state.showModal) {
            if (searchInputRef.current) {
                searchInputRef.current.focus();
            }
        }
    }, [state.showModal]);

    // Tambahkan event listener untuk menangani pemindaian barcode (Jika menggunakan scanner eksternal)
    useEffect(() => {
        const handleBarcodeScan = (e) => {
            // Jika tombol yang ditekan adalah Enter, lakukan pencarian atau aksi lainnya
            if (e.key === "Enter") {
                if (state.searchTerm) {
                    const scannedProduct = state.products.find(
                        (product) => product.barcode === state.searchTerm,
                    );
                    if (scannedProduct) {
                        dispatch(setSelectedProduct(scannedProduct));
                        dispatch(setQuantity(1)); // Atur kuantitas default
                        handleAddToCart();
                    } else {
                        showAlert(
                            "Product Not Found",
                            "Produk dengan barcode tersebut tidak ditemukan.",
                            "error",
                        );
                    }
                    // Setelah aksi, bersihkan search term
                    dispatch(setSearchTerm(""));
                }
            }
        };

        window.addEventListener("keydown", handleBarcodeScan);

        return () => {
            window.removeEventListener("keydown", handleBarcodeScan);
        };
    }, [state.searchTerm, state.products, dispatch, showAlert]);

    // Tampilkan error quantity jika ada
    useEffect(() => {
        if (errors?.quantity) {
            showAlert("Error!", errors.quantity, "error");
        }
    }, [errors, showAlert]);

    // Filter produk saat kategori atau search term berubah
    useEffect(() => {
        dispatch(filterProducts());
    }, [state.selectedCategory, state.searchTerm, dispatch]);

    // Inisialisasi cart & produk + pasang script Midtrans
    useEffect(() => {
        dispatch(setCartItems(carts));
        dispatch(setProducts(products));

        const script = document.createElement("script");
        script.src = "https://app.sandbox.midtrans.com/snap/snap.js";
        script.setAttribute(
            "data-client-key",
            "SB-Mid-client-e4Iyy7H3H7SuP5tb",
        );
        script.async = true;

        document.body.appendChild(script);

        return () => {
            document.body.removeChild(script); // Bersihkan script saat unmount
        };
    }, [carts, products, dispatch]);

    // Hitung subtotal setiap kali cartItems berubah
    useEffect(() => {
        dispatch(calculateSubtotal());
    }, [state.cartItems, dispatch]);

    // Hitung kembalian jika metode cash berubah (atau discount/subTotal berubah)
    useEffect(() => {
        if (state.paymentMethod === "cash") {
            const cashValue = parseFloat(state.cash) || 0;
            const discountValue = parseFloat(state.discount) || 0;
            const changeValue = cashValue - (state.subTotal - discountValue);
            dispatch(setChange(changeValue >= 0 ? changeValue : 0));
        } else {
            dispatch(setChange(0));
        }
    }, [
        state.cash,
        state.subTotal,
        state.discount,
        state.paymentMethod,
        dispatch,
    ]);

    // Buka modal Snap jika payment_link_url terisi
    useEffect(() => {
        if (payment_link_url && !isPayingRef.current) {
            dispatch(setShowSnapModal(true));
            toggleModal("snapModal", true);
        }
    }, [payment_link_url, dispatch, toggleModal]);

    // Jalankan Snap pay jika showSnapModal true
    useEffect(() => {
        if (state.showSnapModal) {
            if (payment_link_url && !isPayingRef.current) {
                isPayingRef.current = true;
                window.snap.pay(payment_link_url, {
                    onSuccess: () => {
                        handleSnapResponse(
                            "Payment Successful!",
                            "Transaction has been completed.",
                            "success",
                            true,
                        );
                    },
                    onError: () => {
                        handleSnapResponse(
                            "Payment Failed",
                            "There was an issue processing your payment.",
                            "error",
                            false,
                        );
                    },
                    onClose: () => {
                        handleSnapResponse(
                            "Payment Cancelled",
                            "Payment was cancelled.",
                            "info",
                            false,
                            () => {
                                router.visit("/admin/sales", { replace: true });
                            },
                        );
                    },
                });
            }
        }
    }, [state.showSnapModal, payment_link_url]);

    // Tampilkan error umum dari server jika ada
    useEffect(() => {
        if (errors?.errors?.length) {
            showAlert("Error!", errors.errors[0], "error");
        }
    }, [errors, showAlert]);

    // Loading simulasi (1 detik)
    useEffect(() => {
        const timer = setTimeout(
            () => dispatch({ type: "SET_LOADING", payload: false }),
            1000,
        );
        return () => clearTimeout(timer);
    }, [dispatch]);

    // Cetak struk otomatis jika showReceiptModal === true & ada snapshot
    useEffect(() => {
        if (state.showReceiptModal && transactionSnapshot) {
            setTimeout(() => {
                handlePrintReceipt();
            }, 100);
        }
    }, [state.showReceiptModal, transactionSnapshot]);

    /*
   |--------------------------------------------------------------------------
   | Handler untuk Pemindaian Barcode
   |--------------------------------------------------------------------------
   */
    // ===============================
    // GLOBAL LOCK (hindari double scan)
    // ===============================
    let isProcessingBarcode = false;

    // ===============================
    // MAIN BARCODE PROCESSOR (Single Source of Truth)
    // ===============================
    const processBarcode = (barcode, options = {}) => {
        if (!barcode || isProcessingBarcode) return;

        isProcessingBarcode = true;

        const cleanBarcode = barcode.trim();

        const matchedProduct = products.find(
            (product) =>
                cleanBarcode === product.barcode ||
                cleanBarcode.startsWith(product.production_code),
        );

        // ❌ PRODUK TIDAK DITEMUKAN
        if (!matchedProduct) {
            Swal.fire({
                icon: "warning",
                title: "Barcode tidak dikenali",
                timer: 3000,
                timerProgressBar: true,
                showConfirmButton: false,
            }).then(() => {
                isProcessingBarcode = false;
            });
            return;
        }

        // ❌ STOCK HABIS
        if (matchedProduct.stock !== undefined && matchedProduct.stock <= 0) {
            Swal.fire({
                icon: "error",
                title: "Stock Habis",
                text: `Produk "${matchedProduct.name}" tidak tersedia.`,
                timer: 3000,
                timerProgressBar: true,
                showConfirmButton: false,
            }).then(() => {
                isProcessingBarcode = false;
            });
            return;
        }

        // ===============================
        // TAMBAH KE CART / DATA
        // ===============================
        if (options.mode === "cart") {
            dispatch({
                type: "ADD_TO_CART",
                payload: {
                    ...matchedProduct,
                    qty: 1,
                },
            });
        } else if (options.mode === "form") {
            setData("products", [
                ...data.products,
                {
                    product_id: matchedProduct.id,
                    physical_quantity: 1,
                },
            ]);
        } else if (options.mode === "select") {
            handleSelectProduct(matchedProduct);
            dispatch(setSearchTerm(""));
        }

        // ===============================
        // SUCCESS NOTIFICATION (3 detik)
        // ===============================
        Swal.fire({
            icon: "success",
            title: matchedProduct.name,
            text: "Produk berhasil ditambahkan 🎉",
            timer: 3000,
            timerProgressBar: true,
            showConfirmButton: false,
        }).then(() => {
            isProcessingBarcode = false;
        });
    };

    // ===============================
    // CAMERA BARCODE HANDLER
    // ===============================
    function handleBarcodeDetected(err, result) {
        if (err || !result) return;

        processBarcode(result.text, { mode: "cart" });
    }

    // ===============================
    // MANUAL BARCODE SCAN
    // ===============================
    const handleBarcodeScan = (barcode) => {
        processBarcode(barcode, { mode: "form" });
    };

    // ===============================
    // AUTO DETECT (INPUT FIELD)
    // ===============================

    let barcodeTimeout;

    const autoDetectBarcode = (value) => {
        const product = products.find((p) => p.barcode === value);
        clearTimeout(barcodeTimeout);

        if (product) {
            handleSelectProduct(product);
        } else {
            // jangan langsung tampilkan error
            // hanya jika panjang barcode valid
            if (value.length >= 12) {
                console.warn("Barcode tidak dikenali");
            }
        }

        barcodeTimeout = setTimeout(() => {
            const product = products.find((p) => p.barcode === value);

            if (product) {
                handleSelectProduct(product);
            }
        }, 200);
    };

    useEffect(() => {
        let barcodeBuffer = "";
        let lastScanTime = 0;

        const handleGlobalScanner = (e) => {
            const currentTime = new Date().getTime();

            // Jika terlalu lama antar key → reset buffer
            if (currentTime - lastScanTime > 100) {
                barcodeBuffer = "";
            }

            lastScanTime = currentTime;

            if (e.key === "Enter") {
                if (barcodeBuffer.length > 3) {
                    processScannedBarcode(barcodeBuffer);
                }
                barcodeBuffer = "";
                return;
            }

            barcodeBuffer += e.key;
        };

        window.addEventListener("keydown", handleGlobalScanner);

        return () => {
            window.removeEventListener("keydown", handleGlobalScanner);
        };
    }, [state.products]);

    const processScannedBarcode = (barcode) => {
        const cleanBarcode = barcode.trim();

        const foundProduct = state.products.find(
            (product) => product.barcode === cleanBarcode,
        );

        if (!foundProduct) return;

        if (!foundProduct.stock || foundProduct.stock <= 0) {
            Swal.fire({
                icon: "error",
                title: "Stock Anda Telah Habis",
                text: `Produk "${foundProduct.name}" tidak tersedia.`,
            });
            return;
        }

        handleSelectProduct(foundProduct);
    };

    useEffect(() => {
        if (!showScanner) return;

        const startScanner = async () => {
            const cameras = await Html5Qrcode.getCameras();

            if (cameras && cameras.length) {
                const cameraId = cameras[0].id; // otomatis pilih camera pertama

                html5QrCodeRef.current = new Html5Qrcode("reader");

                await html5QrCodeRef.current.start(
                    cameraId,
                    {
                        fps: 10,
                        qrbox: 250,
                    },
                    (decodedText) => {
                        handleBarcodeScan(decodedText);
                    },
                    (errorMessage) => {
                        // silent error
                    },
                );
            }
        };

        startScanner();

        return () => {
            if (html5QrCodeRef.current) {
                html5QrCodeRef.current.stop().catch(() => {});
            }
        };
    }, [showScanner]);

    /*
   |--------------------------------------------------------------------------
   | Bagian Render (return)
   |--------------------------------------------------------------------------
   */
    return (
        <>
            <Head>
                <title>Transaksi - EasyPOS</title>
            </Head>

            <AdminLayout>
                <div className="container-fluid mt-4">
                    <div className="d-flex align-items-center justify-content-between mb-4">
                        <div>
                            <h4 className="fw-bold mb-1">
                                Transaksi Penjualan
                            </h4>
                            <small className="text-muted">
                                Kelola transaksi dan pembayaran pelanggan
                            </small>
                        </div>

                        <Link
                            href="/admin/dashboard"
                            className="btn btn-outline-secondary btn-sm"
                        >
                            <i className="bi bi-arrow-left me-1"></i> Dashboard
                        </Link>
                    </div>

                    <div className="row gx-4"></div>

                    <div className="row gx-4">
                        {/* Bagian Kiri - Produk dan Kategori */}
                        <div className="col-md-6">
                            <div className="card shadow mb-4">
                                <div className="card-body">
                                    <div className="card shadow-sm border-0 mb-4">
                                        <div className="card-body">
                                            <div className="row g-3 align-items-end">
                                                <div className="col-md-4">
                                                    <label className="form-label fw-semibold">
                                                        Kategori
                                                    </label>
                                                    <select
                                                        className="form-select"
                                                        value={
                                                            state.selectedCategory
                                                        }
                                                        onChange={(e) =>
                                                            dispatch(
                                                                setSelectedCategory(
                                                                    e.target
                                                                        .value,
                                                                ),
                                                            )
                                                        }
                                                    >
                                                        <option value="">
                                                            Semua Kategori
                                                        </option>
                                                        {categories.map(
                                                            (cat) => (
                                                                <option
                                                                    key={cat.id}
                                                                    value={
                                                                        cat.id
                                                                    }
                                                                >
                                                                    {cat.name}
                                                                </option>
                                                            ),
                                                        )}
                                                    </select>
                                                </div>

                                                <div className="col-md-8">
                                                    <label className="form-label fw-semibold">
                                                        Cari Produk
                                                    </label>
                                                    <div className="input-group">
                                                        <span className="input-group-text bg-light">
                                                            <i className="bi bi-search"></i>
                                                        </span>
                                                        <input
                                                            className="form-control"
                                                            placeholder="Cari produk atau scan barcode..."
                                                            value={
                                                                state.searchTerm
                                                            }
                                                            onChange={(e) => {
                                                                const value =
                                                                    e.target
                                                                        .value;
                                                                dispatch(
                                                                    setSearchTerm(
                                                                        value,
                                                                    ),
                                                                );

                                                                // Jalankan barcode detect hanya jika kemungkinan barcode
                                                                if (
                                                                    /^\d+$/.test(
                                                                        value,
                                                                    ) &&
                                                                    value.length >=
                                                                        8
                                                                ) {
                                                                    autoDetectBarcode(
                                                                        value,
                                                                    );
                                                                }
                                                            }}
                                                            ref={searchInputRef}
                                                        />
                                                        <button
                                                            className="btn btn-outline-primary"
                                                            onClick={() =>
                                                                setShowScanner(
                                                                    !showScanner,
                                                                )
                                                            }
                                                        >
                                                            <i className="bi bi-upc-scan"></i>
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* SCANNER */}
                                    {showScanner && (
                                        <div className="card border-primary border-dashed mb-4 shadow-sm">
                                            <div className="card-body text-center">
                                                <h6 className="fw-bold mb-3">
                                                    <i className="bi bi-camera me-1"></i>
                                                    Scan Barcode
                                                </h6>

                                                <div className="d-flex justify-content-center">
                                                    <BarcodeScannerComponent
                                                        width={260}
                                                        height={260}
                                                        onUpdate={
                                                            handleBarcodeDetected
                                                        }
                                                    />
                                                </div>

                                                <button
                                                    type="button"
                                                    className="btn btn-outline-danger btn-sm mt-3"
                                                    onClick={() =>
                                                        setShowScanner(false)
                                                    }
                                                >
                                                    Tutup Scanner
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                    {/* Daftar Produk */}
                                    <ProductList
                                        products={state.filteredProducts}
                                        loading={state.loading}
                                        onSelectProduct={handleSelectProduct}
                                    />
                                </div>
                            </div>

                            {/* Pemilih Pelanggan */}
                            <CustomerSelector
                                customers={customers}
                                selectedCustomer={state.selectedCustomer}
                                onSelectCustomer={(value) =>
                                    dispatch(setSelectedCustomer(value))
                                }
                                cashierName={auth.user.name}
                            />
                        </div>

                        {/* Bagian Tengah - Keranjang Belanja */}
                        <div className="col-md-6">
                            <div className="card shadow mb-4">
                                <div className="card-body">
                                    <h5 className="card-title mb-4">
                                        Keranjang Belanja
                                    </h5>
                                    <Cart
                                        cartItems={state.cartItems}
                                        dispatch={dispatch}
                                        onDelete={handleDeleteProduct}
                                    />
                                    <hr className="my-4" />
                                    {/* Subtotal */}
                                    <div className="d-flex justify-content-between align-items-center">
                                        <label className="form-label mb-0">
                                            Sub Total
                                        </label>
                                        <h4 className="fw-bold mb-0">
                                            {formatRupiah(state.subTotal)}
                                        </h4>
                                    </div>
                                </div>
                            </div>

                            {/* Bagian Kanan - Pembayaran */}
                            <PaymentSection
                                discount={state.discount}
                                onDiscountChange={handleInputChange(
                                    setDiscount,
                                )}
                                subTotal={state.subTotal}
                                paymentMethod={state.paymentMethod}
                                onPaymentMethodChange={(e) =>
                                    dispatch(setPaymentMethod(e.target.value))
                                }
                                cash={state.cash}
                                onCashChange={handleInputChange(setCash)}
                                change={state.change}
                                onProcessPayment={handleProcessPayment}
                            />
                        </div>
                    </div>

                    {/* Modal untuk Pemilihan Produk */}
                    <ModalProduk
                        products={state.filteredProducts}
                        onSelect={handleSelectProduct}
                        showModal={state.showModal}
                        onClose={() => dispatch(setShowModal(false))}
                    />

                    {/* Komponen Receipt (untuk dicetak) */}
                    {transactionSnapshot && (
                        <div style={{ display: "none" }}>
                            <Receipt
                                ref={componentRef}
                                cartItems={transactionSnapshot.cartItems}
                                subTotal={transactionSnapshot.subTotal}
                                discount={transactionSnapshot.discount}
                                totalAmount={transactionSnapshot.totalAmount}
                                cash={transactionSnapshot.cash}
                                change={transactionSnapshot.change}
                            />
                        </div>
                    )}

                    {/* Modal Cetak Struk */}
                    {state.showReceiptModal && transactionSnapshot && (
                        <div
                            className="modal fade show"
                            style={{ display: "block" }}
                            tabIndex="-1"
                        >
                            <div className="modal-dialog modal-dialog-centered">
                                <div className="modal-content">
                                    <ReactToPrint
                                        content={() => componentRef.current}
                                        onAfterPrint={() => {
                                            dispatch(
                                                setShowReceiptModal(false),
                                            );
                                            dispatch(setCartItems([]));
                                            setTransactionSnapshot(null);
                                            router.get(
                                                "/admin/sales",
                                                {},
                                                { replace: true },
                                            );
                                        }}
                                        ref={reactToPrintRef}
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Modal Pembayaran Snap */}
                    <div
                        className="modal fade"
                        id="snapModal"
                        tabIndex="-1"
                        aria-labelledby="snapModalLabel"
                        aria-hidden="true"
                    >
                        <div className="modal-dialog modal-dialog-centered"></div>
                    </div>
                </div>
            </AdminLayout>
        </>
    );
};

export default Sales;
