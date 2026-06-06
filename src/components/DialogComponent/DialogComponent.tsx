import { useEffect, useRef, useCallback, useState, ReactNode } from "react";
import { createPortal } from "react-dom";
import styles from "./DialogComponent.module.css";

export interface DialogComponentProps {
  open: boolean;
  onClose: () => void;
  icon?: ReactNode;
  headline?: string | ReactNode;
  onConfirm?: () => void;
  confirmLabel?: string;
  cancelLabel?: string;
  hideCancel?: boolean;
  confirmVariant?: "default" | "destructive" | string;
  confirmDisabled?: boolean;
  fullscreen?: boolean;
  dismissible?: boolean;
  className?: string;
  id?: string;
  children?: ReactNode;
}

/**
 * DialogComponent — M3 AlertDialog
 *
 * A focused, interruptive prompt that requires user acknowledgment.
 * Implements the Material Design 3 dialog pattern with proper
 * scrim, focus trapping, Escape dismissal, and accessible markup.
 *
 * @see https://m3.material.io/components/dialogs
 *
 * Anatomy: [scrim] → [container] → [icon?] → [headline?] → [body] → [actions]
 */
export default function DialogComponent({
  open,
  onClose,
  icon,
  headline,
  onConfirm,
  confirmLabel = "OK",
  cancelLabel = "Cancel",
  hideCancel = false,
  confirmVariant = "default",
  confirmDisabled = false,
  fullscreen = false,
  dismissible = true,
  className,
  id,
  children,
}: DialogComponentProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const previousFocusRef = useRef<Element | null>(null);
  const [closing, setClosing] = useState(false);

  // ── Unique ARIA IDs ──────────────────────────────────
  const dialogId = id || "dialog";
  const headlineId = `${dialogId}-headline`;
  const bodyId = `${dialogId}-body`;

  // ── Graceful close with exit animation ───────────────
  const handleClose = useCallback(() => {
    if (!dismissible) return;
    setClosing(true);
  }, [dismissible]);

  // After exit animation completes, fire the real onClose
  const handleAnimationEnd = useCallback(
    (e: React.AnimationEvent<HTMLDivElement>) => {
      if (closing && e.target === containerRef.current) {
        setClosing(false);
        onClose?.();
      }
    },
    [closing, onClose],
  );

  // ── Keyboard: Escape to dismiss ──────────────────────
  useEffect(() => {
    if (!open) return;

    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && dismissible) {
        e.stopPropagation();
        handleClose();
      }
    };

    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [open, dismissible, handleClose]);

  // ── Focus management ─────────────────────────────────
  // M3 accessibility: move focus into dialog on open,
  // restore to trigger element on close
  useEffect(() => {
    if (open) {
      previousFocusRef.current = document.activeElement;

      // Defer focus to after portal mount + animation start
      requestAnimationFrame(() => {
        const container = containerRef.current;
        if (!container) return;

        // Focus the first focusable element (typically a button)
        const focusable = container.querySelector(
          'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
        );
        if (focusable instanceof HTMLElement) {
          focusable.focus();
        } else {
          container.focus();
        }
      });
    }

    return () => {
      // Restore focus when dialog unmounts
      if (previousFocusRef.current instanceof HTMLElement) {
        previousFocusRef.current.focus();
      }
    };
  }, [open]);

  // ── Focus trapping ───────────────────────────────────
  // Per M3 accessibility: Tab cycles within dialog boundaries
  useEffect(() => {
    if (!open) return;

    const handleTab = (e: KeyboardEvent) => {
      if (e.key !== "Tab") return;
      const container = containerRef.current;
      if (!container) return;

      const focusableEls = Array.from(
        container.querySelectorAll<HTMLElement>(
          'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
        )
      );

      if (focusableEls.length === 0) return;

      const first = focusableEls[0];
      const last = focusableEls[focusableEls.length - 1];

      if (e.shiftKey) {
        if (document.activeElement === first) {
          e.preventDefault();
          last.focus();
        }
      } else {
        if (document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };

    document.addEventListener("keydown", handleTab);
    return () => document.removeEventListener("keydown", handleTab);
  }, [open]);

  // ── Body scroll lock ─────────────────────────────────
  useEffect(() => {
    if (!open) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [open]);

  // ── Scrim click ──────────────────────────────────────
  const handleScrimClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (e.target === e.currentTarget && dismissible) {
        handleClose();
      }
    },
    [dismissible, handleClose],
  );

  // ── Confirm handler ──────────────────────────────────
  const handleConfirm = useCallback(() => {
    onConfirm?.();
  }, [onConfirm]);

  // ── Render gate ──────────────────────────────────────
  if (!open && !closing) return null;

  const scrimClass = [
    styles['scrim'],
    fullscreen ? styles['fullscreen'] : "",
  ]
    .filter(Boolean)
    .join(" ");

  const containerClass = [
    styles['container'],
    className || "",
  ]
    .filter(Boolean)
    .join(" ");

  const confirmBtnClass = [
    styles['action-button'],
    confirmVariant === "destructive"
      ? styles['action-btn-destructive']
      : styles['action-btn-primary'],
  ]
    .filter(Boolean)
    .join(" ");

  const content = (
    <div
      className={scrimClass}
      onClick={handleScrimClick}
      data-closing={closing || undefined}
    >
      <div
        ref={containerRef}
        className={containerClass}
        role="alertdialog"
        aria-modal="true"
        aria-labelledby={headline ? headlineId : undefined}
        aria-describedby={bodyId}
        tabIndex={-1}
        data-closing={closing || undefined}
        onAnimationEnd={handleAnimationEnd}
      >
        {/* ── Icon ── */}
        {icon && (
          <div className={styles['icon']} aria-hidden="true">
            {icon}
          </div>
        )}

        {/* ── Headline ── */}
        {headline && (
          <h2
            id={headlineId}
            className={[
              styles['headline'],
              icon ? styles['headline-centered'] : "",
            ]
              .filter(Boolean)
              .join(" ")}
          >
            {headline}
          </h2>
        )}

        {/* ── Supporting text / body content ── */}
        <div id={bodyId} className={styles['body']}>
          {children}
        </div>

        {/* ── Actions ── */}
        <div className={styles['actions']}>
          {!hideCancel && (
            <button
              type="button"
              className={styles['action-button']}
              onClick={handleClose}
            >
              {cancelLabel}
            </button>
          )}
          <button
            type="button"
            className={confirmBtnClass}
            onClick={handleConfirm}
            disabled={confirmDisabled}
            autoFocus
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );

  if (typeof document !== "undefined") {
    return createPortal(content, document.body);
  }

  return content;
}
