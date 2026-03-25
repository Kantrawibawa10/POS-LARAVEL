import React from "react";
import { usePage, Head } from "@inertiajs/react";
import AdminLayout from "../../../Layouts/AdminLayout";
import Sidebar from "../../../Components/Sidebar";
import hasAnyPermission from "../../../utils/hasAnyPermission";
import {
    PieChart,
    Pie,
    Cell,
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    BarChart,
    Bar,
    ResponsiveContainer,
} from "recharts";

import { formatRupiah } from "../../../utils/rupiah";

/* ================= CONFIG ================= */

const CARD_COLORS = ["#a855f7", "#6366f1", "#06b6d4", "#84cc16", "#ef4444"];
const COLORS = [
    "#22c55e",
    "#3b82f6",
    "#f97316",
    "#a855f7",
    "#ef4444",
    "#14b8a6",
];

const TITLES = {
    totalSales: "Total Sales",
    totalTransactions: "Total Transactions",
    totalCustomers: "Total Customers",
    totalProducts: "Total Products in Stock",
    totalSuppliers: "Total Active Suppliers",
};

const ICONS = {
    totalSales: "bi bi-currency-dollar",
    totalTransactions: "bi bi-receipt",
    totalCustomers: "bi bi-people",
    totalProducts: "bi bi-box",
    totalSuppliers: "bi bi-truck",
};

const STAT_PERMISSION_MAP = {
    totalSales: "dashboard.view_sales",
    totalTransactions: "dashboard.view_transactions",
    totalCustomers: "dashboard.view_customers",
    totalProducts: "dashboard.view_products",
    totalSuppliers: "dashboard.view_supplier",
};

const isEmpty = (data) =>
    !data ||
    (Array.isArray(data) ? data.length === 0 : Object.keys(data).length === 0);

/* ================= COMPONENTS ================= */

const StatCard = ({ color, icon, title, value }) => (
    <div className="col-6 col-md-3 col-lg-3">
        <div className="bg-white rounded-4 shadow-sm p-4 h-100">
            <div
                className="rounded-3 d-flex align-items-center justify-content-center mb-3"
                style={{
                    width: 48,
                    height: 48,
                    backgroundColor: color,
                    color: "#fff",
                }}
            >
                <i className={icon} style={{ fontSize: 20 }} />
            </div>

            <p className="text-muted small mb-1">{title}</p>
            <h4 className="fw-bold mb-1">{value}</h4>
        </div>
    </div>
);

const ChartCard = ({ title, children, emptyMessage, action }) => (
    <div className="bg-white rounded-4 shadow-sm p-4 h-100">
        <div className="d-flex justify-content-between align-items-center mb-3">
            <h5 className="fw-semibold mb-0">{title}</h5>
            {action}
        </div>

        {children || (
            <div className="text-center text-muted py-5">{emptyMessage}</div>
        )}
    </div>
);

/* ================= PAGE ================= */

