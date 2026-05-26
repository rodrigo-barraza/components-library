import { useCallback, useRef, useEffect, useState, isValidElement, ReactNode, ElementType, KeyboardEvent } from "react";
import * as Icons from "lucide-react";
import TooltipComponent from "../TooltipComponent/TooltipComponent.js";
import BadgeComponent from "../BadgeComponent/BadgeComponent.js";
import styles from "./NavigationRailComponent.module.css";

export type NavigationRailIcon = string | React.ComponentType<{ size?: number; strokeWidth?: number; className?: string }> | React.ReactElement;

export interface NavigationRailItem {
  id?: string;
  key?: string;
  label?: string;
  icon?: NavigationRailIcon;
  badge?: string | number | ReactNode;
  badgeVariant?: "success" | "info" | "warning" | "error" | string;
  href?: string;
}

export interface NavigationRailComponentProps {
  items?: NavigationRailItem[];
  activeItem?: string;
  onNavigate?: (id: string, item: NavigationRailItem) => void;
  fab?: ReactNode;
  menuIcon?: ReactNode;
  alignment?: "top" | "center" | "bottom" | string;
  labelsHidden?: boolean;
  bottomSlot?: ReactNode;
  LinkComponent?: ElementType;
  className?: string;
  ariaLabel?: string;
}

/**
 * NavigationRailComponent — M3 Navigation Rail
 *
 * A vertical bar for switching between 3–7 primary destinations on
 * mid-to-large viewports. Follows Material Design 3 specifications:
 *
 * - Fixed 80px width with vertically stacked icon+label destinations
 * - Active indicator pill (56×32) using secondaryContainer color
 * - Optional FAB slot above destinations
 * - Optional menu/hamburger icon at the top
 * - Keyboard navigation: ArrowUp/Down cycles, Home/End jumps
 * - Full ARIA: role="navigation", tablist pattern on destinations
 */
