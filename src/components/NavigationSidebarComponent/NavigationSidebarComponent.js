"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import * as Icons from "lucide-react";
import TooltipComponent from "../TooltipComponent/TooltipComponent";
import styles from "./NavigationSidebarComponent.module.css";

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
 */
export default function NavigationSidebarComponent({
  brandIcon, // string (url) or ReactNode
  brandLabel, // string
  items = [], // Array<{ id|key, label, href?, icon }> — flat nav (backward-compat)
  sections, // Array<{ label?, items[] }> — sectioned nav (takes precedence)
  activeItem, // matches id or key or href
  onNavigate, // function(id, item)
  theme = "light",
  onToggleTheme,
  LinkComponent, // Custom Next/Link component, falls back to native <a> if href exists, otherwise <button>
  collapsible = true,
  defaultCollapsed = false,
  storageKey, // string — localStorage key for persisting collapsed state (e.g. "ledger-nav-collapsed")
  onCollapse, // function(collapsed: boolean) — called when collapsed state changes
  bottomActions, // ReactNode for extra footer actions
}) {
  const [collapsed, setCollapsed] = useState(defaultCollapsed);
  const [navReady, setNavReady] = useState(false);

  // Normalize to sections format — single unnamed section when using flat items
  const resolvedSections = useMemo(
    () => sections || [{ label: null, items }],
    [sections, items],
  );

  // Restore collapsed state from localStorage on mount
  useEffect(() => {
    if (!collapsible || !storageKey) return;
    try {
      const stored = localStorage.getItem(storageKey);
      if (stored !== null) {
        setCollapsed(stored === "true");
      }
    // eslint-disable-next-line no-empty
    } catch {}
    // Enable transitions after first paint (double-RAF prevents FOUC)
    requestAnimationFrame(() => {
      requestAnimationFrame(() => setNavReady(true));
    });
  }, [collapsible, storageKey]);

  // Fallback: enable transitions if no storageKey
  useEffect(() => {
    if (storageKey) return;
    requestAnimationFrame(() => {
      requestAnimationFrame(() => setNavReady(true));
    });
  }, [storageKey]);

  const toggleCollapse = useCallback(() => {
    setCollapsed((prev) => {
      const next = !prev;
      if (storageKey) {
        // eslint-disable-next-line no-empty
        try { localStorage.setItem(storageKey, String(next)); } catch {}
      }
      onCollapse?.(next);
      return next;
    });
  }, [storageKey, onCollapse]);

  const THEME_META = {
    dark:     { nextLabel: "Light",    NextIcon: Icons.Sun,      title: "Switch to light mode" },
    light:    { nextLabel: "Tropical", NextIcon: Icons.Palmtree, title: "Switch to tropical mode" },
    tropical: { nextLabel: "Oceanic",  NextIcon: Icons.Waves,    title: "Switch to oceanic mode" },
    oceanic:  { nextLabel: "Dark",     NextIcon: Icons.Moon,     title: "Switch to dark mode" },
  };
  const themeMeta = THEME_META[theme] || THEME_META.dark;

  // ── Render a single nav item ──────────────────────────────────
  const renderNavItem = (item) => {
    const id = item.id || item.key;
    const IconComponent = typeof item.icon === "string" ? Icons[item.icon] : item.icon;

    // Active: matches provided activeItem ID or matches href path start
    const isActive = activeItem === id || (item.href && activeItem && activeItem.startsWith(item.href));

    const content = (
      <>
        {IconComponent && <IconComponent size={18} strokeWidth={1.8} className={styles.navIcon} />}
        <span className={styles.navLabel}>{item.label}</span>
        {isActive && <div className={styles.activeIndicator} />}
      </>
    );

    const linkProps = {
      className: `${styles.navItem} ${isActive ? styles.active : ""}`,
      onClick: () => {
        if (onNavigate) {
          onNavigate(id, item);
        }
      },
    };

    let LinkElement;
    if (LinkComponent && item.href) {
      LinkElement = (
        <LinkComponent href={item.href} {...linkProps}>
          {content}
        </LinkComponent>
      );
    } else if (item.href) {
      LinkElement = (
        <a href={item.href} {...linkProps} onClick={(e) => {
          if (onNavigate) {
            e.preventDefault();
            onNavigate(id, item);
          }
        }}>
          {content}
        </a>
      );
    } else {
      LinkElement = (
        <button type="button" {...linkProps}>
          {content}
        </button>
      );
    }

    return collapsible ? (
      <TooltipComponent key={id} label={item.label} position="right" delay={200} disabled={!collapsed} className={styles.tooltipFill}>
        {LinkElement}
      </TooltipComponent>
    ) : (
      <React.Fragment key={id}>
        {LinkElement}
      </React.Fragment>
    );
  };

  return (
    <div className={`${styles.wrapper} ${collapsed ? styles.collapsed : ""} ${!navReady ? styles.noTransition : ""}`}>
      <aside className={styles.sidebar}>
        
        {/* Brand */}
        {(brandIcon || brandLabel) && (
          <div className={styles.brand}>
            {typeof brandIcon === "string" ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={brandIcon} alt={brandLabel || "Brand"} className={styles.brandIconImg} />
            ) : brandIcon ? (
              <div className={styles.brandIconNode}>{brandIcon}</div>
            ) : null}
            {brandLabel && <span className={styles.brandLabel}>{brandLabel}</span>}
            {collapsible && (
              <button className={styles.collapseBtn} onClick={toggleCollapse} title="Toggle Sidebar">
                <Icons.ChevronsLeft size={16} />
              </button>
            )}
          </div>
        )}

        {/* Nav List */}
        <nav className={styles.navList}>
          {resolvedSections.map((section, sectionIdx) => (
            <React.Fragment key={section.label || sectionIdx}>
              {/* Section divider — only rendered when label is truthy */}
              {section.label && (
                <div className={styles.navDivider}>
                  <span>{section.label}</span>
                </div>
              )}
              {section.items.map(renderNavItem)}
            </React.Fragment>
          ))}
        </nav>

        {/* Bottom Actions */}
        <div className={styles.bottomActions}>
          {bottomActions}
          {onToggleTheme && (
             <TooltipComponent label={themeMeta.nextLabel + " Mode"} position="right" delay={200} disabled={!collapsed} className={styles.tooltipFill}>
              <button
                className={styles.themeToggle}
                onClick={onToggleTheme}
                title={themeMeta.title}
              >
                <themeMeta.NextIcon size={18} strokeWidth={1.8} className={styles.navIcon} />
                <span className={styles.themeLabel}>{themeMeta.nextLabel}</span>
              </button>
            </TooltipComponent>
          )}
        </div>
      </aside>
    </div>
  );
}
