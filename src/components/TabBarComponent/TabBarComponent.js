"use client";

import { useRef, useEffect, useCallback } from "react";
import styles from "./TabBarComponent.module.css";
import { useComponents } from "../ComponentsProvider.js";
import SoundService from "../../services/SoundService.js";
import CountBadgeComponent from "../CountBadgeComponent/CountBadgeComponent.js";
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
 * @param {Array<{
 *   key: string,
 *   label?: string,
 *   icon?: React.ReactNode,
 *   badge?: number|string,
 *   badgeState?: "default"|"new",
 *   badgeDisabled?: boolean,
 *   badgeRainbow?: boolean,
 *   disabled?: boolean,
 *   tooltip?: string,
 *   tooltipDisabled?: boolean
 * }>} tabs
 * @param {string}                    activeTab    — Currently active tab key
 * @param {Function}                  onChange     — (key: string) => void
 * @param {"primary"|"secondary"}     [variant]    — M3 variant (default: "primary")
 * @param {"inline"|"stacked"}        [layout]     — Icon/label arrangement (default: "inline")
 * @param {boolean}                   [scrollable] — Allow horizontal scrolling for many tabs
 * @param {string}                    [className]  — Additional class on the container
 * @param {Function}                  [onTabHover] — (key: string | null) => void
 * @param {string[]}                  [glowingTabs] — Tab keys that glow
 * @param {string}                    [ariaLabel]  — Accessible label for the tablist
 */
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
}) {
  const { sound } = useComponents();
  const tabListRef = useRef(null);
  const indicatorRef = useRef(null);
  const tabRefs = useRef({});

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
    const width = tabRect.width;

    indicator.style.opacity = "1";
    indicator.style.width = `${width}px`;
    indicator.style.transform = `translateX(${left}px)`;
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
  const handleKeyDown = (e) => {
    const enabledTabs = tabs.filter((t) => !t.disabled);
    const currentIdx = enabledTabs.findIndex((t) => t.key === activeTab);

    let nextIdx = -1;

    switch (e.key) {
      case "ArrowRight":
      case "ArrowDown":
        e.preventDefault();
        nextIdx = (currentIdx + 1) % enabledTabs.length;
        break;
      case "ArrowLeft":
      case "ArrowUp":
        e.preventDefault();
        nextIdx =
          (currentIdx - 1 + enabledTabs.length) % enabledTabs.length;
        break;
      case "Home":
        e.preventDefault();
        nextIdx = 0;
        break;
      case "End":
        e.preventDefault();
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
  const captureRipple = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    e.currentTarget.style.setProperty("--ripple-x", `${x}%`);
    e.currentTarget.style.setProperty("--ripple-y", `${y}%`);
  };

  // ── Build container classes ─────────────────────────────
  const isStacked = layout === "stacked";
  const isSecondary = variant === "secondary";

  const containerClasses = [
    styles.tabBar,
    isSecondary && styles.tabBarSecondary,
    scrollable && styles.tabBarScrollable,
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
          isActive && styles.tabActive,
          tab.disabled && styles.tabDisabled,
          glowingTabs.includes(tab.key) && styles.tabGlow,
          hasIcon && isStacked && styles.tabStacked,
        ]
          .filter(Boolean)
          .join(" ");

        const button = (
          <button
            key={tab.key}
            ref={(el) => {
              tabRefs.current[tab.key] = el;
            }}
            className={tabClasses}
            role="tab"
            id={`tab-${tab.key}`}
            aria-selected={isActive}
            aria-disabled={tab.disabled || undefined}
            aria-controls={`tabpanel-${tab.key}`}
            tabIndex={isActive ? 0 : -1}
            onMouseDown={captureRipple}
            onClick={(e) => {
              if (sound) SoundService.playClick({ event: e });
              if (!tab.disabled) onChange(tab.key);
            }}
            onMouseEnter={(e) => {
              if (sound) SoundService.playHover({ event: e });
              onTabHover?.(tab.key);
            }}
            onMouseLeave={() => onTabHover?.(null)}
          >
            {tab.icon}
            {tab.label && <span>{tab.label}</span>}
            {tab.badge != null && (
              <CountBadgeComponent
                count={tab.badge}
                state={tab.badgeState || "default"}
                disabled={tab.badgeDisabled}
                rainbow={tab.badgeRainbow}
                className={styles.tabBadge}
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
              className={styles.tooltipWrapper}
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
        className={`${styles.indicator}${isSecondary ? ` ${styles.indicatorSecondary}` : ""}`}
        aria-hidden="true"
        style={{ opacity: 0 }}
      />
    </div>
  );
}

export { styles as tabBarStyles };
