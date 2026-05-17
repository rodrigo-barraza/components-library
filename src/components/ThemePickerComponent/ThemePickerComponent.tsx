"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import * as Icons from "lucide-react";
import TooltipComponent from "../TooltipComponent/TooltipComponent.js";
import styles from "./ThemePickerComponent.module.css";

/**
 * Theme metadata — icon, label, and representative color for each built-in theme.
 *
 * The `color` values are the `--accent-color` from each theme's CSS custom properties,
 * used as the swatch indicator so the user can visually identify each theme at a glance.
 */
const THEME_CATALOG = {
  dark: {
    label: "Dark",
    icon: "Moon",
    color: "#6366f1",     // indigo accent
    bg: "#0a0a0f",
  },
  light: {
    label: "Light",
    icon: "Sun",
    color: "#4f46e5",     // deeper indigo
    bg: "#f5f5f7",
  },
  tropical: {
    label: "Tropical",
    icon: "Palmtree",
    color: "#ff6b6b",     // coral accent
    bg: "#1a120e",
  },
  oceanic: {
    label: "Oceanic",
    icon: "Waves",
    color: "#00b4d8",     // cerulean accent
    bg: "#060d18",
  },
  punk: {
    label: "Punk",
    icon: "Skull",
    color: "#ff2d9b",     // hot fuchsia accent
    bg: "#0e0a10",
  },
  muted: {
    label: "Muted",
    icon: "CloudFog",
    color: "#7c8290",     // cool slate accent
    bg: "#dddee3",
  },
  ember: {
    label: "Ember",
    icon: "Flame",
    color: "#f59e0b",     // amber accent
    bg: "#120c08",
  },
  arctic: {
    label: "Arctic",
    icon: "Snowflake",
    color: "#94cce0",     // ice-cyan accent
    bg: "#0a0e14",
  },
  forest: {
    label: "Forest",
    icon: "TreePine",
    color: "#4ade80",     // moss-green accent
    bg: "#080e08",
  },
  mono: {
    label: "Mono",
    icon: "Contrast",
    color: "#a0a0a0",     // neutral grey
    bg: "#101010",
  },
};

/**
 * ThemePickerComponent — Dropup theme selector for sidebar footers.
 *
 * Displays the current theme as a trigger button. Clicking opens a dropup
 * popover with all available themes rendered as selectable buttons, each
 * showing a color swatch, icon, and label.
 *

 * @param {string}   props.theme          — Current active theme name
 * @param {string[]} props.themes         — Ordered list of available theme names
 * @param {function} props.onSelectTheme  — Called with the selected theme name
 * @param {boolean}  [props.collapsed]    — Whether the parent sidebar is collapsed (hides labels)
 * @param {string}   [props.className]    — Additional class name for the wrapper
 */
interface ThemePickerProps {
  theme: string;
  themes?: string[];
  onSelectTheme: (theme: string) => void;
  collapsed?: boolean;
  className?: string;
}

export default function ThemePickerComponent({
  theme,
  themes = [],
  onSelectTheme,
  collapsed = false,
  className,
}: ThemePickerProps) {
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef(null);
  const triggerRef = useRef(null);
  const popoverRef = useRef(null);
  const [popoverStyle, setPopoverStyle] = useState({});

  // Close on outside click (check both wrapper and popover — popover may be fixed-positioned outside wrapper)
  useEffect(() => {
    if (!open) return;
    const handleClick = (e) => {
      const inWrapper = wrapperRef.current?.contains(e.target);
      const inPopover = popoverRef.current?.contains(e.target);
      if (!inWrapper && !inPopover) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open]);

  // Close on Escape
  useEffect(() => {
    if (!open) return;
    const handleKey = (e) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [open]);

  // Compute fixed position when opening in collapsed mode
  useEffect(() => {
    if (!open || !collapsed || !triggerRef.current) {
      setPopoverStyle({});
      return;
    }
    const rect = triggerRef.current.getBoundingClientRect();
    setPopoverStyle({
      position: 'fixed',
      bottom: 'auto',
      left: `${rect.right + 8}px`,
      top: `${Math.max(8, rect.bottom - 400)}px`, // anchor near trigger bottom, clamp to viewport
      right: 'auto',
    });
  }, [open, collapsed]);

  const handleSelect = useCallback(
    (themeName) => {
      onSelectTheme?.(themeName);
      setOpen(false);
    },
    [onSelectTheme],
  );

  const currentMeta = THEME_CATALOG[theme] || THEME_CATALOG.dark;
  const CurrentIcon = Icons[currentMeta.icon] || Icons.Palette;

  const triggerButton = (
    <button
      ref={triggerRef}
      className={styles.trigger}
      onClick={() => setOpen((v) => !v)}
      title="Change theme"
      type="button"
    >
      <span className={styles.triggerSwatch} style={{ background: currentMeta.color }} />
      <CurrentIcon size={18} strokeWidth={1.8} className={styles.triggerIcon} />
      <span className={styles.triggerLabel}>{currentMeta.label}</span>
      <Icons.ChevronUp
        size={14}
        className={`${styles.triggerChevron} ${open ? styles.triggerChevronOpen : ""}`}
      />
    </button>
  );

  return (
    <div
      ref={wrapperRef}
      className={`${styles.wrapper} ${collapsed ? styles.collapsed : ""} ${className || ""}`}
    >
      {/* Trigger — wrap in tooltip when collapsed so user sees the theme label */}
      {collapsed ? (
        <TooltipComponent label={currentMeta.label} position="right" delay={200} disabled={open} className={styles.tooltipFill}>
          {triggerButton}
        </TooltipComponent>
      ) : (
        triggerButton
      )}

      {/* Dropup popover (uses fixed positioning when collapsed to escape overflow:hidden) */}
      {open && (
        <div
          ref={popoverRef}
          className={`${styles.popover} ${collapsed ? styles.popoverFlyout : ""}`}
          style={collapsed ? popoverStyle : undefined}
        >
          <div className={styles.popoverHeader}>Theme</div>
          <div className={styles.themeList}>
            {themes.map((t) => {
              const meta = THEME_CATALOG[t] || { label: t, icon: "Palette", color: "#888", bg: "#222" };
              const ThemeIcon = Icons[meta.icon] || Icons.Palette;
              const isActive = t === theme;

              return (
                <button
                  key={t}
                  className={`${styles.themeOption} ${isActive ? styles.active : ""}`}
                  onClick={() => handleSelect(t)}
                  type="button"
                  title={`Switch to ${meta.label} theme`}
                >
                  <span
                    className={styles.swatch}
                    style={{
                      background: meta.color,
                      boxShadow: isActive ? `0 0 8px ${meta.color}88` : "none",
                    }}
                  >
                    {isActive && <Icons.Check size={10} strokeWidth={3} className={styles.swatchCheck} />}
                  </span>
                  <ThemeIcon size={16} strokeWidth={1.8} className={styles.optionIcon} />
                  <span className={styles.optionLabel}>{meta.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
