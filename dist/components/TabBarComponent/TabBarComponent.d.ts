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
export default function TabBarComponent({ tabs, activeTab, onChange, variant, layout, scrollable, className, onTabHover, glowingTabs, ariaLabel, }: {
    tabs?: never[] | undefined;
    activeTab: any;
    onChange: any;
    variant?: string | undefined;
    layout?: string | undefined;
    scrollable?: boolean | undefined;
    className: any;
    onTabHover: any;
    glowingTabs?: never[] | undefined;
    ariaLabel: any;
}): import("react/jsx-runtime").JSX.Element;
export { styles as tabBarStyles };
//# sourceMappingURL=TabBarComponent.d.ts.map