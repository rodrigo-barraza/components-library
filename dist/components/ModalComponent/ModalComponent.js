import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useRef, useCallback } from "react";
import { createPortal } from "react-dom";
import styles from "./ModalComponent.module.css";
/**
 * ModalComponent — Structured modal dialog with header, body, and footer.
 *
 * Renders a full-screen overlay with a centered panel. Supports Escape
 * and click-outside dismissal, React Portal mounting, body scroll lock,
 * focus trapping with focus restoration, and four size presets.
 */
export default function ModalComponent({ title, onClose, footer, size = "md", variant = "default", className, id, children, }) {
    const overlayRef = useRef(null);
    const panelRef = useRef(null);
    const previousFocusRef = useRef(null);
    const modalId = id || "modal";
    const titleId = `${modalId}-title`;
    // ── Body scroll lock ──────────────────────────────────
    useEffect(() => {
        const previousOverflow = document.body.style.overflow;
        document.body.style.overflow = "hidden";
        return () => {
            document.body.style.overflow = previousOverflow;
        };
    }, []);
    // ── Focus management ──────────────────────────────────
    // Move focus into modal on mount, restore on unmount
    useEffect(() => {
        if (document.activeElement instanceof HTMLElement) {
            previousFocusRef.current = document.activeElement;
        }
        requestAnimationFrame(() => {
            const panel = panelRef.current;
            if (!panel)
                return;
            const focusable = panel.querySelector('button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])');
            if (focusable instanceof HTMLElement) {
                focusable.focus();
            }
            else {
                panel.focus();
            }
        });
        return () => {
            if (previousFocusRef.current instanceof HTMLElement) {
                previousFocusRef.current.focus();
            }
        };
    }, []);
    // ── Focus trapping ────────────────────────────────────
    // Tab cycles within modal boundaries
    useEffect(() => {
        const handleTab = (event) => {
            if (event.key !== "Tab")
                return;
            const panel = panelRef.current;
            if (!panel)
                return;
            const focusableEls = Array.from(panel.querySelectorAll('button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'));
            if (focusableEls.length === 0)
                return;
            const first = focusableEls[0];
            const last = focusableEls[focusableEls.length - 1];
            if (event.shiftKey) {
                if (document.activeElement === first) {
                    event.preventDefault();
                    last.focus();
                }
            }
            else {
                if (document.activeElement === last) {
                    event.preventDefault();
                    first.focus();
                }
            }
        };
        document.addEventListener("keydown", handleTab);
        return () => document.removeEventListener("keydown", handleTab);
    }, []);
    // Dismiss on Escape
    useEffect(() => {
        const handleKey = (event) => {
            if (event.key === "Escape") {
                event.stopPropagation();
                onClose();
            }
        };
        document.addEventListener("keydown", handleKey);
        return () => document.removeEventListener("keydown", handleKey);
    }, [onClose]);
    // Dismiss on overlay click (not panel children)
    const handleOverlayClick = useCallback((event) => {
        if (event.target === overlayRef.current)
            onClose();
    }, [onClose]);
    const overlayClass = [
        styles['overlay'],
        variant === "dark" ? styles['overlay-dark'] : "",
    ]
        .filter(Boolean)
        .join(" ");
    const panelClass = [
        styles['panel'],
        styles[`size-${size}`],
        className || "",
    ]
        .filter(Boolean)
        .join(" ");
    const content = (_jsx("div", { className: overlayClass, ref: overlayRef, onClick: handleOverlayClick, children: _jsxs("div", { ref: panelRef, className: panelClass, role: "dialog", "aria-modal": "true", "aria-labelledby": titleId, tabIndex: -1, children: [_jsxs("div", { className: styles['header'], children: [_jsx("span", { className: styles['title'], id: titleId, children: title }), _jsx("button", { className: styles['close-button'], onClick: onClose, title: "Close", "aria-label": "Close modal", children: _jsxs("svg", { width: "18", height: "18", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", children: [_jsx("line", { x1: "18", y1: "6", x2: "6", y2: "18" }), _jsx("line", { x1: "6", y1: "6", x2: "18", y2: "18" })] }) })] }), _jsx("div", { className: styles['body'], children: children }), footer && _jsx("div", { className: styles['footer'], children: footer })] }) }));
    if (typeof document !== "undefined") {
        return createPortal(content, document.body);
    }
    return content;
}
//# sourceMappingURL=ModalComponent.js.map