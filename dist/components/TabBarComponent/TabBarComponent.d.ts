import styles from "./TabBarComponent.module.css";
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
export default function TabBarComponent({ tabs, activeTab, onChange, variant, layout, scrollable, className, onTabHover, glowingTabs, ariaLabel, }: TabBarComponentProps): import("react").JSX.Element;
export { styles as tabBarStyles };
//# sourceMappingURL=TabBarComponent.d.ts.map