export default function Dashboard() {
    const { stats, transactionData, salesData, productsData, categoryData } =
        usePage().props;

    const transactionStatusData = Object.entries(transactionData || {}).map(
        ([name, value]) => ({ name, value }),
    );

    const { showPwaModal } = usePage().props;

    return (
        <>
            <Head>
                <title>Dashboard - EasyPOS</title>
            </Head>

            <AdminLayout>
                <div className="container-fluid py-4">
                    {/* ================= STAT CARDS ================= */}
                    <div className="row g-4">
                        {Object.keys(stats).map((key, i) => {
                            const permission = STAT_PERMISSION_MAP[key];
                            if (!permission) return null;

                            return (
                                hasAnyPermission([permission]) && (
                                    <StatCard
                                        key={key}
                                        color={
                                            CARD_COLORS[i % CARD_COLORS.length]
                                        }
                                        icon={ICONS[key] || "bi bi-plus-circle"}
                                        title={TITLES[key] || key}
                                        value={
                                            key === "totalSales"
                                                ? formatRupiah(stats[key])
                                                : stats[key]
                                        }
                                    />
                                )
                            );
                        })}
                    </div>

                    {/* ================= EMPTY TRANSACTION ================= */}
                    {isEmpty(transactionData) && (
                        <div className="alert alert-warning my-4">
                            Data transaksi kosong. Tambahkan data terlebih
                            dahulu.
                        </div>
                    )}

                    {/* ================= CHART ROW 1 ================= */}
                    <div className="row g-4 my-4">
                        {hasAnyPermission(["dashboard.view_transactions"]) && (
                            <div className="col-md-6">
                                <ChartCard
                                    title="Status Transaksi"
                                    emptyMessage="Data transaksi tidak tersedia"
                                >
                                    {!isEmpty(transactionStatusData) && (
                                        <ResponsiveContainer
                                            width="100%"
                                            height={300}
                                        >
                                            <PieChart>
                                                <Pie
                                                    data={transactionStatusData}
                                                    dataKey="value"
                                                    nameKey="name"
                                                    innerRadius={50}
                                                    outerRadius={90}
                                                    label
                                                >
                                                    {transactionStatusData.map(
                                                        (_, idx) => (
                                                            <Cell
                                                                key={idx}
                                                                fill={
                                                                    COLORS[
                                                                        idx %
                                                                            COLORS.length
                                                                    ]
                                                                }
                                                            />
                                                        ),
                                                    )}
                                                </Pie>
                                                <Tooltip />
                                            </PieChart>
                                        </ResponsiveContainer>
                                    )}
                                </ChartCard>
                            </div>
                        )}

                        {hasAnyPermission(["dashboard.view_sales"]) && (
                            <div className="col-md-6">
                                <ChartCard
                                    title="Penjualan dari Waktu ke Waktu"
                                    emptyMessage="Data penjualan tidak tersedia"
                                    action={
                                        <select className="form-select form-select-sm w-auto">
                                            <option>6 Months</option>
                                        </select>
                                    }
                                >
                                    {!isEmpty(salesData) && (
                                        <ResponsiveContainer
                                            width="100%"
                                            height={300}
                                        >
                                            <LineChart data={salesData}>
                                                <CartesianGrid
                                                    strokeDasharray="3 3"
                                                    vertical={false}
                                                />
                                                <XAxis dataKey="date" />
                                                <YAxis
                                                    tickFormatter={(v) =>
                                                        formatRupiah(v)
                                                    }
                                                />
                                                <Tooltip
                                                    formatter={(v) =>
                                                        formatRupiah(v)
                                                    }
                                                />
                                                <Line
                                                    type="monotone"
                                                    dataKey="total"
                                                    stroke="#6366f1"
                                                    strokeWidth={3}
                                                    dot={false}
                                                />
                                            </LineChart>
                                        </ResponsiveContainer>
                                    )}
                                </ChartCard>
                            </div>
                        )}
                    </div>

                    {/* ================= CHART ROW 2 ================= */}
                    <div className="row g-4 my-4">
                        {hasAnyPermission(["dashboard.view_products"]) && (
                            <div className="col-md-6">
                                <ChartCard
                                    title="Produk Terlaris"
                                    emptyMessage="Data produk terlaris tidak tersedia"
                                >
                                    {!isEmpty(productsData) && (
                                        <ResponsiveContainer
                                            width="100%"
                                            height={300}
                                        >
                                            <BarChart data={productsData}>
                                                <CartesianGrid
                                                    strokeDasharray="3 3"
                                                    vertical={false}
                                                />
                                                <XAxis dataKey="name" />
                                                <YAxis />
                                                <Tooltip />
                                                <Bar
                                                    dataKey="total_quantity"
                                                    fill="#f97316"
                                                    radius={[8, 8, 0, 0]}
                                                />
                                            </BarChart>
                                        </ResponsiveContainer>
                                    )}
                                </ChartCard>
                            </div>
                        )}

                        {hasAnyPermission(["dashboard.view_products"]) && (
                            <div className="col-md-6">
                                <ChartCard
                                    title="Stok Produk per Kategori"
                                    emptyMessage="Data kategori tidak tersedia"
                                >
                                    {!isEmpty(categoryData) && (
                                        <ResponsiveContainer
                                            width="100%"
                                            height={300}
                                        >
                                            <BarChart data={categoryData}>
                                                <CartesianGrid
                                                    strokeDasharray="3 3"
                                                    vertical={false}
                                                />
                                                <XAxis dataKey="category" />
                                                <YAxis />
                                                <Tooltip />
                                                <Bar
                                                    dataKey="total_stock"
                                                    fill="#22c55e"
                                                    radius={[8, 8, 0, 0]}
                                                />
                                            </BarChart>
                                        </ResponsiveContainer>
                                    )}
                                </ChartCard>
                            </div>
                        )}
                    </div>
                </div>
            </AdminLayout>
        </>
    );
}
