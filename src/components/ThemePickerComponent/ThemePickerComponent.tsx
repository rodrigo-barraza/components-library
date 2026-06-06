"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import * as Icons from "lucide-react";
import TooltipComponent from "../TooltipComponent/TooltipComponent.js";
import styles from "./ThemePickerComponent.module.css";

import { THEME_CATALOG, type ThemeCatalogEntry } from "../ThemeProvider/ThemeProvider.js";

/**
 * ThemePickerComponent — Dropup theme selector for sidebar footers.
 *
 * Displays the current theme as a trigger button. Clicking opens a dropup
 * popover with all available themes rendered as selectable buttons, each
 * showing a dual-color swatch (primary + secondary), icon, and label.
 */
interface ThemePickerProps {
  theme: string;
  themes?: string[];
  onSelectTheme: (theme: string) => void;
  collapsed?: boolean;
  className?: string;
  /** Dynamic metadata for custom user themes (overlays onto THEME_CATALOG) */
  customThemeMeta?: Record<string, ThemeCatalogEntry>;
}

export default function ThemePickerComponent({
  theme,
  themes = [],
  onSelectTheme,
  collapsed = false,
  className,
  customThemeMeta = {},
}: ThemePickerProps) {
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const popoverRef = useRef<HTMLDivElement | null>(null);
  const [popoverStyle, setPopoverStyle] = useState<React.CSSProperties>({});

  // Close on outside click (check both wrapper and popover — popover may be fixed-positioned outside wrapper)
  useEffect(() => {
    if (!open) return;
    const handleClick = (event: MouseEvent) => {
      const inWrapper = wrapperRef.current?.contains(event.target as Node);
      const inPopover = popoverRef.current?.contains(event.target as Node);
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
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
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
    (themeName: string) => {
      onSelectTheme?.(themeName);
      setOpen(false);
    },
    [onSelectTheme],
  );

  const DEFAULT_META: ThemeCatalogEntry = {
    label: "Theme", icon: "Palette",
    backgroundBase: "#222", backgroundSurface: "#333", backgroundElevated: "#444",
    primary: "#888", secondary: "#aaa", tertiary: "#666",
    textPrimary: "#eee", textSecondary: "#aaa", textMuted: "#666",
    borderColor: "#888",
    success: "#10b981", danger: "#ef4444", warning: "#f59e0b", info: "#3b82f6",
  };
  const currentMeta = THEME_CATALOG[theme] || customThemeMeta[theme] || DEFAULT_META;
  const CurrentIcon = (Icons as unknown as Record<string, React.ComponentType<{ size?: number; strokeWidth?: number; className?: string }>>)[currentMeta.icon] || Icons.Palette;

  const triggerButton = (
    <button
      ref={triggerRef}
      className={styles.trigger}
      onClick={() => setOpen((previous) => !previous)}
      title="Change theme"
      type="button"
    >
      <span className={styles['trigger-swatch-dual']}>
        <span className={styles['trigger-swatch-half']} style={{ background: currentMeta.primary }} />
        <span className={styles['trigger-swatch-half']} style={{ background: currentMeta.secondary }} />
      </span>
      <CurrentIcon size={18} strokeWidth={1.8} className={styles['trigger-icon']} />
      <span className={styles['trigger-label']}>{currentMeta.label}</span>
      <Icons.ChevronUp
        size={14}
        className={`${styles['trigger-chevron']} ${open ? styles['trigger-chevron-open'] : ""}`}
      />
    </button>
  );

  return (
    <div
      ref={wrapperRef}
      className={`${styles.wrapper} ${collapsed ? styles['is-collapsed-state'] : ""} ${className || ""}`}
    >
      {/* Trigger — wrap in tooltip when collapsed so user sees the theme label */}
      {collapsed ? (
        <TooltipComponent label={currentMeta.label} position="right" delay={200} disabled={open} className={styles['tooltip-fill']}>
          {triggerButton}
        </TooltipComponent>
      ) : (
        triggerButton
      )}

      {/* Dropup popover (uses fixed positioning when collapsed to escape overflow:hidden) */}
      {open && (
        <div
          ref={popoverRef}
          className={`${styles.popover} ${collapsed ? styles['popover-flyout'] : ""}`}
          style={collapsed ? popoverStyle : undefined}
        >
          <div className={styles['popover-header']}>Theme</div>
          <div className={styles['theme-list']}>
            {themes.map((themeName) => {
              const meta = THEME_CATALOG[themeName] || customThemeMeta[themeName] || DEFAULT_META;
              const ThemeIcon = (Icons as unknown as Record<string, React.ComponentType<{ size?: number; strokeWidth?: number; className?: string }>>)[meta.icon] || Icons.Palette;
              const isActive = themeName === theme;

              return (
                <button
                  key={themeName}
                  className={`${styles['theme-option']} ${isActive ? styles['is-active-state'] : ""}`}
                  onClick={() => handleSelect(themeName)}
                  type="button"
                  title={`Switch to ${meta.label} theme`}
                >
                  <span
                    className={styles['swatch-dual']}
                    style={{
                      boxShadow: isActive ? `0 0 8px ${meta.primary}88` : "none",
                    }}
                  >
                    <span className={styles['swatch-half']} style={{ background: meta.primary }} />
                    <span className={styles['swatch-half']} style={{ background: meta.secondary }} />
                    {isActive && <Icons.Check size={10} strokeWidth={3} className={styles['swatch-check']} />}
                  </span>
                  <ThemeIcon size={16} strokeWidth={1.8} className={styles['option-icon']} />
                  <span className={styles['option-label']}>{meta.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
