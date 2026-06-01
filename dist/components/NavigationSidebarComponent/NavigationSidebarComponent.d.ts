import React from "react";
/**
 * Generic Navigation Sidebar Component
 *
 * Supports two data shapes for navigation items:
 *
 * 1. **Flat** (`items` prop) — backward-compatible flat array of nav items.
 *    ```
 *    items={[{ id, label, href?, icon }]}
 *    ```
 *
 * 2. **Sectioned** (`sections` prop) — grouped items with optional divider labels,
 *    matching the same pattern used in prism-client's sidebar.
 *    ```
 *    sections={[{ label: "Group", items: [{ id, label, href?, icon }] }]}
 *    ```
 *
 * When both are provided, `sections` takes precedence.
 *
 * Additional features: collapsed state with localStorage persistence, theming,
 * custom link components, and icon strings resolved from lucide-react.
 *
 * **Mobile Responsive:** On viewports ≤ mobileBreakpoint, the sidebar renders as
 * a slide-over drawer with a scrim backdrop. Controlled by `mobileOpen` /
 * `onMobileClose` props.
 */
interface NavItem {
    id?: string;
    key?: string;
    label: string;
    href?: string;
    icon?: string | React.ComponentType<{
        size?: number;
        strokeWidth?: number;
        className?: string;
    }>;
}
interface NavSection {
    label?: string | null;
    items: NavItem[];
}
interface NavigationSidebarProps {
    brandIcon?: React.ReactNode;
    brandLabel?: string;
    items?: NavItem[];
    sections?: NavSection[];
    activeItem?: string;
    onNavigate?: (id: string, item: NavItem) => void;
    theme?: string;
    themes?: string[];
    setTheme?: (theme: string) => void;
    onToggleTheme?: () => void;
    LinkComponent?: React.ElementType;
    collapsible?: boolean;
    defaultCollapsed?: boolean;
    storageKey?: string;
    onCollapse?: (collapsed: boolean) => void;
    bottomActions?: React.ReactNode;
    mobileOpen?: boolean;
    onMobileClose?: () => void;
    onMobileOpen?: () => void;
    showMobileHamburger?: boolean;
    mobileBreakpoint?: number;
}
export default function NavigationSidebarComponent({ brandIcon, // string (url) or ReactNode
brandLabel, // string
items, // Array<{ id|key, label, href?, icon }> — flat nav (backward-compat)
sections, // Array<{ label?, items[] }> — sectioned nav (takes precedence)
activeItem, // matches id or key or href
onNavigate, // function(id, item)
theme, themes, // string[] — ordered list of available theme names (enables ThemePicker dropup)
setTheme, // function(theme: string) — set theme directly (used by ThemePicker)
onToggleTheme, // function — legacy: cycle to next theme (still works if themes/setTheme not provided)
LinkComponent, // Custom Next/Link component, falls back to native <a> if href exists, otherwise <button>
collapsible, defaultCollapsed, storageKey, // string — localStorage key for persisting collapsed state (e.g. "ledger-nav-collapsed")
onCollapse, // function(collapsed: boolean) — called when collapsed state changes
bottomActions, // ReactNode for extra footer actions
mobileOpen: externalMobileOpen, // boolean — external control for drawer visibility on mobile
onMobileClose: externalOnMobileClose, // function — external close handler
onMobileOpen: externalOnMobileOpen, // function — external open handler
showMobileHamburger, // boolean — render built-in floating hamburger FAB on mobile
mobileBreakpoint, }: NavigationSidebarProps): import("react/jsx-runtime").JSX.Element;
export {};
//# sourceMappingURL=NavigationSidebarComponent.d.ts.map