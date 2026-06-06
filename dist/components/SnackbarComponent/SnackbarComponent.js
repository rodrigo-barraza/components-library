"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import styles from "./SnackbarComponent.module.css";
/* ──────────────────────────────────────────────────────────
   M3 Snackbar — duration defaults
   Spec: 4–10 seconds. Default = 6 seconds.
   ────────────────────────────────────────────────────────── */
const MIN_DURATION = 4000;
const MAX_DURATION = 10000;
const DEFAULT_DURATION = 6000;
const EXIT_ANIMATION_MS = 200;
/**
 * Clamp duration to M3's 4–10 second range.
 */
function clampDuration(ms) {
    if (ms <= 0)
        return 0; // 0 = indefinite
    return Math.max(MIN_DURATION, Math.min(MAX_DURATION, ms));
}
export function useSnackbar() {
    const [current, setCurrent] = useState(null);
    const queueRef = useRef([]);
    const timerRef = useRef(null);
    const idRef = useRef(0);
    // Process next item in queue
    const processQueue = useCallback(() => {
        if (queueRef.current.length === 0) {
            setCurrent(null);
            return;
        }
        const next = queueRef.current.shift();
        setCurrent(next || null);
    }, []);
    // Dismiss current snackbar
    const dismiss = useCallback(() => {
        if (timerRef.current) {
            clearTimeout(timerRef.current);
        }
        setCurrent(null);
        // Small delay to allow exit animation before next
        setTimeout(processQueue, EXIT_ANIMATION_MS + 50);
    }, [processQueue]);
    // Show a new snackbar
    const showSnackbar = useCallback((message, options = {}) => {
        const { actionLabel, onAction, showClose = false, duration = DEFAULT_DURATION, } = options;
        const id = ++idRef.current;
        const entry = {
            id,
            message,
            actionLabel,
            onAction,
            showClose,
            duration: clampDuration(duration),
        };
        if (current) {
            // M3: dismiss current, enqueue new one
            queueRef.current.push(entry);
            dismiss();
        }
        else {
            setCurrent(entry);
        }
        return id;
    }, [current, dismiss]);
    // Auto-dismiss timer
    useEffect(() => {
        if (!current || current.duration === 0)
            return;
        timerRef.current = setTimeout(dismiss, current.duration);
        return () => {
            if (timerRef.current)
                clearTimeout(timerRef.current);
        };
    }, [current, dismiss]);
    // Cleanup on unmount
    useEffect(() => {
        return () => {
            if (timerRef.current)
                clearTimeout(timerRef.current);
            queueRef.current = [];
        };
    }, []);
    const handleAction = useCallback(() => {
        current?.onAction?.();
        dismiss();
    }, [current, dismiss]);
    const snackbarProps = {
        open: !!current,
        message: current?.message || "",
        actionLabel: current?.actionLabel,
        showClose: current?.showClose || false,
        onAction: handleAction,
        onDismiss: dismiss,
    };
    return { showSnackbar, dismiss, snackbarProps };
}
export default function SnackbarComponent({ open, message, actionLabel, showClose = false, onAction, onDismiss, className, id, }) {
    const containerRef = useRef(null);
    const [exiting, setExiting] = useState(false);
    const [layout, setLayout] = useState("singleLine");
    const snackbarId = id || "snackbar";
    // ── Layout detection ────────────────────────────────
    // M3: Single-line when message fits one line without wrapping.
    // Multi-line when text wraps. Longer-action when action
    // label is long (> 8 chars) and text wraps.
    useEffect(() => {
        if (!open || !message)
            return;
        const hasAction = !!actionLabel;
        const hasClose = showClose;
        if (!hasAction && !hasClose) {
            // Text only — let it wrap naturally
            setLayout(message.length > 60 ? "multiLine" : "singleLine");
            return;
        }
        // M3: "Longer action" layout when action label is long
        // and the message would likely wrap
        if (hasAction && actionLabel.length > 8 && message.length > 40) {
            setLayout("longerAction");
        }
        else if (message.length > 50) {
            setLayout("multiLine");
        }
        else {
            setLayout("singleLine");
        }
    }, [open, message, actionLabel, showClose]);
    // ── Exit animation ──────────────────────────────────
    const handleDismiss = useCallback(() => {
        setExiting(true);
    }, []);
    const handleAnimationEnd = useCallback((e) => {
        if (exiting && e.target === containerRef.current) {
            setExiting(false);
            onDismiss?.();
        }
    }, [exiting, onDismiss]);
    // Sync external dismissal
    useEffect(() => {
        if (!open && !exiting) {
            setExiting(false);
        }
    }, [open, exiting]);
    // ── Render gate ─────────────────────────────────────
    if (!open && !exiting)
        return null;
    const hasAction = !!actionLabel;
    const hasClose = showClose;
    const textOnly = !hasAction && !hasClose;
    const containerClass = [
        styles['container'],
        styles[layout],
        textOnly ? styles['text-only'] : "",
        className || "",
    ]
        .filter(Boolean)
        .join(" ");
    const content = (_jsx("div", { className: styles['host'], id: `${snackbarId}-host`, children: _jsxs("div", { ref: containerRef, className: containerClass, role: "status", "aria-live": "polite", "aria-atomic": "true", "data-exiting": exiting || undefined, onAnimationEnd: handleAnimationEnd, children: [_jsx("span", { className: styles['supporting-text'], id: `${snackbarId}-message`, children: message }), hasAction && (_jsx("button", { type: "button", className: styles['action'], onClick: onAction, id: `${snackbarId}-action`, children: actionLabel })), hasClose && (_jsx("button", { type: "button", className: styles['close-button'], onClick: handleDismiss, "aria-label": "Dismiss", id: `${snackbarId}-close`, children: _jsx(X, {}) }))] }) }));
    if (typeof document !== "undefined") {
        return createPortal(content, document.body);
    }
    return content;
}
//# sourceMappingURL=SnackbarComponent.js.map