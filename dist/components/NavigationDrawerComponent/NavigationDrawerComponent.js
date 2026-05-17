// @ts-nocheck
"use client";
import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useEffect, useRef, useState } from "react";
import styles from "./NavigationDrawerComponent.module.css";
/**
 * NavigationDrawerComponent — M3-inspired navigation drawer.
 *
 * Material Design 3 defines two drawer types:
 *   • standard — persistent, in-flow side panel
 *   • modal   — temporary overlay with scrim backdrop
 *
 * Compound sub-components:
 *   NavigationDrawerComponent.Item           — navigable destination
 *   NavigationDrawerComponent.SectionHeader  — group heading text
 *   NavigationDrawerComponent.Divider        — horizontal rule
 *   NavigationDrawerComponent.Footer         — bottom-pinned slot
 *
 * Accessibility (WAI-ARIA):
 *   • role="navigation" with aria-label
 *   • Modal: focus trapping, Escape to close, scrim click to close
 *   • Keyboard: Tab/Shift+Tab through items, Enter/Space to activate
 *
 * @see https://m3.material.io/components/navigation-drawer/overview
 *
 * @param {"standard"|"modal"} [variant="standard"] — drawer type
 * @param {"start"|"end"}      [anchor="start"]     — side the drawer appears on
 * @param {boolean}   [open=true]       — controls drawer visibility
 * @param {Function}  [onClose]         — called when user dismisses modal
 * @param {string}    [headline]        — optional title text at the top
 * @param {string}    [ariaLabel]       — accessible label for <nav>
 * @param {string}    [className]
 * @param {object}    [style]
 * @param {React.ReactNode} children
 */
export default function NavigationDrawerComponent({ variant = "standard", anchor = "start", open = true, onClose, headline, ariaLabel = "Navigation drawer", className, style, children, ...rest }) {
    const drawerRef = useRef(null);
    const previousFocusRef = useRef(null);
    const [ready, setReady] = useState(false);
    // Suppress transitions on first render to avoid FOUC
    useEffect(() => {
        requestAnimationFrame(() => {
            requestAnimationFrame(() => setReady(true));
        });
    }, []);
    // ── Modal: focus trap + Escape key ──────────────────────────────
    useEffect(() => {
        if (variant !== "modal" || !open)
            return;
        // Remember focus for restoration
        previousFocusRef.current = document.activeElement;
        // Focus the first focusable element inside drawer
        const timer = setTimeout(() => {
            const focusable = drawerRef.current?.querySelectorAll('a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])');
            focusable?.[0]?.focus();
        }, 50);
        const handleKeyDown = (e) => {
            if (e.key === "Escape") {
                e.stopPropagation();
                onClose?.();
                return;
            }
            // Focus trap
            if (e.key === "Tab" && drawerRef.current) {
                const focusable = Array.from(drawerRef.current.querySelectorAll('a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'));
                if (focusable.length === 0)
                    return;
                const first = focusable[0];
                const last = focusable[focusable.length - 1];
                if (e.shiftKey && document.activeElement === first) {
                    e.preventDefault();
                    last.focus();
                }
                else if (!e.shiftKey && document.activeElement === last) {
                    e.preventDefault();
                    first.focus();
                }
            }
        };
        document.addEventListener("keydown", handleKeyDown);
        return () => {
            clearTimeout(timer);
            document.removeEventListener("keydown", handleKeyDown);
            // Restore focus on close
            previousFocusRef.current?.focus?.();
        };
    }, [variant, open, onClose]);
    // ── Modal: prevent body scroll ──────────────────────────────────
    useEffect(() => {
        if (variant !== "modal")
            return;
        if (open) {
            document.body.style.overflow = "hidden";
        }
        return () => {
            document.body.style.overflow = "";
        };
    }, [variant, open]);
    const isModal = variant === "modal";
    const isEnd = anchor === "end";
    const drawerClasses = [
        styles.drawer,
        styles[variant],
        isEnd && styles.anchorEnd,
        isModal && open && styles.open,
        !isModal && !open && styles.closed,
        !ready && styles.noTransition,
        className,
    ]
        .filter(Boolean)
        .join(" ");
    const drawerEl = (_jsxs("nav", { ref: drawerRef, role: "navigation", "aria-label": ariaLabel, "aria-hidden": !open, className: drawerClasses, style: style, ...rest, children: [headline && _jsx("div", { className: styles.headline, children: headline }), _jsx("div", { className: styles.content, children: children })] }));
    // ── Modal variant: wrap with scrim ──────────────────────────────
    if (isModal) {
        return (_jsxs(_Fragment, { children: [_jsx("div", { className: `${styles.scrim}${open ? ` ${styles.open}` : ""}`, onClick: onClose, "aria-hidden": "true" }), drawerEl] }));
    }
    // ── Standard variant: inline ────────────────────────────────────
    return _jsx("div", { className: styles.wrapper, children: drawerEl });
}
/* ── Item ─────────────────────────────────────────────────────────── */
/**
 * DrawerItem — individual navigation destination.
 *
 * M3 spec: 56dp height, full-width rounded-pill shape,
 *          leading icon, label, optional trailing badge.
 *
 * @param {React.ComponentType} [icon]   — leading icon (Lucide etc.)
 * @param {string}    label              — destination label text
 * @param {string}    [badge]            — trailing badge text (e.g. "24")
 * @param {boolean}   [active=false]     — active/selected state
 * @param {boolean}   [disabled=false]
 * @param {string}    [href]             — renders as <a> if provided
 * @param {Function}  [onClick]
 * @param {React.ComponentType} [LinkComponent] — custom router Link
 * @param {string}    [className]
 * @param {React.ReactNode} children     — overrides icon+label rendering
 */
