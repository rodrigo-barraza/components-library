// @ts-nocheck
"use client";

import { useEffect, useRef, useCallback, useState } from "react";
import { createPortal } from "react-dom";
import CloseButtonComponent from "../CloseButtonComponent/CloseButtonComponent.tsx";
import styles from "./DrawerComponent.module.css";

/**
 * DrawerComponent — M3 Side Sheet / slide-in drawer panel.
 *
 * A reusable panel that slides in from either side of the viewport.
 * Supports click-outside dismiss, Escape key, optional scrim overlay,
 * structured sections with label/value grids, and arbitrary children.
 *
 * @param {Object}   props
 * @param {boolean}  props.open                  — Controls drawer visibility
 * @param {Function} props.onClose               — Called when dismissed
 * @param {string}   [props.title="Detail"]      — Drawer header title
 * @param {"right"|"left"} [props.anchor="right"] — Which edge the drawer opens from
 * @param {number|string}  [props.width=480]      — Drawer width (px or CSS value)
 * @param {boolean}  [props.scrim=false]          — Show a backdrop overlay behind the drawer
 * @param {boolean}  [props.dismissible=true]     — Allow scrim click / outside click / Escape dismiss
 * @param {React.ReactNode} [props.headerActions] — Extra elements rendered in the header (before close button)
 * @param {Array<{title: string, items: Array<{label: string, value: React.ReactNode, mono?: boolean}>}>} [props.sections]
 *   — Structured detail sections rendered as label/value grids
 * @param {React.ReactNode} [props.children]      — Additional content rendered after sections
 * @param {string}   [props.className]            — Additional class for the drawer container
 * @param {string}   [props.id]                   — Unique ID for the drawer element
 */
export default function DrawerComponent({
  open,
  onClose,
  title = "Detail",
  anchor = "right",
  width = 480,
  scrim = false,
  dismissible = true,
  headerActions,
  sections = [],
  children,
  className,
  id,
}) {
  const drawerRef = useRef(null);
  const [closing, setClosing] = useState(false);

  // ── Graceful close with exit animation ───────────────
  const handleClose = useCallback(() => {
    if (!dismissible) return;
    setClosing(true);
  }, [dismissible]);

  // After exit animation completes, fire the real onClose
  const handleAnimationEnd = useCallback(
    (e) => {
      if (closing && e.target === drawerRef.current) {
        setClosing(false);
        onClose?.();
      }
    },
    [closing, onClose],
  );

  // ── Keyboard: Escape to dismiss ──────────────────────
  useEffect(() => {
    if (!open || !dismissible) return;

    const handleKey = (e) => {
      if (e.key === "Escape") {
        e.stopPropagation();
        handleClose();
      }
    };

    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [open, dismissible, handleClose]);

  // ── Click outside detection ──────────────────────────
  useEffect(() => {
    if (!open || !dismissible) return;

    const handleMouseDown = (e) => {
      if (drawerRef.current && !drawerRef.current.contains(e.target)) {
        handleClose();
      }
    };

    document.addEventListener("mousedown", handleMouseDown);
    return () => document.removeEventListener("mousedown", handleMouseDown);
  }, [open, dismissible, handleClose]);

  // ── Render gate ──────────────────────────────────────
  if (!open && !closing) return null;

  const widthValue = typeof width === "number" ? `${width}px` : width;

  const drawerClasses = [
    styles.drawer,
    anchor === "left" ? styles.left : "",
    className || "",
  ]
    .filter(Boolean)
    .join(" ");

  const content = (
    <>
      {/* Scrim overlay */}
      {scrim && (
        <div
          className={styles.scrim}
          data-closing={closing || undefined}
          onClick={dismissible ? handleClose : undefined}
        />
      )}

      {/* Drawer panel */}
      <div
        ref={drawerRef}
        id={id}
        className={drawerClasses}
        style={{ "--drawer-width": widthValue }}
        data-closing={closing || undefined}
        onAnimationEnd={handleAnimationEnd}
      >
        {/* Header */}
        <div className={styles.header}>
          <span className={styles.title}>{title}</span>
          <div className={styles.headerActions}>
            {headerActions}
            {dismissible && <CloseButtonComponent onClick={handleClose} />}
          </div>
        </div>

        {/* Body */}
        <div className={styles.body}>
          {sections.map((section, si) => (
            <div key={si} className={styles.section}>
              <div className={styles.sectionTitle}>{section.title}</div>
              <div className={styles.grid}>
                {section.items.map((item, ii) => (
                  <div key={ii} className={styles.item}>
                    <span className={styles.label}>{item.label}</span>
                    <span
                      className={`${styles.value} ${item.mono ? styles.mono : ""}`}
                    >
                      {item.value ?? "—"}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
          {children}
        </div>
      </div>
    </>
  );

  if (typeof document !== "undefined") {
    return createPortal(content, document.body);
  }

  return content;
}
