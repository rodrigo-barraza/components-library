"use client";

import React, { useState, useEffect, useCallback, useMemo, useRef } from "react";
import * as Icons from "lucide-react";
import useMediaQuery from "../../hooks/useMediaQuery.js";
import TooltipComponent from "../TooltipComponent/TooltipComponent.js";
import ThemePickerComponent from "../ThemePickerComponent/ThemePickerComponent.js";
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
  icon?: string | React.ComponentType<{ size?: number; strokeWidth?: number; className?: string }>;
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
  mobileBreakpoint?: number;
}

export default function NavigationSidebarComponent({
  brandIcon, // string (url) or ReactNode
  brandLabel, // string
  items = [], // Array<{ id|key, label, href?, icon }> — flat nav (backward-compat)
  sections, // Array<{ label?, items[] }> — sectioned nav (takes precedence)
  activeItem, // matches id or key or href
  onNavigate, // function(id, item)
  theme = "light",
  themes, // string[] — ordered list of available theme names (enables ThemePicker dropup)
  setTheme, // function(theme: string) — set theme directly (used by ThemePicker)
  onToggleTheme, // function — legacy: cycle to next theme (still works if themes/setTheme not provided)
  LinkComponent, // Custom Next/Link component, falls back to native <a> if href exists, otherwise <button>
  collapsible = true,
  defaultCollapsed = false,
  storageKey, // string — localStorage key for persisting collapsed state (e.g. "ledger-nav-collapsed")
  onCollapse, // function(collapsed: boolean) — called when collapsed state changes
  bottomActions, // ReactNode for extra footer actions
  // ── Mobile drawer props ──────────────────────────────────────────
  mobileOpen, // boolean — controls drawer visibility on mobile
  onMobileClose, // function — called when drawer should close (scrim tap, nav click, Escape)
  mobileBreakpoint = 768, // number — viewport width below which drawer mode activates
}: NavigationSidebarProps) {
  const [collapsed, setCollapsed] = useState(defaultCollapsed);
  const [navReady, setNavReady] = useState(false);
  const sidebarReference = useRef<HTMLElement>(null);

  // ── Mobile detection ──────────────────────────────────────────────
  const isMobile = useMediaQuery(`(max-width: ${mobileBreakpoint}px)`);

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

  // ── Mobile: Escape key to close ───────────────────────────────────
  useEffect(() => {
    if (!isMobile || !mobileOpen || !onMobileClose) return;

    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.stopPropagation();
        onMobileClose();
      }
    };

    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [isMobile, mobileOpen, onMobileClose]);

  // ── Mobile: prevent body scroll when drawer is open ───────────────
  useEffect(() => {
    if (!isMobile || !mobileOpen) return;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMobile, mobileOpen]);

  // ── Programmatic contrast color for sidebar content ────────────
  useEffect(() => {
    const sidebarElement = sidebarReference.current;
    if (!sidebarElement) return;

    const computeAndApplyContrastColor = () => {
      const computedStyle = getComputedStyle(sidebarElement);
      const backgroundColorValue = computedStyle.backgroundColor;

      const rgbMatch = backgroundColorValue.match(
        /rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)/
      );
      if (!rgbMatch) return;

      const redChannel = parseInt(rgbMatch[1], 10);
      const greenChannel = parseInt(rgbMatch[2], 10);
      const blueChannel = parseInt(rgbMatch[3], 10);

      const toLinearComponent = (channelValue: number): number => {
        const normalizedValue = channelValue / 255;
        return normalizedValue <= 0.03928
          ? normalizedValue / 12.92
          : Math.pow((normalizedValue + 0.055) / 1.055, 2.4);
      };

      const relativeLuminance =
        0.2126 * toLinearComponent(redChannel) +
        0.7152 * toLinearComponent(greenChannel) +
        0.0722 * toLinearComponent(blueChannel);

      const isLightBackground = relativeLuminance > 0.179;

      sidebarElement.style.setProperty(
        "--sidebar-contrast-color",
        isLightBackground ? "rgba(0, 0, 0, 0.87)" : "rgba(255, 255, 255, 0.92)"
      );
      sidebarElement.style.setProperty(
        "--sidebar-contrast-color-muted",
        isLightBackground ? "rgba(0, 0, 0, 0.5)" : "rgba(255, 255, 255, 0.55)"
      );
    };

    computeAndApplyContrastColor();

    const mutationObserver = new MutationObserver(computeAndApplyContrastColor);
    mutationObserver.observe(sidebarElement, {
      attributes: true,
      attributeFilter: ["style", "class"],
    });

    // Also observe the document element for theme class changes
    const documentObserver = new MutationObserver(computeAndApplyContrastColor);
    documentObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class", "data-theme"],
    });

    return () => {
      mutationObserver.disconnect();
      documentObserver.disconnect();
    };
  }, []);

  // Resolve whether we use the new ThemePicker or fallback to legacy toggle
  const hasThemePicker = Boolean(themes?.length && setTheme);

  // Legacy: THEME_META for backward-compatible single-button toggle
  const THEME_META: Record<string, { nextLabel: string; NextIcon: React.ComponentType<{ size?: number; strokeWidth?: number; className?: string }>; title: string }> = {
    dark:     { nextLabel: "Light",    NextIcon: Icons.Sun,      title: "Switch to light mode" },
    light:    { nextLabel: "Tropical", NextIcon: Icons.Palmtree, title: "Switch to tropical mode" },
    tropical: { nextLabel: "Oceanic",  NextIcon: Icons.Waves,    title: "Switch to oceanic mode" },
    oceanic:  { nextLabel: "Punk",     NextIcon: Icons.Skull,    title: "Switch to punk mode" },
    punk:     { nextLabel: "Dark",     NextIcon: Icons.Moon,     title: "Switch to dark mode" },
  };
  const themeMeta = THEME_META[theme] || THEME_META.dark;

  // ── Render a single nav item ──────────────────────────────────
  const renderNavItem = (item: NavItem) => {
    const id = item.id || item.key;
    const IconComponent = typeof item.icon === "string"
      ? (Icons as unknown as Record<string, React.ComponentType<{ size?: number; strokeWidth?: number; className?: string }>>)[item.icon]
      : item.icon;

    // Active: matches provided activeItem ID or matches href path start
    const isActive = activeItem === id || (item.href && activeItem && activeItem.startsWith(item.href));

    const content = (
      <>
        {IconComponent && <IconComponent size={18} strokeWidth={1.8} className={styles.navigationIcon} />}
        <span className={styles.navigationLabel}>{item.label}</span>
        {isActive && <div className={styles.activeIndicator} />}
      </>
    );

    const linkProps = {
      className: `${styles.navigationItem} ${isActive ? styles.isActiveState : ""}`,
      onClick: () => {
        if (onNavigate && id) {
          onNavigate(id, item);
        }
        // Auto-close mobile drawer on navigation
        if (isMobile && onMobileClose) {
          onMobileClose();
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
          if (onNavigate && id) {
            e.preventDefault();
            onNavigate(id, item);
          }
          if (isMobile && onMobileClose) {
            onMobileClose();
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

    // On mobile, always show labels (no collapsed tooltips)
    const showTooltip = collapsible && !isMobile;

    return showTooltip ? (
      <TooltipComponent key={id || item.label} label={item.label} position="right" delay={200} disabled={!collapsed} className={styles.tooltipFill}>
        {LinkElement}
      </TooltipComponent>
    ) : (
      <React.Fragment key={id || item.label}>
        {LinkElement}
      </React.Fragment>
    );
  };

  // ── Determine wrapper classes ─────────────────────────────────────
  const wrapperClasses = [
    styles.wrapper,
    collapsed && !isMobile ? styles.isCollapsedState : "",
    !navReady ? styles.noTransition : "",
    isMobile ? styles.mobileWrapper : "",
    isMobile && mobileOpen ? styles.mobileOpen : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={wrapperClasses}>
      {/* ── Mobile scrim backdrop ── */}
      {isMobile && mobileOpen && (
        <div
          className={styles.mobileScrim}
          onClick={onMobileClose}
          aria-hidden="true"
        />
      )}

      <aside ref={sidebarReference} className={styles.sidebar}>
        
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

            {/* Desktop: collapse toggle | Mobile: close button */}
            {isMobile ? (
              <button className={styles.mobileCloseButton} onClick={onMobileClose} title="Close menu" aria-label="Close navigation menu">
                <Icons.X size={20} />
              </button>
            ) : collapsible ? (
              <button className={styles.collapseButton} onClick={toggleCollapse} title="Toggle Sidebar">
                <Icons.ChevronsLeft size={16} />
              </button>
            ) : null}
          </div>
        )}

        {/* Nav List */}
        <nav className={styles.navigationList}>
          {resolvedSections.map((section, sectionIdx) => (
            <React.Fragment key={section.label || sectionIdx}>
              {/* Section divider — only rendered when label is truthy */}
              {section.label && (
                <div className={styles.navigationDivider}>
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
          {themes?.length && setTheme ? (
            <ThemePickerComponent
              theme={theme}
              themes={themes}
              onSelectTheme={setTheme}
              collapsed={isMobile ? false : collapsed}
            />
          ) : onToggleTheme ? (
             <TooltipComponent label={themeMeta.nextLabel + " Mode"} position="right" delay={200} disabled={isMobile || !collapsed} className={styles.tooltipFill}>
              <button
                className={styles.themeToggle}
                onClick={onToggleTheme}
                title={themeMeta.title}
              >
                <themeMeta.NextIcon size={18} strokeWidth={1.8} className={styles.navigationIcon} />
                <span className={styles.themeLabel}>{themeMeta.nextLabel}</span>
              </button>
            </TooltipComponent>
          ) : null}
        </div>
      </aside>
    </div>
  );
}
