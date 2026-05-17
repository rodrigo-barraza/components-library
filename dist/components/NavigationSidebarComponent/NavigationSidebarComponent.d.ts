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
mobileOpen, // boolean — controls drawer visibility on mobile
onMobileClose, // function — called when drawer should close (scrim tap, nav click, Escape)
mobileBreakpoint, }: {
    brandIcon: any;
    brandLabel: any;
    items?: never[] | undefined;
    sections: any;
    activeItem: any;
    onNavigate: any;
    theme?: string | undefined;
    themes: any;
    setTheme: any;
    onToggleTheme: any;
    LinkComponent: any;
    collapsible?: boolean | undefined;
    defaultCollapsed?: boolean | undefined;
    storageKey: any;
    onCollapse: any;
    bottomActions: any;
    mobileOpen: any;
    onMobileClose: any;
    mobileBreakpoint?: number | undefined;
}): import("react/jsx-runtime").JSX.Element;
//# sourceMappingURL=NavigationSidebarComponent.d.ts.map