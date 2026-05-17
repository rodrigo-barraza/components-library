// @ts-nocheck
"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { ArrowLeft } from "lucide-react";
import styles from "./PageHeaderComponent.module.css";
/**
 * PageHeaderComponent — Unified page header with optional back navigation.
 *
 * Merges the prism-client (sticky, blur, back arrow) and portal (simple flex)
 * variants. The `sticky` prop controls whether the header sticks to the top.
 *
 * @param {string} title
 * @param {string} [subtitle]
 * @param {Function} [onBack] — If provided, renders a back arrow button
 * @param {React.ReactNode} [centerContent] — Absolutely centered content
 * @param {React.ReactNode} [children] — Right-side action slot
 * @param {boolean} [sticky=true] — Whether the header is sticky
 * @param {string} [className] — Additional class
 */
export default function PageHeaderComponent({ title, subtitle, onBack, centerContent, children, sticky = true, className, }) {
    return (_jsxs("div", { className: `${styles.pageHeader}${sticky ? ` ${styles.sticky}` : ""}${className ? ` ${className}` : ""}`, children: [_jsxs("div", { className: styles.headerLeft, children: [onBack && (_jsx("button", { className: styles.backBtn, onClick: onBack, title: "Go back", children: _jsx(ArrowLeft, { size: 16 }) })), _jsxs("div", { children: [_jsx("h1", { className: styles.pageTitle, children: title }), subtitle && _jsx("p", { className: styles.pageSubtitle, children: subtitle })] })] }), centerContent && _jsx("div", { className: styles.headerCenter, children: centerContent }), children && _jsx("div", { className: styles.headerActions, children: children })] }));
}
//# sourceMappingURL=PageHeaderComponent.js.map