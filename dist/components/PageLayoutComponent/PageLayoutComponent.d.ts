/**
 * PageLayoutComponent — Unified page wrapper composing NavigationSidebar +
 * MobileHeader + main content area.
 *
 * Encapsulates the repeated pattern of sidebar + mobile drawer management
 * that was duplicated across iron-client and portal-client.
 *
 * @param {React.ReactNode}  children             — Page content
 * @param {string|React.ReactNode} brandIcon       — Brand icon (URL string or ReactNode)
 * @param {string}            brandLabel           — App name displayed in sidebar/mobile header
 * @param {Array}             [items]              — Flat nav items array (passed to NavigationSidebar)
 * @param {Array}             [sections]           — Sectioned nav items (passed to NavigationSidebar)
 * @param {string}            activeItem           — Current pathname for active highlighting
 * @param {string}            [storageKey]         — localStorage key for sidebar collapse state
 * @param {Function}          [LinkComponent]      — Custom Link component (e.g. Next.js Link)
 * @param {object}            [mainStyle]          — Inline style for the <main> element
 * @param {string}            [mainClassName]      — Additional class for the <main> element
 * @param {string}            [theme]              — Current theme name
 * @param {string[]}          [themes]             — Available theme names
 * @param {Function}          [setTheme]           — Theme setter
 * @param {React.ReactNode}   [bottomActions]      — Extra footer actions for the sidebar
 * @param {React.ReactNode}   [mobileHeaderActions] — Trailing actions for the mobile header
 * @param {number}            [mobileBreakpoint=768] — Viewport width below which drawer mode activates
 * @param {object}            [sidebarProps]       — Additional props passed to NavigationSidebarComponent
 */
export default function PageLayoutComponent({ children, brandIcon, brandLabel, items, sections, activeItem, storageKey, LinkComponent, mainStyle, mainClassName, theme, themes, setTheme, bottomActions, mobileHeaderActions, mobileBreakpoint, sidebarProps, }: {
    children: any;
    brandIcon: any;
    brandLabel: any;
    items: any;
    sections: any;
    activeItem: any;
    storageKey: any;
    LinkComponent: any;
    mainStyle: any;
    mainClassName: any;
    theme: any;
    themes: any;
    setTheme: any;
    bottomActions: any;
    mobileHeaderActions: any;
    mobileBreakpoint?: number | undefined;
    sidebarProps?: {} | undefined;
}): import("react/jsx-runtime").JSX.Element;
//# sourceMappingURL=PageLayoutComponent.d.ts.map