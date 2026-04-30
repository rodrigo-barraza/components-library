"use client";

import { useEffect, useRef, useCallback } from "react";
import { createPortal } from "react-dom";
import styles from "./ModalComponent.module.css";

/**
 * ModalComponent — Structured modal dialog with header, body, and footer.
 *
 * Renders a full-screen overlay with a centered panel. Supports Escape
 * and click-outside dismissal, React Portal mounting, and three size
 * presets.
 *
 * @param {string|React.ReactNode} title — Header title
 * @param {Function} onClose — Called when X / overlay / Escape dismisses
 * @param {React.ReactNode} [footer] — Sticky footer content (action buttons)
 * @param {"sm"|"md"|"lg"|"xl"} [size="md"] — Panel width preset
 * @param {"default"|"dark"} [variant="default"] — Overlay darkness
 * @param {string} [className] — Additional class on the panel
 * @param {React.ReactNode} children — Body content
 */
export default function ModalComponent({
  title,
  onClose,
  footer,
  size = "md",
  variant = "default",
  className,
  children,
}) {
  const overlayRef = useRef(null);

  // Dismiss on Escape
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [onClose]);

  // Dismiss on overlay click (not panel children)
  const handleOverlayClick = useCallback(
    (e) => {
      if (e.target === overlayRef.current) onClose();
    },
    [onClose],
  );

  const overlayClass = [
    styles.overlay,
    variant === "dark" ? styles.overlayDark : "",
  ]
    .filter(Boolean)
    .join(" ");

  const panelClass = [
    styles.panel,
    styles[`size_${size}`],
    className || "",
  ]
    .filter(Boolean)
    .join(" ");

  const content = (
    <div
      className={overlayClass}
      ref={overlayRef}
      onClick={handleOverlayClick}
    >
      <div className={panelClass}>
        <div className={styles.header}>
          <span className={styles.title}>{title}</span>
          <button
            className={styles.closeBtn}
            onClick={onClose}
            title="Close"
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>
        <div className={styles.body}>{children}</div>
        {footer && <div className={styles.footer}>{footer}</div>}
      </div>
    </div>
  );

  if (typeof document !== "undefined") {
    return createPortal(content, document.body);
  }

  return content;
}
