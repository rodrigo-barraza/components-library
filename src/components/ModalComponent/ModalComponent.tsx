import { useEffect, useRef, useCallback, ReactNode } from "react";
import { createPortal } from "react-dom";
import styles from "./ModalComponent.module.css";

export interface ModalComponentProps {
  title: string | ReactNode;
  onClose: () => void;
  footer?: ReactNode;
  size?: "sm" | "md" | "lg" | "xl" | string;
  variant?: "default" | "dark" | string;
  className?: string;
  id?: string;
  children?: ReactNode;
}

/**
 * ModalComponent — Structured modal dialog with header, body, and footer.
 *
 * Renders a full-screen overlay with a centered panel. Supports Escape
 * and click-outside dismissal, React Portal mounting, body scroll lock,
 * focus trapping with focus restoration, and four size presets.
 */
export default function ModalComponent({
  title,
  onClose,
  footer,
  size = "md",
  variant = "default",
  className,
  id,
  children,
}: ModalComponentProps) {
  const overlayRef = useRef<HTMLDivElement | null>(null);
  const panelRef = useRef<HTMLDivElement | null>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

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
      if (!panel) return;

      const focusable = panel.querySelector(
        'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
      );
      if (focusable instanceof HTMLElement) {
        focusable.focus();
      } else {
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
    const handleTab = (event: KeyboardEvent) => {
      if (event.key !== "Tab") return;
      const panel = panelRef.current;
      if (!panel) return;

      const focusableEls = Array.from(
        panel.querySelectorAll<HTMLElement>(
          'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
        )
      );

      if (focusableEls.length === 0) return;

      const first = focusableEls[0];
      const last = focusableEls[focusableEls.length - 1];

      if (event.shiftKey) {
        if (document.activeElement === first) {
          event.preventDefault();
          last.focus();
        }
      } else {
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
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.stopPropagation();
        onClose();
      }
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [onClose]);

  // Dismiss on overlay click (not panel children)
  const handleOverlayClick = useCallback(
    (event: React.MouseEvent<HTMLDivElement>) => {
      if (event.target === overlayRef.current) onClose();
    },
    [onClose],
  );

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

  const content = (
    <div
      className={overlayClass}
      ref={overlayRef}
      onClick={handleOverlayClick}
    >
      <div
        ref={panelRef}
        className={panelClass}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
      >
        <div className={styles['header']}>
          <span className={styles['title']} id={titleId}>{title}</span>
          <button
            className={styles['close-button']}
            onClick={onClose}
            title="Close"
            aria-label="Close modal"
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
        <div className={styles['body']}>{children}</div>
        {footer && <div className={styles['footer']}>{footer}</div>}
      </div>
    </div>
  );

  if (typeof document !== "undefined") {
    return createPortal(content, document.body);
  }

  return content;
}
