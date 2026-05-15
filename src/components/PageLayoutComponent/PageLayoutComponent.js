"use client";

import { useState } from "react";
import useMediaQuery from "../../hooks/useMediaQuery.js";
import MobileHeaderComponent from "../MobileHeaderComponent/MobileHeaderComponent.js";
import NavigationSidebarComponent from "../NavigationSidebarComponent/NavigationSidebarComponent.js";
import styles from "./PageLayoutComponent.module.css";

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
export default function PageLayoutComponent({
  children,
  brandIcon,
  brandLabel,
  items,
  sections,
  activeItem,
  storageKey,
  LinkComponent,
  mainStyle,
  mainClassName,
  theme,
  themes,
  setTheme,
  bottomActions,
  mobileHeaderActions,
  mobileBreakpoint = 768,
  sidebarProps = {},
}) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const isMobile = useMediaQuery(`(max-width: ${mobileBreakpoint}px)`);

  return (
    <div className="page-wrapper">
      <NavigationSidebarComponent
        brandIcon={brandIcon}
        brandLabel={brandLabel}
        items={items}
        sections={sections}
        activeItem={activeItem}
        theme={theme}
        themes={themes}
        setTheme={setTheme}
        LinkComponent={LinkComponent}
        storageKey={storageKey}
        bottomActions={bottomActions}
        mobileOpen={mobileOpen}
        onMobileClose={() => setMobileOpen(false)}
        mobileBreakpoint={mobileBreakpoint}
        {...sidebarProps}
      />

      <div className={styles.mainArea}>
        {/* Mobile-only top header bar */}
        {isMobile && (
          <MobileHeaderComponent
            brandIcon={brandIcon}
            brandLabel={brandLabel}
            onMenuClick={() => setMobileOpen(true)}
          >
            {mobileHeaderActions}
          </MobileHeaderComponent>
        )}

        <main
          className={`page-content ${mainClassName || ""}`}
          style={mainStyle}
        >
          {children}
        </main>
      </div>
    </div>
  );
}
