"use client";

import { useState, useRef, useEffect, useCallback, useId } from "react";
import { createPortal } from "react-dom";
import styles from "./TooltipComponent.module.css";

/**
 * TooltipComponent — M3-inspired tooltip with Plain and Rich variants.
 *
 * M3 Spec Reference (Tooltips):
 *   • Two variants:
 *       - Plain (label):  single-line label, inverse-surface bg, 4px radius
 *       - Rich:           multi-line subhead + supporting text, surface-container bg,
 *                         12px radius, optional action button, elevation 2
 *   • Plain tooltip: max 1 line, concise label text
 *   • Rich tooltip:  optional title (subhead), supporting text (body-small),
 *                    optional action slot, optional persistent mode
 *   • Trigger: hover or focus on the anchor element
 *   • Enter delay: 500ms for plain, immediate for rich (on long-press on touch)
 *   • Exit: plain auto-dismisses after 1500ms; rich stays until pointer leaves
 *   • Positioning: prefers below anchor with 4px–8px gap, flips to opposite
 *   • Caret/no-caret: M3 plain tooltips have no caret
 *
 * Accessibility (per M3 Tooltips/Accessibility):
 *   • Plain tooltip uses `role="tooltip"` and `aria-describedby` on trigger
 *   • Rich tooltip is an interactive surface with role="status" or live region
 *   • Esc key dismisses the tooltip
 *   • Focus-visible on trigger shows the tooltip
 *   • Touch: long-press to show (not implemented in web — hover/focus only)
 *   • prefers-reduced-motion: skip entrance animation
 *
 * Props — Plain variant (default):
 *
 * Props — Rich variant (activates when `rich` is truthy):
 */
interface TooltipProps {
  label?: React.ReactNode;
  position?: string;
  trigger?: string;
  enterDelay?: number;
  exitDelay?: number;
  disabled?: boolean;
  children: React.ReactNode;
  className?: string;
  rich?: boolean;
  title?: React.ReactNode;
  content?: React.ReactNode;
  action?: React.ReactNode;
  persistent?: boolean;
  delay?: number;
}

