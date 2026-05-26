"use client";

import { useRef, useEffect, useCallback } from "react";
import styles from "./TabBarComponent.module.css";
import { useComponents } from "../ComponentsProvider.js";
import SoundService from "../../services/SoundService.js";
import BadgeComponent from "../BadgeComponent/BadgeComponent.js";
import TooltipComponent from "../TooltipComponent/TooltipComponent.js";

/**
 * TabBarComponent — M3 Tabs
 *
 * Material Design 3 compliant tab bar with sliding active indicator,
 * state layers, and full ARIA tablist/tab keyboard navigation.
 *
 * Variants:
 *   • "primary"   — Full-width active indicator, on-surface active text
 *   • "secondary" — Shorter indicator, secondary coloring
 *
 * Layouts:
 *   • "inline"  — Icon + label side-by-side (default, 48px height)
 *   • "stacked" — Icon above label (64px height)
 *
 * }>} tabs
  */
export interface TabBarTab {
  key: string;
  label?: string;
  icon?: React.ReactNode;
  disabled?: boolean;
  badge?: number | string;
  badgeState?: "default" | "success" | "warning" | "error" | "info" | "brand" | string;
  badgeDisabled?: boolean;
  badgeRainbow?: boolean;
  tooltip?: string;
  tooltipDisabled?: boolean;
}

export interface TabBarComponentProps {
  tabs?: TabBarTab[];
  activeTab: string;
  onChange: (key: string) => void;
  variant?: "primary" | "secondary";
  layout?: "inline" | "stacked";
  scrollable?: boolean;
  className?: string;
  onTabHover?: (key: string | null) => void;
  glowingTabs?: string[];
  ariaLabel?: string;
}

export default function TabBarComponent({
  tabs = [],
  activeTab,
  onChange,
  variant = "primary",
  layout = "inline",
  scrollable = false,
  className,
  onTabHover,
  glowingTabs = [],
  ariaLabel,
}: TabBarComponentProps) {
  const { sound } = useComponents();
  const tabListRef = useRef<HTMLDivElement | null>(null);
  const indicatorRef = useRef<HTMLSpanElement | null>(null);
  const tabRefs = useRef<Record<string, HTMLButtonElement | null>>({});

  // ── Sliding indicator position calculation ───────────────
  const updateIndicator = useCallback(() => {
    const list = tabListRef.current;
    const indicator = indicatorRef.current;
    const activeEl = tabRefs.current[activeTab];

    if (!list || !indicator || !activeEl) {
      if (indicator) indicator.style.opacity = "0";
      return;
    }

    const listRect = list.getBoundingClientRect();
    const tabRect = activeEl.getBoundingClientRect();

    const left = tabRect.left - listRect.left + list.scrollLeft;
    const top = tabRect.top - listRect.top + list.scrollTop + tabRect.height - 3;
    const width = tabRect.width;

    indicator.style.opacity = "1";
    indicator.style.width = `${width}px`;
    indicator.style.transform = `translate(${left}px, ${top}px)`;
  }, [activeTab]);

  useEffect(() => {
    updateIndicator();
  }, [activeTab, tabs, updateIndicator]);

  // Recalculate on resize
  useEffect(() => {
    const observer = new ResizeObserver(updateIndicator);
    if (tabListRef.current) observer.observe(tabListRef.current);
    return () => observer.disconnect();
  }, [updateIndicator]);

  // ── Keyboard navigation (Arrow Left/Right, Home, End) ───
  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    const enabledTabs = tabs.filter((tab) => !tab.disabled);
    const currentIdx = enabledTabs.findIndex((tab) => tab.key === activeTab);

    let nextIdx = -1;

    switch (event.key) {
      case "ArrowRight":
      case "ArrowDown":
        event.preventDefault();
        nextIdx = (currentIdx + 1) % enabledTabs.length;
        break;
      case "ArrowLeft":
      case "ArrowUp":
        event.preventDefault();
        nextIdx =
          (currentIdx - 1 + enabledTabs.length) % enabledTabs.length;
        break;
      case "Home":
        event.preventDefault();
        nextIdx = 0;
        break;
      case "End":
        event.preventDefault();
        nextIdx = enabledTabs.length - 1;
        break;
      default:
        return;
    }

    if (nextIdx >= 0) {
      const nextTab = enabledTabs[nextIdx];
      onChange(nextTab.key);
      tabRefs.current[nextTab.key]?.focus();
    }
  };

  // ── Ripple coordinate capture ───────────────────────────
  const captureRipple = (event: React.MouseEvent<HTMLButtonElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * 100;
    const y = ((event.clientY - rect.top) / rect.height) * 100;
    event.currentTarget.style.setProperty("--ripple-x", `${x}%`);
    event.currentTarget.style.setProperty("--ripple-y", `${y}%`);
  };

  const isStacked = layout === "stacked";
  const isSecondary = variant === "secondary";

  const containerClasses = [
    styles['tab-bar'],
    isSecondary && styles['tab-bar-secondary'],
    scrollable && styles['tab-bar-scrollable'],
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div
      ref={tabListRef}
      className={containerClasses}
      role="tablist"
      aria-label={ariaLabel}
      onKeyDown={handleKeyDown}
    >
      {tabs.map((tab) => {
        const isActive = activeTab === tab.key;
        const hasIcon = !!tab.icon;

        const tabClasses = [
          styles.tab,
          isActive && styles['tab-active'],
          tab.disabled && styles['tab-disabled'],
          glowingTabs.includes(tab.key) && styles['tab-glow'],
          hasIcon && isStacked && styles['tab-stacked'],
        ]
          .filter(Boolean)
          .join(" ");

        const button = (
          <button
            key={tab.key}
            ref={(element) => {
              tabRefs.current[tab.key] = element;
            }}
            className={tabClasses}
            role="tab"
            id={`tab-${tab.key}`}
            aria-selected={isActive}
            aria-disabled={tab.disabled || undefined}
            aria-controls={`tabpanel-${tab.key}`}
            tabIndex={isActive ? 0 : -1}
            onMouseDown={captureRipple}
            onClick={(event) => {
              if (sound) SoundService.playClick({ event });
              if (!tab.disabled) onChange(tab.key);
            }}
            onMouseEnter={(event) => {
              if (sound) SoundService.playHover({ event });
              onTabHover?.(tab.key);
            }}
            onMouseLeave={() => onTabHover?.(null)}
          >
            {tab.icon}
            {tab.label && <span>{tab.label}</span>}
            {tab.badge != null && (
              <BadgeComponent
                type="count"
                count={tab.badge}
                state={tab.badgeState || "default"}
                disabled={tab.badgeDisabled}
                rainbow={tab.badgeRainbow}
                className={styles['tab-badge']}
              />
            )}
          </button>
        );

        if (tab.tooltip) {
          return (
            <TooltipComponent
              key={tab.key}
              label={tab.tooltip}
              position="bottom"
              delay={400}
              className={`${styles['tooltip-wrapper']}${isActive ? ` ${styles['tooltip-wrapper-active']}` : ""}`}
              disabled={tab.tooltipDisabled}
            >
              {button}
            </TooltipComponent>
          );
        }

        return button;
      })}

      {/* M3 sliding active indicator — GPU accelerated */}
      <span
        ref={indicatorRef}
        className={`${styles.indicator}${isSecondary ? ` ${styles['indicator-secondary']}` : ""}`}
        aria-hidden="true"
        style={{ opacity: 0 }}
      />
    </div>
  );
}

export { styles as tabBarStyles };
