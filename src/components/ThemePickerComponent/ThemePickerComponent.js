"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import * as Icons from "lucide-react";
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
};

/**
 * ThemePickerComponent — Dropup theme selector for sidebar footers.
 *
 * Displays the current theme as a trigger button. Clicking opens a dropup
 * popover with all available themes rendered as selectable buttons, each
 * showing a color swatch, icon, and label.
 *
 * @param {Object} props
 * @param {string}   props.theme          — Current active theme name
 * @param {string[]} props.themes         — Ordered list of available theme names
 * @param {function} props.onSelectTheme  — Called with the selected theme name
 * @param {boolean}  [props.collapsed]    — Whether the parent sidebar is collapsed (hides labels)
 * @param {string}   [props.className]    — Additional class name for the wrapper
 */
export default function ThemePickerComponent({
  theme,
  themes = [],
  onSelectTheme,
  collapsed = false,
  className,
}) {
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef(null);

  // Close on outside click
  useEffect(() => {
    if (!open) return;
    const handleClick = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
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

  const handleSelect = useCallback(
    (themeName) => {
      onSelectTheme?.(themeName);
      setOpen(false);
    },
    [onSelectTheme],
  );

  const currentMeta = THEME_CATALOG[theme] || THEME_CATALOG.dark;
  const CurrentIcon = Icons[currentMeta.icon] || Icons.Palette;

  return (
    <div
      ref={wrapperRef}
      className={`${styles.wrapper} ${collapsed ? styles.collapsed : ""} ${className || ""}`}
    >
      {/* Trigger button */}
      <button
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

      {/* Dropup popover */}
      {open && (
        <div className={styles.popover}>
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
