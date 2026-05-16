"use client";

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
  if (ms <= 0) return 0; // 0 = indefinite
  return Math.max(MIN_DURATION, Math.min(MAX_DURATION, ms));
}

/* ══════════════════════════════════════════════════════════
   useSnackbar — M3-compliant queue hook
   ══════════════════════════════════════════════════════════

   M3 guideline: only one snackbar is visible at a time.
   New snackbars dismiss the current one before appearing.
   This implements the queue pattern described in the spec.

   Returns:
     showSnackbar(message, options?) — imperative trigger
     snackbarProps                   — spread onto <SnackbarComponent />
*/
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
    setCurrent(next);
  }, []);

  // Dismiss current snackbar
  const dismiss = useCallback(() => {
    clearTimeout(timerRef.current);
    setCurrent(null);

    // Small delay to allow exit animation before next
    setTimeout(processQueue, EXIT_ANIMATION_MS + 50);
  }, [processQueue]);

  // Show a new snackbar
  const showSnackbar = useCallback(
    (message, options = {}) => {
      const {
        actionLabel,
        onAction,
        showClose = false,
        duration = DEFAULT_DURATION,
      } = options;

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
      } else {
        setCurrent(entry);
      }

      return id;
    },
    [current, dismiss],
  );

  // Auto-dismiss timer
  useEffect(() => {
    if (!current || current.duration === 0) return;

    timerRef.current = setTimeout(dismiss, current.duration);
    return () => clearTimeout(timerRef.current);
  }, [current, dismiss]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
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

/* ══════════════════════════════════════════════════════════
   SnackbarComponent — M3 Snackbar
   ══════════════════════════════════════════════════════════

   A transient, non-modal surface that communicates brief,
   informational messages at the bottom of the screen.

   @see https://m3.material.io/components/snackbar

   Anatomy:
     [container] → [supporting text] → [action?] → [close?]

   Layout variants (auto-detected):
     • single-line  — text + action/close on one row (48dp)
     • multi-line   — text wraps, action/close inline (68dp)
     • longer-action — action goes below on its own row

   Accessibility:
     • role="status" — polite notification
     • aria-live="polite" — announced after current speech
     • aria-atomic="true" — full content announced
     • Action button is fully keyboard-accessible

   @param {Object}   props
   @param {boolean}  props.open         — Controls visibility
   @param {string}   props.message      — Supporting text content
   @param {string}   [props.actionLabel] — Optional action button label
   @param {boolean}  [props.showClose=false] — Show close icon button
   @param {Function} [props.onAction]   — Action button handler
   @param {Function} [props.onDismiss]  — Dismiss handler (close button / swipe)
   @param {string}   [props.className]  — Additional container class
   @param {string}   [props.id]         — Unique ID for ARIA
*/
export default function SnackbarComponent({
  open,
  message,
  actionLabel,
  showClose = false,
  onAction,
  onDismiss,
  className,
  id,
}) {
  const containerRef = useRef(null);
  const [exiting, setExiting] = useState(false);
  const [layout, setLayout] = useState("singleLine");

  const snackbarId = id || "snackbar";

  // ── Layout detection ────────────────────────────────
  // M3: Single-line when message fits one line without wrapping.
  // Multi-line when text wraps. Longer-action when action
  // label is long (> 8 chars) and text wraps.
  useEffect(() => {
    if (!open || !message) return;

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
    } else if (message.length > 50) {
      setLayout("multiLine");
    } else {
      setLayout("singleLine");
    }
  }, [open, message, actionLabel, showClose]);

  // ── Exit animation ──────────────────────────────────
  const handleDismiss = useCallback(() => {
    setExiting(true);
  }, []);

  const handleAnimationEnd = useCallback(
    (e) => {
      if (exiting && e.target === containerRef.current) {
        setExiting(false);
        onDismiss?.();
      }
    },
    [exiting, onDismiss],
  );

  // Sync external dismissal
  useEffect(() => {
    if (!open && !exiting) {
      setExiting(false);
    }
  }, [open, exiting]);

  // ── Render gate ─────────────────────────────────────
  if (!open && !exiting) return null;

  const hasAction = !!actionLabel;
  const hasClose = showClose;
  const textOnly = !hasAction && !hasClose;

  const containerClass = [
    styles.container,
    styles[layout],
    textOnly ? styles.textOnly : "",
    className || "",
  ]
    .filter(Boolean)
    .join(" ");

  const content = (
    <div className={styles.host} id={`${snackbarId}-host`}>
      <div
        ref={containerRef}
        className={containerClass}
        role="status"
        aria-live="polite"
        aria-atomic="true"
        data-exiting={exiting || undefined}
        onAnimationEnd={handleAnimationEnd}
      >
        {/* ── Supporting text ── */}
        <span className={styles.supportingText} id={`${snackbarId}-message`}>
          {message}
        </span>

        {/* ── Action button ── */}
        {hasAction && (
          <button
            type="button"
            className={styles.action}
            onClick={onAction}
            id={`${snackbarId}-action`}
          >
            {actionLabel}
          </button>
        )}

        {/* ── Close icon button ── */}
        {hasClose && (
          <button
            type="button"
            className={styles.closeBtn}
            onClick={handleDismiss}
            aria-label="Dismiss"
            id={`${snackbarId}-close`}
          >
            <X />
          </button>
        )}
      </div>
    </div>
  );

  if (typeof document !== "undefined") {
    return createPortal(content, document.body);
  }

  return content;
}
