import { usePage } from "@inertiajs/react";

export default function hasAnyPermission(requiredPermissions = []) {
    const { props } = usePage();

    // ⛔ Jika auth / permissions belum ada, JANGAN MATIKAN SIDEBAR
    if (
        !props.auth ||
        !Array.isArray(props.auth.permissions)
    ) {
        return true; // ✅ fallback: tampilkan menu
    }

    return requiredPermissions.some(permission =>
        props.auth.permissions.includes(permission)
    );
}
