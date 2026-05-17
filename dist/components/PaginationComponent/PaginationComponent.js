// @ts-nocheck
"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import styles from "./PaginationComponent.module.css";
export default function PaginationComponent({ page, totalPages, totalItems, onPageChange, limit, }) {
    if (totalPages <= 1)
        return null;
    const renderInfo = () => {
        if (limit) {
            const start = (page - 1) * limit + 1;
            const end = Math.min(page * limit, totalItems);
            return `Showing ${start}–${end} of ${totalItems.toLocaleString()}`;
        }
        return `Page ${page} of ${totalPages} · ${totalItems} total`;
    };
    return (_jsxs("div", { className: styles.pagination, children: [_jsx("span", { className: styles.pageInfo, children: renderInfo() }), _jsxs("div", { className: styles.pageButtons, children: [_jsx("button", { className: styles.pageBtn, onClick: () => onPageChange(Math.max(1, page - 1)), disabled: page <= 1, children: "Previous" }), _jsx("button", { className: styles.pageBtn, onClick: () => onPageChange(Math.min(totalPages, page + 1)), disabled: page >= totalPages, children: "Next" })] })] }));
}
//# sourceMappingURL=PaginationComponent.js.map