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
 */
export function useToast(defaultDuration = 3500) {
    const [toasts, setToasts] = useState([]);
    const idRef = useRef(0);
    const addToast = useCallback((message, type = "info", duration = defaultDuration) => {
        const id = ++idRef.current;
        setToasts((prev) => [...prev, { id, message, type, duration }]);
        if (duration > 0) {
            setTimeout(() => {
                setToasts((prev) => prev.filter((toast) => toast.id !== id));
            }, duration);
        }
        return id;
    }, [defaultDuration]);
    const removeToast = useCallback((id) => {
        setToasts((prev) => prev.filter((toast) => toast.id !== id));
    }, []);
    return { toasts, addToast, removeToast };
}
/**
 * ToastComponent — renders a stacked toast container.
 */
export default function ToastComponent({ toasts = [], onRemove }) {
    if (!toasts.length)
        return null;
    return (_jsx("div", { className: `toast-component ${styles['container']}`, id: "toast-container", children: toasts.map((toast) => {
            const Icon = ICONS[toast.type] || Info;
            const duration = toast.duration ?? 0;
            return (_jsxs("div", { role: "status", className: `${styles['toast']} ${styles[toast.type] || ""}`, style: duration > 0 ? { "--toast-duration": `${duration}ms` } : undefined, children: [_jsx("span", { className: styles['icon-chip'], children: _jsx(Icon, { size: 15 }) }), _jsx("span", { className: styles['message'], children: toast.message }), onRemove && (_jsx("button", { className: styles['close'], onClick: () => onRemove(toast.id), "aria-label": "Dismiss", children: _jsx(X, { size: 14 }) })), duration > 0 && _jsx("span", { className: styles['progress'] })] }, toast.id));
        }) }));
}
//# sourceMappingURL=ToastComponent.js.map