"use client";

import { useRef, useCallback, forwardRef } from "react";
import styles from "./ToolbarComponent.module.css";

/**
 * ToolbarComponent — M3-inspired toolbar container.
 *
 * Material Design 3 Toolbar is a horizontal bar that groups contextual
 * action icons, navigation, and controls. It surfaces the most relevant
 * actions for the current context.
 *
 * @see https://m3.material.io/components/toolbars/overview
 *
 * Compound sub-components:
 *   ToolbarComponent.Group      — logical grouping of related actions
 *   ToolbarComponent.Item       — individual interactive toolbar item (icon button)
 *   ToolbarComponent.Separator  — visual divider between groups
 *   ToolbarComponent.Title      — text label / title within the toolbar
 *   ToolbarComponent.Spacer     — flex spacer to push items apart
 *
 * Accessibility (WAI-ARIA Toolbar pattern):
 *   • role="toolbar" with aria-label
 *   • Roving tabindex: arrow keys move focus between items
 *   • Home / End jump to first / last item
 *   • Tab moves focus out of the toolbar entirely
 *
 * @param {"standard"|"dense"}  [variant="standard"]  — height variant
 * @param {"horizontal"|"vertical"} [orientation="horizontal"] — layout direction
 * @param {boolean}   [divider=false]    — renders a bottom border
 * @param {boolean}   [sticky=false]     — makes toolbar sticky at top
 * @param {boolean}   [elevated=false]   — adds subtle shadow
 * @param {string}    [ariaLabel]        — accessible label for the toolbar
 * @param {string}    [className]
 * @param {object}    [style]
 * @param {React.ReactNode} children
 */
export default function ToolbarComponent({
  variant = "standard",
  orientation = "horizontal",
  divider = false,
  sticky = false,
  elevated = false,
  ariaLabel,
  className,
  style,
  children,
  ...rest
}) {
  const toolbarRef = useRef(null);

  /**
   * Roving tabindex keyboard navigation per WAI-ARIA toolbar pattern.
   * Arrow keys navigate between focusable items; Home/End jump to ends.
   */
  const handleKeyDown = useCallback(
    (e) => {
      const toolbar = toolbarRef.current;
      if (!toolbar) return;

      const isHorizontal = orientation === "horizontal";
      const nextKey = isHorizontal ? "ArrowRight" : "ArrowDown";
      const prevKey = isHorizontal ? "ArrowLeft" : "ArrowUp";
      const navigableKeys = [nextKey, prevKey, "Home", "End"];

      if (!navigableKeys.includes(e.key)) return;

      // Collect all focusable items within the toolbar
      const items = Array.from(
        toolbar.querySelectorAll(
          `[data-toolbar-item]:not([disabled]):not([aria-disabled="true"])`,
        ),
      );

      if (items.length === 0) return;

      const currentIndex = items.indexOf(document.activeElement);
      let nextIndex;

      switch (e.key) {
        case nextKey:
          e.preventDefault();
          nextIndex = currentIndex < items.length - 1 ? currentIndex + 1 : 0;
          break;
        case prevKey:
          e.preventDefault();
          nextIndex = currentIndex > 0 ? currentIndex - 1 : items.length - 1;
          break;
        case "Home":
          e.preventDefault();
          nextIndex = 0;
          break;
        case "End":
          e.preventDefault();
          nextIndex = items.length - 1;
          break;
        default:
          return;
      }

      // Roving tabindex: remove current item from tab order, add next
      items.forEach((item, i) => {
        item.setAttribute("tabindex", i === nextIndex ? "0" : "-1");
      });
      items[nextIndex]?.focus();
    },
    [orientation],
  );

  const classes = [
    styles.toolbar,
    styles[variant],
    styles[orientation],
    divider && styles.divider,
    sticky && styles.sticky,
    elevated && styles.elevated,
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div
      ref={toolbarRef}
      role="toolbar"
      aria-label={ariaLabel}
      aria-orientation={orientation}
      className={classes}
      style={style}
      onKeyDown={handleKeyDown}
      {...rest}
    >
      {children}
    </div>
  );
}

