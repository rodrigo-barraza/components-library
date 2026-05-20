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
