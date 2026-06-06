"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { forwardRef } from "react";
import styles from "./CardComponent.module.css";
/**
 * CardComponent — M3-inspired compound card with elevated / filled / outlined variants.
 *
 * Material Design 3 defines three card types:
 *   • elevated  — surface-tint + shadow elevation (default)
 *   • filled   — highest surface container color, no outline
 *   • outlined — thin outline border, no elevation
 *
 * Compound sub-components:
 *   CardComponent.Header      — top bar with icon, title, subtitle, trailing actions
 *   CardComponent.Media       — full-bleed media slot (images, video, illustration)
 *   CardComponent.Body        — main content area with padding
 *   CardComponent.Footer      — bottom bar (e.g. action buttons)
 *   CardComponent.ActionArea  — makes the card (or a region) clickable with ripple
 */
export default function CardComponent({ variant = "outlined", interactive = false, draggable: isDraggable = false, fullWidth = false, className, style, children, ...rest }) {
    const classes = [
        styles['card'],
        styles[variant],
        interactive && styles['interactive'],
        isDraggable && styles['draggable'],
        fullWidth && styles['full-width'],
        className,
    ]
        .filter(Boolean)
        .join(" ");
    return (_jsx("div", { className: classes, style: style, ...rest, children: children }));
}
/* ── Header ──────────────────────────────────────────────────────── */
function CardHeader({ icon: Icon, title, subtitle, children, className }) {
    return (_jsxs("div", { className: `${styles['header']}${className ? ` ${className}` : ""}`, children: [Icon && _jsx(Icon, { size: 16, className: styles['icon'] }), title && _jsx("span", { className: styles['title'], children: title }), subtitle && _jsx("span", { className: styles['subtitle'], children: subtitle }), children] }));
}
/* ── Media ───────────────────────────────────────────────────────── */
/**
 * CardMedia — M3 media slot for full-bleed images, video, or illustrations.
 */
function CardMedia({ src, alt = "", height, aspectRatio, position = "top", className, children, }) {
    const mediaStyle = {};
    if (height)
        mediaStyle.height = typeof height === "number" ? `${height}px` : height;
    if (aspectRatio)
        mediaStyle.aspectRatio = aspectRatio;
    return (_jsx("div", { className: [styles['media'], styles[`media-${position}`], className]
            .filter(Boolean)
            .join(" "), style: Object.keys(mediaStyle).length ? mediaStyle : undefined, children: children || (src ? (_jsx("img", { src: src, alt: alt, className: styles['media-image'], loading: "lazy", draggable: false })) : null) }));
}
/* ── Body ────────────────────────────────────────────────────────── */
function CardBody({ children, className }) {
    return (_jsx("div", { className: `${styles['body']}${className ? ` ${className}` : ""}`, children: children }));
}
/* ── Footer ──────────────────────────────────────────────────────── */
function CardFooter({ children, className }) {
    return (_jsx("div", { className: `${styles['footer']}${className ? ` ${className}` : ""}`, children: children }));
}
/* ── Action Area ─────────────────────────────────────────────────── */
/**
 * CardActionArea — wraps card content to make it clickable / tappable.
 * Renders a full-surface interactive layer with ripple and state layer.
 */
const CardActionArea = forwardRef(function CardActionArea({ onClick, href, className, children, ...rest }, ref) {
    const classes = [styles['action-area'], className].filter(Boolean).join(" ");
    if (href) {
        return (_jsxs("a", { ref: ref, href: href, className: classes, ...rest, children: [_jsx("span", { className: styles['state-layer'] }), children] }));
    }
    return (_jsxs("button", { ref: ref, type: "button", onClick: onClick, className: classes, ...rest, children: [_jsx("span", { className: styles['state-layer'] }), children] }));
});
/* ── Attach sub-components ───────────────────────────────────────── */
CardComponent.Header = CardHeader;
CardComponent.Media = CardMedia;
CardComponent.Body = CardBody;
CardComponent.Footer = CardFooter;
CardComponent.ActionArea = CardActionArea;
//# sourceMappingURL=CardComponent.js.map