export default function NavigationRailComponent({
  items = [],
  activeItem,
  onNavigate,
  fab,
  menuIcon,
  alignment = "top",
  labelsHidden = false,
  bottomSlot,
  LinkComponent,
  className = "",
  ariaLabel = "Main navigation",
}: NavigationRailComponentProps) {
  const destinationsRef = useRef<HTMLDivElement | null>(null);
  const [focusedIndex, setFocusedIndex] = useState(-1);

  // Resolve a Lucide icon from string name, React component, or rendered JSX element
  const resolveIcon = useCallback((icon: NavigationRailIcon | undefined) => {
    if (!icon) return null;
    // Already a rendered React element — pass through directly
    if (isValidElement(icon)) return { element: icon };
    // String lookup in lucide-react
    if (typeof icon === "string") {
      const Comp = (Icons as unknown as Record<string, React.ComponentType<{ size?: number; strokeWidth?: number; className?: string }>>)[icon] || null;
      return Comp ? { Component: Comp } : null;
    }
    // Component reference (function or class)
    return { Component: icon };
  }, []);

  // Keyboard navigation within the destination group
  const handleKeyDown = useCallback(
    (event: KeyboardEvent<HTMLDivElement>) => {
      if (!destinationsRef.current) return;
      const buttons = destinationsRef.current.querySelectorAll<HTMLElement>(
        `[data-rail-destination]`
      );
      if (!buttons.length) return;

      let nextIndex = focusedIndex;

      switch (event.key) {
        case "ArrowDown":
          event.preventDefault();
          nextIndex = (focusedIndex + 1) % buttons.length;
          break;
        case "ArrowUp":
          event.preventDefault();
          nextIndex =
            focusedIndex <= 0 ? buttons.length - 1 : focusedIndex - 1;
          break;
        case "Home":
          event.preventDefault();
          nextIndex = 0;
          break;
        case "End":
          event.preventDefault();
          nextIndex = buttons.length - 1;
          break;
        default:
          return;
      }

      setFocusedIndex(nextIndex);
      buttons[nextIndex]?.focus();
    },
    [focusedIndex]
  );

  // Sync focusedIndex when active item changes externally
  useEffect(() => {
    if (!activeItem) return;
    const index = items.findIndex(
      (it) => (it.id || it.key) === activeItem
    );
    if (index !== -1) setFocusedIndex(index);
  }, [activeItem, items]);

  return (
    <nav
      className={`${styles.rail} ${className}`}
      aria-label={ariaLabel}
    >
      {/* ── Menu icon (optional) ── */}
      {menuIcon && (
        <div className={styles.menuSlot}>{menuIcon}</div>
      )}

      {/* ── FAB slot (optional) ── */}
      {fab && <div className={styles.fabSlot}>{fab}</div>}

      {/* ── Destinations ── */}
      <div
        ref={destinationsRef}
        className={`${styles.destinations} ${styles[`align-${alignment}`]}`}
        role="tablist"
        aria-orientation="vertical"
        onKeyDown={handleKeyDown}
      >
        {items.map((item, index) => {
          const id = item.id || item.key;
          const resolvedIcon = resolveIcon(item.icon);
          const isActive = activeItem === id;

          const handleClick = () => {
            setFocusedIndex(index);
            if (id) {
              onNavigate?.(id, item);
            }
          };

          const destinationContent = (
            <div className={styles.destinationInner}>
              {/* Active indicator pill */}
              <span
                className={`${styles.indicatorPill} ${isActive ? styles.indicatorActive : ""}`}
                aria-hidden="true"
              >
                {/* State layer for hover/focus/press */}
                <span className={styles.stateLayer} />
                {resolvedIcon?.element ? (
                  <span className={styles.icon}>{resolvedIcon.element}</span>
                ) : resolvedIcon?.Component ? (
                  <resolvedIcon.Component
                    size={24}
                    strokeWidth={isActive ? 2 : 1.6}
                    className={styles.icon}
                  />
                ) : null}
                {/* Badge overlay */}
                {item.badge != null && (
                  <span className={styles.badgeOverlay}>
                    {typeof item.badge === "number" || typeof item.badge === "string" ? (
                      <BadgeComponent variant={item.badgeVariant || "error"} mini>
                        {item.badge}
                      </BadgeComponent>
                    ) : (
                      <span className={styles.badgeDot} />
                    )}
                  </span>
                )}
              </span>

              {/* Label */}
              {!labelsHidden && (
                <span
                  className={`${styles.label} ${isActive ? styles.labelActive : ""}`}
                >
                  {item.label}
                </span>
              )}
            </div>
          );

          // Common props for the interactive element
          const elProps = {
            "data-rail-destination": "",
            className: `${styles.destination} ${isActive ? styles.isActiveState : ""}`,
            role: "tab",
            "aria-selected": isActive,
            tabIndex: focusedIndex === index ? 0 : -1,
            onClick: handleClick,
          };

          // Render as Link, anchor, or button
          let element;
          if (LinkComponent && item.href) {
            element = (
              <LinkComponent href={item.href} {...elProps}>
                {destinationContent}
              </LinkComponent>
            );
          } else if (item.href) {
            element = (
              <a
                href={item.href}
                {...elProps}
                onClick={(event) => {
                  if (onNavigate) {
                    event.preventDefault();
                    handleClick();
                  }
                }}
              >
                {destinationContent}
              </a>
            );
          } else {
            element = (
              <button type="button" {...elProps}>
                {destinationContent}
              </button>
            );
          }

          return (
            <TooltipComponent
              key={id || index}
              label={item.label}
              position="right"
              delay={400}
              disabled={!labelsHidden}
              className={styles.destinationWrapper}
            >
              {element}
            </TooltipComponent>
          );
        })}
      </div>

      {/* ── Bottom slot (optional) ── */}
      {bottomSlot && (
        <div className={styles.bottomSlot}>{bottomSlot}</div>
      )}
    </nav>
  );
}
