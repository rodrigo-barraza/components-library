"use client";
import { jsx as _jsx } from "react/jsx-runtime";
import styles from "./SkeletonComponent.module.css";
export default function SkeletonComponent({ variant = "text", width, height, lines = 1, animate = true, className = "", id, }) {
    const resolveSize = (value) => value == null ? undefined : typeof value === "number" ? `${value}px` : value;
    const baseClass = [
        styles.skeleton,
        styles[variant],
        animate && styles.animate,
        className,
    ]
        .filter(Boolean)
        .join(" ");
    // Text variant: render multiple lines
    if (variant === "text" && lines > 1) {
        return (_jsx("div", { className: styles['text-group'], id: id, children: Array.from({ length: lines }, (_, i) => {
                // Last line is shorter for a natural look
                const isLast = i === lines - 1;
                const lineWidth = isLast ? "75%" : width || "100%";
                return (_jsx("div", { className: baseClass, style: {
                        width: resolveSize(lineWidth),
                        height: resolveSize(height),
                    }, "aria-hidden": "true" }, i));
            }) }));
    }
    return (_jsx("div", { id: id, className: baseClass, style: {
            width: resolveSize(width),
            height: resolveSize(height),
        }, role: "status", "aria-label": "Loading", "aria-hidden": "true" }));
}
export function SkeletonGroup({ gap = "12px", direction = "column", className = "", children, }) {
    return (_jsx("div", { className: `${styles.group} ${className}`, style: { gap, flexDirection: direction }, role: "status", "aria-label": "Loading content", children: children }));
}
//# sourceMappingURL=SkeletonComponent.js.map