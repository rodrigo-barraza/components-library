// @ts-nocheck
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
 *
 * @param {"elevated"|"filled"|"outlined"} [variant="outlined"] — M3 card variant
 * @param {boolean}   [interactive=false]   — enables hover / press state layer
 * @param {boolean}   [draggable=false]     — adds dragged state elevation
 * @param {boolean}   [fullWidth=false]     — stretches to container width
 * @param {string}    [className]
 * @param {object}    [style]               — use --card-accent to theme
 * @param {React.ReactNode} children
 */
export default function CardComponent({ variant = "outlined", interactive = false, draggable: isDraggable = false, fullWidth = false, className, style, children, ...rest }) {
    const classes = [
        styles.card,
        styles[variant],
        interactive && styles.interactive,
        isDraggable && styles.draggable,
        fullWidth && styles.fullWidth,
        className,
    ]
        .filter(Boolean)
        .join(" ");
    return (_jsx("div", { className: classes, style: style, ...rest, children: children }));
}
/* ── Header ──────────────────────────────────────────────────────── */
function CardHeader({ icon: Icon, title, subtitle, children, className }) {
    return (_jsxs("div", { className: `${styles.header}${className ? ` ${className}` : ""}`, children: [Icon && _jsx(Icon, { size: 16, className: styles.icon }), title && _jsx("span", { className: styles.title, children: title }), subtitle && _jsx("span", { className: styles.subtitle, children: subtitle }), children] }));
}
/* ── Media ───────────────────────────────────────────────────────── */
/**
 * CardMedia — M3 media slot for full-bleed images, video, or illustrations.
 *
 * @param {string}   [src]        — image source URL
 * @param {string}   [alt]        — alt text for image
 * @param {number}   [height]     — fixed height in px (default: auto, aspect-ratio used if set)
 * @param {string}   [aspectRatio] — CSS aspect-ratio value, e.g. "16/9"
 * @param {"top"|"bottom"|"full"} [position="top"] — clip-path rounding position
 * @param {string}   [className]
 * @param {React.ReactNode} children — custom content (overrides src/alt)
 */
function CardMedia({ src, alt = "", height, aspectRatio, position = "top", className, children, }) {
    const mediaStyle = {};
    if (height)
        mediaStyle.height = typeof height === "number" ? `${height}px` : height;
    if (aspectRatio)
        mediaStyle.aspectRatio = aspectRatio;
    return (_jsx("div", { className: [styles.media, styles[`media-${position}`], className]
            .filter(Boolean)
            .join(" "), style: Object.keys(mediaStyle).length ? mediaStyle : undefined, children: children || (src ? (_jsx("img", { src: src, alt: alt, className: styles.mediaImage, loading: "lazy", draggable: false })) : null) }));
}
/* ── Body ────────────────────────────────────────────────────────── */
function CardBody({ children, className }) {
    return (_jsx("div", { className: `${styles.body}${className ? ` ${className}` : ""}`, children: children }));
}
/* ── Footer ──────────────────────────────────────────────────────── */
function CardFooter({ children, className }) {
    return (_jsx("div", { className: `${styles.footer}${className ? ` ${className}` : ""}`, children: children }));
}
/* ── Action Area ─────────────────────────────────────────────────── */
/**
 * CardActionArea — wraps card content to make it clickable / tappable.
 * Renders a full-surface interactive layer with ripple and state layer.
 *
 * @param {Function}  onClick
 * @param {string}    [href]   — if provided, renders an <a> instead
 * @param {string}    [className]
 * @param {React.ReactNode} children
 */
const CardActionArea = forwardRef(function CardActionArea({ onClick, href, className, children, ...rest }, ref) {
    const classes = [styles.actionArea, className].filter(Boolean).join(" ");
    if (href) {
        return (_jsxs("a", { ref: ref, href: href, className: classes, ...rest, children: [_jsx("span", { className: styles.stateLayer }), children] }));
    }
    return (_jsxs("button", { ref: ref, type: "button", onClick: onClick, className: classes, ...rest, children: [_jsx("span", { className: styles.stateLayer }), children] }));
});
/* ── Attach sub-components ───────────────────────────────────────── */
CardComponent.Header = CardHeader;
CardComponent.Media = CardMedia;
CardComponent.Body = CardBody;
CardComponent.Footer = CardFooter;
CardComponent.ActionArea = CardActionArea;
//# sourceMappingURL=CardComponent.js.map