import { memo } from "react";
import { router } from "@inertiajs/react";

const Pagination = ({ links = [] }) => (
    <nav className="d-flex justify-content-center">
        <ul className="pagination mb-0">
            {links.map((l, i) => (
                <li
                    key={i}
                    className={`page-item ${l.active ? "active" : ""} ${!l.url ? "disabled" : ""}`}
                >
                    <button
                        className="page-link"
                        disabled={!l.url}
                        onClick={() =>
                            l.url &&
                            router.visit(l.url, {
                                preserveScroll: true,
                                preserveState: true,
                                replace: true,
                            })
                        }
                        dangerouslySetInnerHTML={{ __html: l.label }}
                    />
                </li>
            ))}
        </ul>
    </nav>
);

export default memo(Pagination);