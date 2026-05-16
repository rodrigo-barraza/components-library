// @ts-nocheck
"use client";

import { useEffect, useRef, useCallback, useState } from "react";
import { createPortal } from "react-dom";
import styles from "./DialogComponent.module.css";

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
 *
 * @param {Object}   props
 * @param {boolean}  props.open                — Controls dialog visibility
 * @param {Function} props.onClose             — Called when dismissed (scrim click / Escape)
 * @param {React.ReactNode}  [props.icon]      — Optional hero icon (centered above headline)
 * @param {string}           [props.headline]  — Dialog headline / title
 * @param {Function}         [props.onConfirm] — Confirm action handler
 * @param {string}           [props.confirmLabel="OK"]    — Confirm button label
 * @param {string}           [props.cancelLabel="Cancel"] — Cancel button label
 * @param {boolean}          [props.hideCancel=false]      — Omit cancel button (acknowledgment dialogs)
 * @param {"default"|"destructive"} [props.confirmVariant="default"] — Visual emphasis
 * @param {boolean}          [props.confirmDisabled=false] — Disable confirm action
 * @param {boolean}          [props.fullscreen=false]      — Mobile fullscreen mode
 * @param {boolean}          [props.dismissible=true]      — Allow scrim/Escape dismissal
 * @param {string}           [props.className]             — Additional container class
 * @param {string}           [props.id]                    — Unique dialog ID for ARIA
 * @param {React.ReactNode}  props.children    — Supporting text / body content
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
}) {
  const containerRef = useRef(null);
  const previousFocusRef = useRef(null);
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
    (e) => {
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

    const handleKey = (e) => {
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
        if (focusable) {
          focusable.focus();
        } else {
          container.focus();
        }
      });
    }

    return () => {
      // Restore focus when dialog unmounts
      if (previousFocusRef.current && typeof previousFocusRef.current.focus === "function") {
        previousFocusRef.current.focus();
      }
    };
  }, [open]);

  // ── Focus trapping ───────────────────────────────────
  // Per M3 accessibility: Tab cycles within dialog boundaries
  useEffect(() => {
    if (!open) return;

    const handleTab = (e) => {
      if (e.key !== "Tab") return;
      const container = containerRef.current;
      if (!container) return;

      const focusableEls = container.querySelectorAll(
        'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
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
    (e) => {
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
    styles.scrim,
    fullscreen ? styles.fullscreen : "",
  ]
    .filter(Boolean)
    .join(" ");

  const containerClass = [
    styles.container,
    className || "",
  ]
    .filter(Boolean)
    .join(" ");

  const confirmBtnClass = [
    styles.actionBtn,
    confirmVariant === "destructive"
      ? styles.actionBtnDestructive
      : styles.actionBtnPrimary,
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
          <div className={styles.icon} aria-hidden="true">
            {icon}
          </div>
        )}

        {/* ── Headline ── */}
        {headline && (
          <h2
            id={headlineId}
            className={[
              styles.headline,
              icon ? styles.headlineCentered : "",
            ]
              .filter(Boolean)
              .join(" ")}
          >
            {headline}
          </h2>
        )}

        {/* ── Supporting text / body content ── */}
        <div id={bodyId} className={styles.body}>
          {children}
        </div>

        {/* ── Actions ── */}
        <div className={styles.actions}>
          {!hideCancel && (
            <button
              type="button"
              className={styles.actionBtn}
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
