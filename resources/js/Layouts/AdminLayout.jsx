import React, { useEffect } from "react";
import { usePage } from "@inertiajs/react";
import Sidebar from "../Components/Sidebar";
import NavbarBackend from "../Components/Navbar";
import Swal from "sweetalert2";

const AdminLayout = ({ children }) => {
    const { flash } = usePage().props;

    useEffect(() => {
        if (flash?.success) {
            Swal.fire({
                icon: "success",
                title: `Selamat Datang ${flash.user_name ?? "Guest"} 👋`,
                text: flash.success,
                timer: 2000,
                showConfirmButton: true,
            });
        }

        if (flash?.error) {
            Swal.fire({
                icon: "error",
                title: "Terjadi Kesalahan",
                text: flash.error,
                timer: 3000,
                showConfirmButton: true,
            });
        }
    }, [flash]);

    return (
        <>
            {/* Sidebar harus selalu ada agar burger bekerja */}
            <Sidebar />

            {/* Content wrapper */}
            <div className="admin-content d-flex flex-column min-vh-100 bg-light">
                <NavbarBackend />

                <main>
                    <div className="container-fluid py-4 px-3 px-md-4">
                        {children}
                    </div>
                </main>
            </div>

            {/* Inline responsive offset (tanpa file CSS) */}
            <style>
                {`
                    @media (min-width: 1200px) {
                        .admin-content {
                            padding-left: 260px;
                        }
                    }
                `}
            </style>
        </>
    );
};

export default AdminLayout;
