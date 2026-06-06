"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import styles from "./AvatarComponent.module.css";
/**
 * AvatarComponent — M3-inspired avatar with image, initials, or icon fallback.
 *
 * Supports five sizes and an optional online/offline/busy/away status dot.
 * Compound sub-component `AvatarComponent.Group` stacks avatars with
 * overlapping borders and a "+N" overflow indicator.
 */
export default function AvatarComponent({ src, alt = "", name, icon: Icon, size = "md", status, className, style, ...rest }) {
    const [imgError, setImgError] = useState(false);
    const initials = name
        ? name
            .split(" ")
            .filter(Boolean)
            .map((word) => word[0])
            .slice(0, 2)
            .join("")
            .toUpperCase()
        : null;
    const showImage = src && !imgError;
    const iconSize = size === "xs" ? 12 : size === "sm" ? 14 : size === "lg" ? 22 : size === "xl" ? 28 : 18;
    const classes = [styles.avatar, styles[size], className].filter(Boolean).join(" ");
    return (_jsxs("div", { className: classes, style: style, ...rest, children: [showImage ? (_jsx("img", { src: src, alt: alt || name || "", className: styles.image, draggable: false, onError: () => setImgError(true) })) : initials ? (_jsx("span", { className: styles.initials, children: initials })) : Icon ? (_jsx(Icon, { size: iconSize, className: styles.icon })) : (_jsx("span", { className: styles.initials, children: "?" })), status && (_jsx("span", { className: `${styles.status} ${styles[`status-${status}`]}`, "aria-label": status }))] }));
}
/**
 * AvatarComponent.Group — stacks avatars with overlapping layout.
 */
function AvatarGroup({ max = 5, size = "md", className, children }) {
    const items = Array.isArray(children) ? children : children ? [children] : [];
    const visible = items.slice(0, max);
    const overflow = items.length - max;
    return (_jsxs("div", { className: `${styles.group} ${className || ""}`, children: [visible.map((child, i) => (_jsx("div", { className: styles['group-item'], style: { zIndex: visible.length - i }, children: child }, i))), overflow > 0 && (_jsx("div", { className: `${styles.avatar} ${styles[size]} ${styles.overflow}`, children: _jsxs("span", { className: styles.initials, children: ["+", overflow] }) }))] }));
}
AvatarComponent.Group = AvatarGroup;
//# sourceMappingURL=AvatarComponent.js.map