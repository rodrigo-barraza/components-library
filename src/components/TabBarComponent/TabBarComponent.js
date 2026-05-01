"use client";

import styles from "./TabBarComponent.module.css";
import { useComponents } from "../ComponentsProvider.js";
import SoundService from "../../services/SoundService.js";
import CountBadgeComponent from "../CountBadgeComponent/CountBadgeComponent.js";
import TooltipComponent from "../TooltipComponent/TooltipComponent.js";

/**
 * TabBarComponent — An inline tab switcher for sidebars/panels.
 *
 * @param {Array<{key: string, label?: string, icon?: React.ReactNode, badge?: number|string, badgeState?: "default"|"new", badgeDisabled?: boolean, badgeRainbow?: boolean, disabled?: boolean, tooltip?: string, tooltipDisabled?: boolean}>} tabs
 * @param {string} activeTab — The currently active tab key
 * @param {Function} onChange — (key: string) => void
 * @param {string} [className] — Additional class on the container
 * @param {Function} [onTabHover] — (key: string | null) => void, fired on mouseenter/mouseleave
 * @param {string[]} [glowingTabs] — Tab keys that should display a glow effect
 */
export default function TabBarComponent({
  tabs = [],
  activeTab,
  onChange,
  className,
  onTabHover,
  glowingTabs = [],
}) {
  const { sound } = useComponents();

  return (
    <div className={`${styles.tabBar}${className ? ` ${className}` : ""}`}>
      {tabs.map((tab) => {
        const button = (
          <button
            key={tab.key}
            className={`${styles.tab}${activeTab === tab.key ? ` ${styles.tabActive}` : ""}${tab.disabled ? ` ${styles.tabDisabled}` : ""}${glowingTabs.includes(tab.key) ? ` ${styles.tabGlow}` : ""}`}
            onClick={(e) => {
              if (sound) SoundService.playClick({ event: e });
              !tab.disabled && onChange(tab.key);
            }}
            onMouseEnter={(e) => {
              if (sound) SoundService.playHover({ event: e });
              onTabHover?.(tab.key);
            }}
            onMouseLeave={() => onTabHover?.(null)}
          >
            {tab.icon}
            {tab.label}
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
    </div>
  );
}

export { styles as tabBarStyles };