export default function TooltipComponent({
  /* plain */
  label,
  position = "top",
  trigger = "hover",
  enterDelay = 500,
  exitDelay = 1500,
  disabled = false,
  children,
  className = "",

  /* rich */
  rich = false,
  title,
  content,
  action,
  persistent = false,

  /* compat alias */
  delay,
}: TooltipProps) {
  const resolvedEnterDelay = delay ?? enterDelay;

  const [mounted, setMounted] = useState(false);
  const [visible, setVisible] = useState(false);
  const [coords, setCoords] = useState({ top: 0, left: 0 });
  const [resolvedPosition, setResolvedPosition] = useState(position);

  const wrapperRef = useRef<HTMLSpanElement | null>(null);
  const bubbleRef = useRef<HTMLSpanElement | null>(null);
  const enterTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const exitTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const showTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const unmountTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const tooltipId = useId();

  /* ── helpers ── */
  const hasContent = rich
    ? !!(title || content || action)
    : !!label;

  /** Calculate fixed position based on wrapper rect + desired position,
   *  flipping to the opposite side when viewport space is insufficient. */
  const updateCoords = useCallback(() => {
    if (!wrapperRef.current) return;
    const rect = wrapperRef.current.getBoundingClientRect();
    const GAP = rich ? 8 : 4;
    const TOOLTIP_HEIGHT_EST = rich ? 80 : 28;
    const TOOLTIP_WIDTH_EST = rich ? 320 : 200;
    let top, left;
    let resolved = position;

    switch (position) {
      case "top":
        if (rect.top - GAP - TOOLTIP_HEIGHT_EST < 0) {
          resolved = "bottom";
          top = rect.bottom + GAP;
        } else {
          top = rect.top - GAP;
        }
        left = rect.left + rect.width / 2;
        break;
      case "bottom":
        if (rect.bottom + GAP + TOOLTIP_HEIGHT_EST > window.innerHeight) {
          resolved = "top";
          top = rect.top - GAP;
        } else {
          top = rect.bottom + GAP;
        }
        left = rect.left + rect.width / 2;
        break;
      case "left":
        top = rect.top + rect.height / 2;
        if (rect.left - GAP - TOOLTIP_WIDTH_EST < 0) {
          resolved = "right";
          left = rect.right + GAP;
        } else {
          left = rect.left - GAP;
        }
        break;
      case "right":
        top = rect.top + rect.height / 2;
        if (rect.right + GAP + TOOLTIP_WIDTH_EST > window.innerWidth) {
          resolved = "left";
          left = rect.left - GAP;
        } else {
          left = rect.right + GAP;
        }
        break;
      default:
        top = rect.top - GAP;
        left = rect.left + rect.width / 2;
        break;
    }

    setResolvedPosition(resolved);
    setCoords({ top, left });
  }, [position, rich]);

  /* ── show / hide ── */
  const showTooltip = useCallback(() => {
    if (unmountTimerRef.current) clearTimeout(unmountTimerRef.current);
    if (showTimerRef.current) clearTimeout(showTimerRef.current);
    if (exitTimerRef.current) clearTimeout(exitTimerRef.current);
    updateCoords();
    setMounted(true);
    showTimerRef.current = setTimeout(() => {
      setVisible(true);
    }, 10);
  }, [updateCoords]);

  const hideTooltip = useCallback(() => {
    if (showTimerRef.current) clearTimeout(showTimerRef.current);
    if (enterTimerRef.current) clearTimeout(enterTimerRef.current);
    setVisible(false);
    unmountTimerRef.current = setTimeout(() => {
      setMounted(false);
    }, 200);
  }, []);

  /* ── click trigger ── */
  const handleClick = useCallback(() => {
    if (trigger !== "click") return;
    if (exitTimerRef.current) clearTimeout(exitTimerRef.current);
    showTooltip();
    if (!persistent) {
      exitTimerRef.current = setTimeout(hideTooltip, exitDelay);
    }
  }, [trigger, showTooltip, hideTooltip, exitDelay, persistent]);

  /* ── hover trigger ── */
  const handleMouseEnter = useCallback(() => {
    if (trigger !== "hover") return;
    if (exitTimerRef.current) clearTimeout(exitTimerRef.current);
    if (enterTimerRef.current) clearTimeout(enterTimerRef.current);
    enterTimerRef.current = setTimeout(() => {
      showTooltip();
    }, rich ? 0 : resolvedEnterDelay);
  }, [trigger, resolvedEnterDelay, showTooltip, rich]);

  const handleMouseLeave = useCallback(() => {
    if (trigger !== "hover") return;
    if (enterTimerRef.current) clearTimeout(enterTimerRef.current);
    // Rich tooltips can be interactive — give a small exit grace period
    if (rich) {
      exitTimerRef.current = setTimeout(hideTooltip, 300);
    } else {
      hideTooltip();
    }
  }, [trigger, hideTooltip, rich]);

  /* ── focus trigger (keyboard accessibility) ── */
  const handleFocus = useCallback(() => {
    if (exitTimerRef.current) clearTimeout(exitTimerRef.current);
    if (enterTimerRef.current) clearTimeout(enterTimerRef.current);
    enterTimerRef.current = setTimeout(() => {
      showTooltip();
    }, rich ? 0 : resolvedEnterDelay);
  }, [showTooltip, resolvedEnterDelay, rich]);

  const handleBlur = useCallback(() => {
    if (enterTimerRef.current) clearTimeout(enterTimerRef.current);
    if (!persistent) hideTooltip();
  }, [hideTooltip, persistent]);

  /* ── Esc key dismissal (M3 accessibility) ── */
  useEffect(() => {
    if (!visible) return;
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        e.stopPropagation();
        hideTooltip();
      }
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [visible, hideTooltip]);

  /* ── Click-outside dismissal ── */
  useEffect(() => {
    if (!visible || trigger !== "click") return;
    function handleClickOutside(e: PointerEvent) {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(e.target as Node) &&
        (!bubbleRef.current || !bubbleRef.current.contains(e.target as Node))
      ) {
        if (exitTimerRef.current) clearTimeout(exitTimerRef.current);
        hideTooltip();
      }
    }
    document.addEventListener("pointerdown", handleClickOutside);
    return () =>
      document.removeEventListener("pointerdown", handleClickOutside);
  }, [visible, trigger, hideTooltip]);

  /* ── Rich tooltip: keep open when pointer enters the bubble ── */
  const handleBubbleMouseEnter = useCallback(() => {
    if (!rich) return;
    if (exitTimerRef.current) clearTimeout(exitTimerRef.current);
  }, [rich]);

  const handleBubbleMouseLeave = useCallback(() => {
    if (!rich || persistent) return;
    exitTimerRef.current = setTimeout(hideTooltip, 300);
  }, [rich, persistent, hideTooltip]);

  /* ── Cleanup ── */
  useEffect(() => {
    return () => {
      if (enterTimerRef.current) clearTimeout(enterTimerRef.current);
      if (exitTimerRef.current) clearTimeout(exitTimerRef.current);
      if (showTimerRef.current) clearTimeout(showTimerRef.current);
      if (unmountTimerRef.current) clearTimeout(unmountTimerRef.current);
    };
  }, []);

  /* ── Guard: no label / disabled ── */
  if (!hasContent || disabled) return children;

  /* ── Build bubble classes ── */
  const bubbleClasses = [
    styles.bubble,
    rich ? styles.rich : styles.plain,
    styles[resolvedPosition],
    visible && styles['is-visible-state'],
  ]
    .filter(Boolean)
    .join(" ");

  /* ── Render ── */
  const bubble = mounted
    ? createPortal(
        <span
          ref={bubbleRef}
          id={tooltipId}
          className={bubbleClasses}
          style={{ top: coords.top, left: coords.left }}
          role={rich ? "status" : "tooltip"}
          aria-live={rich ? "polite" : undefined}
          onMouseEnter={handleBubbleMouseEnter}
          onMouseLeave={handleBubbleMouseLeave}
        >
          {/* ── Plain variant ── */}
          {!rich && <span className={styles['plain-label']}>{label}</span>}

          {/* ── Rich variant ── */}
          {rich && (
            <span className={styles['rich-content']}>
              {title && (
                <span className={styles['rich-title']}>{title}</span>
              )}
              {content && (
                <span className={styles['rich-body']}>{content}</span>
              )}
              {action && (
                <span className={styles['rich-action']}>{action}</span>
              )}
            </span>
          )}
        </span>,
        document.body,
      )
    : null;

  return (
    <span
      ref={wrapperRef}
      className={`${styles.wrapper} ${trigger === "hover" ? styles['hover-trigger'] : ""} ${className}`}
      onClick={trigger === "click" ? handleClick : undefined}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onFocus={handleFocus}
      onBlur={handleBlur}
      aria-describedby={!rich && mounted ? tooltipId : undefined}
    >
      {children}
      {bubble}
    </span>
  );
}
