// @ts-nocheck
"use client";

import { forwardRef, useCallback, useRef } from "react";
import styles from "./ExtendedFabComponent.module.css";
import { useComponents } from "../ComponentsProvider.js";
import SoundService from "../../services/SoundService.js";

/**
 * ExtendedFabComponent — Material Design 3 Extended Floating Action Button.
 *
 * Extended FABs are wider than regular FABs and include a text label alongside
 * an optional icon, providing more detail about the action and a larger touch
 * target. They represent the single most prominent action on a screen.
 *
 * M3 anatomy: container → state-layer → [ icon? ] + label
 *
 * @see https://m3.material.io/components/extended-fab/overview
 *
 * Audio is enabled when the app is wrapped with
 * `<ComponentsProvider sound>`. Without the provider the FAB
 * renders silently.
 *
 * @param {Object} props
 * @param {"primary"|"secondary"|"tertiary"|"surface"} [props.variant="primary"]
 *   M3 color mapping. Primary uses the theme accent, secondary uses
 *   secondary-container, tertiary uses tertiary-container, surface
 *   uses surface-container-high.
 * @param {React.ComponentType} [props.icon]
 *   Lucide-compatible icon component rendered at 24×24 (M3 spec).
 * @param {boolean} [props.collapsed=false]
 *   When true the label collapses and the FAB becomes icon-only (56×56).
 *   Designed for scroll-hide behavior — the consumer drives the state.
 * @param {boolean} [props.lowered=false]
 *   Lowers the resting elevation from level 3 to level 1. Use when the
 *   FAB sits on a surface that is itself elevated (e.g. bottom-app-bar).
 * @param {boolean} [props.fixed=false]
 *   Fixes the FAB to the bottom-right of the viewport with 16px inset.
 * @param {boolean} [props.disabled=false]
 *   Disabled state — reduces opacity, removes interactivity.
 * @param {string} [props.ariaLabel]
 *   Explicit accessible label. When omitted the text content of `children`
 *   is used. Always required when `collapsed` is true.
 * @param {React.ReactNode} props.children
 *   The text label for the FAB.
 * @param {string} [props.className]
 *   Additional CSS class.
 * @param {Function} [props.onClick]
 * @param {React.Ref} ref
 */
const ExtendedFabComponent = forwardRef(function ExtendedFabComponent(
  {
    variant = "primary",
    icon: Icon,
    collapsed = false,
    lowered = false,
    fixed = false,
    disabled = false,
    ariaLabel,
    children,
    className = "",
    onClick,
    onMouseEnter,
    ...rest
  },
  ref,
) {
  const { sound } = useComponents();
  const containerRef = useRef(null);

  // ── Ripple effect (M3 pressed state) ──────────────────
  const handleRipple = useCallback((e) => {
    const el = containerRef.current;
    if (!el) return;

    const rect = el.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = e.clientX - rect.left - size / 2;
    const y = e.clientY - rect.top - size / 2;

    const ripple = document.createElement("span");
    ripple.className = styles.ripple;
    ripple.style.width = `${size}px`;
    ripple.style.height = `${size}px`;
    ripple.style.left = `${x}px`;
    ripple.style.top = `${y}px`;

    el.appendChild(ripple);
    ripple.addEventListener("animationend", () => ripple.remove(), {
      once: true,
    });
  }, []);

  // ── Class composition ─────────────────────────────────
  const classes = [
    styles.extendedFab,
    styles[variant],
    collapsed ? styles.collapsed : "",
    lowered ? styles.lowered : "",
    fixed ? styles.fixed : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  // ── Merge refs ────────────────────────────────────────
  const setRef = useCallback(
    (node) => {
      containerRef.current = node;
      if (typeof ref === "function") ref(node);
      else if (ref) ref.current = node;
    },
    [ref],
  );

  return (
    <button
      ref={setRef}
      className={classes}
      disabled={disabled}
      type="button"
      role="button"
      aria-label={ariaLabel || undefined}
      aria-disabled={disabled || undefined}
      onMouseEnter={(e) => {
        if (sound) SoundService.playHoverButton({ event: e });
        onMouseEnter?.(e);
      }}
      onClick={(e) => {
        if (sound) SoundService.playClickButton({ event: e });
        handleRipple(e);
        onClick?.(e);
      }}
      {...rest}
    >
      {Icon && (
        <span className={styles.icon} aria-hidden="true">
          <Icon size={24} />
        </span>
      )}
      {children && <span className={styles.label}>{children}</span>}
    </button>
  );
});

export default ExtendedFabComponent;
