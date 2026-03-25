import React from "react";
import { Link, usePage } from "@inertiajs/react";

const NavItem = ({ href, icon, label }) => {
    const { url } = usePage();
    const active = url.startsWith(href);

    return (
        <li className="nav-item">
            <Link
                href={href}
                className={`nav-link d-flex align-items-center gap-2 ${
                    active
                        ? "active fw-semibold"
                        : "text-dark"
                }`}
            >
                <i className={`bi ${icon}`}></i>
                <span>{label}</span>
            </Link>
        </li>
    );
};

export default NavItem;
