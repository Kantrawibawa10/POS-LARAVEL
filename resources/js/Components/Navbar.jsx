import React from "react";
import { Link, router, usePage } from "@inertiajs/react";
import Swal from "sweetalert2";

const NavbarBackend = () => {
    const { auth } = usePage().props;

    const logoutHandler = (e) => {
        e.preventDefault();

        Swal.fire({
            title: "Yakin ingin logout?",
            text: "Sesi Anda akan berakhir.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#6c757d",
            confirmButtonText: "Ya, Logout",
            cancelButtonText: "Batal",
        }).then((result) => {
            if (result.isConfirmed) {
                Swal.fire({
                    title: "Logging out...",
                    allowOutsideClick: false,
                    didOpen: () => {
                        Swal.showLoading();
                    },
                });

                router.post(
                    "/logout",
                    {},
                    {
                        onSuccess: () => {
                            Swal.fire({
                                icon: "success",
                                title: "Berhasil Logout 👋",
                                text: "Sampai jumpa kembali!",
                                timer: 1500,
                                showConfirmButton: false,
                            });
                        },
                    },
                );
            }
        });
    };

    return (
        <nav className="navbar navbar-expand bg-white border-bottom px-4 py-2">
            <div className="container-fluid p-0">
                {/* LEFT */}
                <div className="d-flex align-items-center gap-3">
                    {/* Mobile sidebar toggle (optional future) */}
                    <button
                        className="btn btn-light d-xl-none"
                        type="button"
                        data-bs-toggle="offcanvas"
                        data-bs-target="#offcanvasSidebar"
                    >
                        <i className="bi bi-list"></i>
                    </button>

                    {/* <h6 className="mb-0 fw-bold text-dark">Dashboard</h6> */}
                </div>

                {/* RIGHT */}
                <ul className="navbar-nav ms-auto align-items-center gap-3">
                    {/* Profile */}
                    <li className="nav-item dropdown">
                        <a
                            className="nav-link dropdown-toggle d-flex align-items-center gap-2"
                            href="#"
                            data-bs-toggle="dropdown"
                        >
                            <img
                                src="https://ui-avatars.com/api/?name=User"
                                alt="avatar"
                                width="32"
                                height="32"
                                className="rounded-circle"
                            />
                            <span className="fw-semibold">
                                {auth.user.name}
                            </span>
                        </a>

                        <ul className="dropdown-menu dropdown-menu-end shadow">
                            <li className="px-3 py-2">
                                <div className="fw-bold">{auth.user.name}</div>
                                <div className="small text-muted">
                                    {auth.user.email}
                                </div>
                            </li>
                            <li>
                                <hr className="dropdown-divider" />
                            </li>
                            {/* <li>
                                <Link className="dropdown-item" href="/profile">
                                    <i className="bi bi-person me-2"></i>
                                    Profile
                                </Link>
                            </li> */}
                            <li>
                                <button
                                    className="dropdown-item text-danger"
                                    onClick={logoutHandler}
                                >
                                    <i className="bi bi-box-arrow-right me-2"></i>
                                    Logout
                                </button>
                            </li>
                        </ul>
                    </li>
                </ul>
            </div>
        </nav>
    );
};

export default NavbarBackend;
