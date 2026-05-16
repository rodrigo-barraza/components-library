// @ts-nocheck
"use client";

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

  const addToast = useCallback(
    (message, type = "info", duration = defaultDuration) => {
      const id = ++idRef.current;
      setToasts((prev) => [...prev, { id, message, type }]);

      if (duration > 0) {
        setTimeout(() => {
          setToasts((prev) => prev.filter((t) => t.id !== id));
        }, duration);
      }

      return id;
    },
    [defaultDuration],
  );

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
  if (!toasts.length) return null;

  return (
    <div className={styles.container} id="toast-container">
      {toasts.map((toast) => {
        const Icon = ICONS[toast.type] || Info;
        return (
          <div
            key={toast.id}
            className={`${styles.toast} ${styles[toast.type] || ""}`}
          >
            <Icon size={16} className={styles.icon} />
            <span className={styles.message}>{toast.message}</span>
            {onRemove && (
              <button
                className={styles.close}
                onClick={() => onRemove(toast.id)}
                aria-label="Dismiss"
              >
                <X size={14} />
              </button>
            )}
          </div>
        );
      })}
    </div>
  );
}
