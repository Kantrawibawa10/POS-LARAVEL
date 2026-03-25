import React from "react";
import { Link, usePage } from "@inertiajs/react";
import NavItem from "../Components/NavItem";
import hasAnyPermission from "../utils/hasAnyPermission";

const sidebarSections = [
    {
        title: "Dashboard",
        items: [
            {
                href: "/admin/dashboard",
                icon: "bi-house-door",
                label: "Dashboard",
                permission: "dashboard.index",
            },
        ],
    },
    {
        title: "Management User",
        items: [
            {
                href: "/admin/roles",
                icon: "bi-shield-lock",
                label: "Roles",
                permission: "roles.index",
            },
            {
                href: "/admin/users",
                icon: "bi-person",
                label: "Users",
                permission: "users.index",
            },
        ],
    },
    {
        title: "Master Data",
        items: [
            {
                href: "/admin/suppliers",
                icon: "bi-truck",
                label: "Suppliers",
                permission: "suppliers.index",
            },
            {
                href: "/admin/customers",
                icon: "bi-people",
                label: "Customers",
                permission: "customers.index",
            },
            {
                href: "/admin/categories",
                icon: "bi-list-ul",
                label: "Categories",
                permission: "categories.index",
            },
            {
                href: "/admin/units",
                icon: "bi-rulers",
                label: "Units",
                permission: "units.index",
            },
            {
                href: "/admin/products",
                icon: "bi-box",
                label: "Products",
                permission: "products.index",
            },
            {
                href: "/admin/stocks",
                icon: "bi-box-seam",
                label: "Stock In",
                permission: "stocks.index",
            },
        ],
    },
    {
        title: "Transactions",
        items: [
            {
                href: "/admin/sales",
                icon: "bi-cash",
                label: "Sales",
                permission: "transactions.index",
            },
        ],
    },
    {
        title: "Reports",
        items: [
            {
                href: "/admin/report",
                icon: "bi-clipboard-data",
                label: "Reports",
                permission: "reports.index",
            },
            {
                href: "/admin/stock-opnames",
                icon: "bi-journal-check",
                label: "Stock Opnames",
                permission: "stock-opnames.index",
            },
            {
                href: "/admin/stock-cards",
                icon: "bi-card-checklist",
                label: "Kartu Stok",
                permission: "stock-cards.index",
            },
        ],
    },
];

const SidebarContent = () => {
    return (
        <ul className="nav nav-pills flex-column gap-1">
            {sidebarSections.map((section, index) => {
                // Filter item berdasarkan permission
                const allowedItems = section.items.filter((item) =>
                    hasAnyPermission([item.permission])
                );

                // Kalau tidak ada item yang boleh diakses → jangan render section
                if (allowedItems.length === 0) return null;

                return (
                    <div key={index}>
                        <li className="text-muted small mt-4 mb-2">
                            {section.title}
                        </li>

                        {allowedItems.map((item, i) => (
                            <NavItem className="mb-2"
                                key={i}
                                href={item.href}
                                icon={item.icon}
                                label={item.label}
                            />
                        ))}
                    </div>
                );
            })}
        </ul>
    );
};

const Sidebar = () => {
    const { auth } = usePage().props;
    if (!auth) return null;

    return (
        <>
            {/* ===== DESKTOP SIDEBAR ===== */}
            <aside
                className="d-none d-xl-flex bg-white border-end vh-100 flex-column position-fixed pb-5"
                style={{ width: 260, top: 0, left: 0, zIndex: 1030 }}
            >
                <div className="px-3 py-3 border-bottom d-flex align-items-center gap-2">
                    <div
                        className="rounded-3 d-flex align-items-center justify-content-center text-white fw-bold"
                        style={{
                            width: 32,
                            height: 32,
                            background:
                                "linear-gradient(135deg, #0d6efd, #6610f2)",
                        }}
                    >
                        <i className="bi bi-shop fs-5"></i>
                    </div>

                    <div className="fw-bold fs-5">EasyPOS</div>
                </div>

                <div className="overflow-auto px-3">
                    <SidebarContent />
                </div>
            </aside>

            {/* ===== MOBILE OFFCANVAS ===== */}
            <div
                className="offcanvas offcanvas-start d-xl-none"
                tabIndex="-1"
                id="offcanvasSidebar"
            >
                <div className="offcanvas-header">
                    <h5 className="offcanvas-title fw-bold">EasyPOS</h5>
                    <button
                        type="button"
                        className="btn-close"
                        data-bs-dismiss="offcanvas"
                    />
                </div>
                <div className="offcanvas-body px-3">
                    <SidebarContent />
                </div>
            </div>
        </>
    );
};

export default Sidebar;
