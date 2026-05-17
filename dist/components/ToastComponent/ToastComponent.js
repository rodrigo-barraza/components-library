// @ts-nocheck
"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useCallback, useRef, useState } from "react";
import { X, CheckCircle, AlertTriangle, AlertCircle, Info } from "lucide-react";
import styles from "./ToastComponent.module.css";
const ICONS = {
    success: CheckCircle,
    warning: AlertTriangle,
    error: AlertCircle,
    info: Info,
};
/**
 * useToast — multi-toast queue hook.
 *
 * Returns { toasts, addToast, removeToast } plus a ready-to-render
 * <ToastComponent /> element you can drop into JSX.
 *
 * @param {number} [defaultDuration=3500] — default auto-dismiss time in ms
 */
export function useToast(defaultDuration = 3500) {
    const [toasts, setToasts] = useState([]);
    const idRef = useRef(0);
    const addToast = useCallback((message, type = "info", duration = defaultDuration) => {
        const id = ++idRef.current;
        setToasts((prev) => [...prev, { id, message, type }]);
        if (duration > 0) {
            setTimeout(() => {
                setToasts((prev) => prev.filter((t) => t.id !== id));
            }, duration);
        }
        return id;
    }, [defaultDuration]);
    const removeToast = useCallback((id) => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
    }, []);
    return { toasts, addToast, removeToast };
}
/**
 * ToastComponent — renders a stacked toast container.
 *
 * @param {{ id: number, message: string, type: string }[]} toasts
 * @param {(id: number) => void} onRemove
 */
export default function ToastComponent({ toasts = [], onRemove }) {
    if (!toasts.length)
        return null;
    return (_jsx("div", { className: styles.container, id: "toast-container", children: toasts.map((toast) => {
            const Icon = ICONS[toast.type] || Info;
            return (_jsxs("div", { className: `${styles.toast} ${styles[toast.type] || ""}`, children: [_jsx(Icon, { size: 16, className: styles.icon }), _jsx("span", { className: styles.message, children: toast.message }), onRemove && (_jsx("button", { className: styles.close, onClick: () => onRemove(toast.id), "aria-label": "Dismiss", children: _jsx(X, { size: 14 }) }))] }, toast.id));
        }) }));
}
//# sourceMappingURL=ToastComponent.js.map