/* ── Group ──────────────────────────────────────────────────────── */

/**
 * ToolbarGroup — logically groups related toolbar items.
 *
 * M3 toolbars organize actions into leading, center, and trailing
 * groups. Use `role="group"` with an aria-label for screen readers.
 *
 * @param {string}    [ariaLabel]  — accessible group label
 * @param {string}    [className]
 * @param {React.ReactNode} children
 */
function ToolbarGroup({ ariaLabel, className, children }) {
  return (
    <div
      role="group"
      aria-label={ariaLabel}
      className={`${styles.group}${className ? ` ${className}` : ""}`}
    >
      {children}
    </div>
  );
}

/* ── Item ───────────────────────────────────────────────────────── */

/**
 * ToolbarItem — individual interactive element within a toolbar.
 *
 * Renders a button with M3 state-layer feedback (hover, focus, press).
 * Participates in roving tabindex via `data-toolbar-item`.
 *
 * M3 spec: 48×48dp touch target, 24×24dp icon optical size.
 *
 * @param {React.ComponentType} [icon]  — Lucide or similar icon component
 * @param {string}    [label]           — visible text label
 * @param {string}    [ariaLabel]       — accessible label (overrides label)
 * @param {boolean}   [active=false]    — active/selected state
 * @param {boolean}   [disabled=false]
 * @param {Function}  [onClick]
 * @param {string}    [className]
 * @param {React.ReactNode} children    — overrides icon + label rendering
 */
const ToolbarItem = forwardRef(function ToolbarItem(
  {
    icon: Icon,
    label,
    ariaLabel,
    active = false,
    disabled = false,
    onClick,
    className,
    children,
    ...rest
  },
  ref,
) {
  const classes = [
    styles.item,
    active && styles.itemActive,
    disabled && styles.itemDisabled,
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <button
      ref={ref}
      type="button"
      role="button"
      data-toolbar-item=""
      tabIndex={-1}
      aria-label={ariaLabel || label}
      aria-pressed={active || undefined}
      aria-disabled={disabled || undefined}
      disabled={disabled}
      onClick={onClick}
      className={classes}
      {...rest}
    >
      <span className={styles.stateLayer} />
      {children || (
        <>
          {Icon && <Icon size={20} className={styles.itemIcon} />}
          {label && <span className={styles.itemLabel}>{label}</span>}
        </>
      )}
    </button>
  );
});

/* ── Separator ──────────────────────────────────────────────────── */

/**
 * ToolbarSeparator — visual divider between toolbar groups.
 *
 * M3 spec: 1px outline-variant line, 24px height, 4px horizontal margin.
 *
 * @param {string}  [className]
 */
function ToolbarSeparator({ className }) {
  return (
    <div
      role="separator"
      aria-orientation="vertical"
      className={`${styles.separator}${className ? ` ${className}` : ""}`}
    />
  );
}

/* ── Title ──────────────────────────────────────────────────────── */

/**
 * ToolbarTitle — text label displayed within the toolbar.
 *
 * M3 spec: title-medium typography (16px / 500 weight).
 *
 * @param {string}    [className]
 * @param {React.ReactNode} children
 */
function ToolbarTitle({ className, children }) {
  return (
    <span className={`${styles.title}${className ? ` ${className}` : ""}`}>
      {children}
    </span>
  );
}

/* ── Spacer ─────────────────────────────────────────────────────── */

/**
 * ToolbarSpacer — flex spacer to distribute space between groups.
 *
 * Pushes trailing items to the end (or distributes space evenly
 * when placed between groups).
 */
function ToolbarSpacer() {
  return <div className={styles.spacer} />;
}

/* ── Attach sub-components ──────────────────────────────────────── */

ToolbarComponent.Group = ToolbarGroup;
ToolbarComponent.Item = ToolbarItem;
ToolbarComponent.Separator = ToolbarSeparator;
ToolbarComponent.Title = ToolbarTitle;
ToolbarComponent.Spacer = ToolbarSpacer;
