"use client";
import { jsx as _jsx } from "react/jsx-runtime";
import { variantClass } from "../../utils/moduleClasses.js";
import styles from "./SkeletonComponent.module.css";
// The shapes the CSS draws; every documented variant is one of them.
const SKELETON_SHAPES = {
    avatar: "circular",
    circle: "circular",
    image: "rectangular",
    card: "rectangular",
    button: "rectangular",
    rect: "rectangular",
};
export default function SkeletonComponent({ variant = "text", width, height, lines = 1, animate = true, className = "", id, }) {
    const resolveSize = (value) => value == null ? undefined : typeof value === "number" ? `${value}px` : value;
    const baseClass = [
        styles['skeleton'],
        variantClass(styles, variant, { aliases: SKELETON_SHAPES }),
        animate && styles['animate'],
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
    return (_jsx("div", { className: `skeleton-component ${styles['group']} ${className}`, style: { gap, flexDirection: direction }, role: "status", "aria-label": "Loading content", children: children }));
}
//# sourceMappingURL=SkeletonComponent.js.map