function DrawerItem({ icon: Icon, label, badge, active = false, disabled = false, href, onClick, LinkComponent, className, children, ...rest }) {
    const classes = [
        styles.item,
        active && styles.active,
        disabled && styles.disabled,
        className,
    ]
        .filter(Boolean)
        .join(" ");
    const content = children || (_jsxs(_Fragment, { children: [Icon && _jsx(Icon, { size: 24, className: styles.itemIcon }), _jsx("span", { className: styles.itemLabel, children: label }), badge != null && _jsx("span", { className: styles.itemBadge, children: badge })] }));
    const sharedProps = {
        className: classes,
        "aria-current": active ? "page" : undefined,
        "aria-disabled": disabled || undefined,
        ...rest,
    };
    // Render with custom Link component
    if (LinkComponent && href) {
        return (_jsxs(LinkComponent, { href: href, onClick: onClick, ...sharedProps, children: [_jsx("span", { className: styles.stateLayer }), content] }));
    }
    // Render as native anchor
    if (href) {
        return (_jsxs("a", { href: href, onClick: onClick, ...sharedProps, children: [_jsx("span", { className: styles.stateLayer }), content] }));
    }
    // Render as button
    return (_jsxs("button", { type: "button", onClick: onClick, disabled: disabled, ...sharedProps, children: [_jsx("span", { className: styles.stateLayer }), content] }));
}
/* ── Section Header ──────────────────────────────────────────────── */
/**
 * DrawerSectionHeader — labelled group heading.
 *
 * M3 spec: title-small typography, 56dp total height with padding.
 *
 * @param {string}    [className]
 * @param {React.ReactNode} children
 */
function DrawerSectionHeader({ className, children }) {
    return (_jsx("div", { className: `${styles.sectionHeader}${className ? ` ${className}` : ""}`, role: "heading", "aria-level": 2, children: children }));
}
/* ── Divider ─────────────────────────────────────────────────────── */
/**
 * DrawerDivider — horizontal visual separator between sections.
 *
 * @param {string} [className]
 */
function DrawerDivider({ className }) {
    return (_jsx("div", { role: "separator", className: `${styles.divider}${className ? ` ${className}` : ""}` }));
}
/* ── Footer ──────────────────────────────────────────────────────── */
/**
 * DrawerFooter — bottom-pinned slot for actions or secondary content.
 *
 * @param {string}    [className]
 * @param {React.ReactNode} children
 */
function DrawerFooter({ className, children }) {
    return (_jsx("div", { className: `${styles.footer}${className ? ` ${className}` : ""}`, children: children }));
}
/* ── Attach sub-components ───────────────────────────────────────── */
NavigationDrawerComponent.Item = DrawerItem;
NavigationDrawerComponent.SectionHeader = DrawerSectionHeader;
NavigationDrawerComponent.Divider = DrawerDivider;
NavigationDrawerComponent.Footer = DrawerFooter;
//# sourceMappingURL=NavigationDrawerComponent.js.map