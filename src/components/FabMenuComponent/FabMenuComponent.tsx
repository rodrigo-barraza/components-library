"use client";

import {
  forwardRef,
  useCallback,
  useEffect,
  useRef,
  useState,
  type MouseEvent,
  type KeyboardEvent,
} from "react";
import styles from "./FabMenuComponent.module.css";
import { useComponents } from "../ComponentsProvider.js";
import SoundService from "../../services/SoundService.js";

interface FabMenuItemConfig {
  icon?: React.ComponentType<{ size: number }>;
  label?: string;
  ariaLabel?: string;
  onClick?: (event: MouseEvent<HTMLButtonElement>) => void;
}

export interface FabMenuComponentProps extends React.HTMLAttributes<HTMLDivElement> {
  items?: FabMenuItemConfig[];
  icon?: React.ComponentType<{ size: number }>;
  closeIcon?: React.ComponentType<{ size: number }>;
  variant?: "primary" | "secondary" | "tertiary" | "surface";
  fixed?: boolean;
  showScrim?: boolean;
  disabled?: boolean;
  ariaLabel?: string;
}

/**
 * FabMenuComponent — Material Design 3 FAB Menu (Speed Dial).
 *
 * A FAB that reveals 3–6 related actions when activated. The menu items
 * fan out vertically above the trigger, each rendered as a small FAB
 * with an optional text label. A scrim overlay dims background content.
 *
 * M3 Specs: https://m3.material.io/components/fab-menu/specs
 *
 * Anatomy:
 *   scrim → container → items-list → [ item (label + small-fab) ] → trigger-fab
 *
 * Accessibility (per M3 guidelines):
 *   • Trigger has `aria-expanded` and `aria-haspopup="menu"`
 *   • Menu items are `role="menuitem"` inside `role="menu"`
 *   • Arrow-key navigation within menu items
 *   • Escape closes the menu and returns focus to trigger
 *   • Focus is trapped within the menu when open
 *   • Screen-reader announcements via `aria-label`
 *


 *   Icon for the trigger FAB. Defaults to a "+" shape if omitted.

 *   Icon displayed when menu is open. If omitted, the trigger icon
 *   rotates 45° (M3 default close affordance).

 *   Color variant for the trigger FAB.

 *   Fixes the FAB menu to the bottom-right viewport corner.

 *   Whether to show the scrim overlay when the menu is open.


 *   Accessible label for the trigger button.


 */
const FabMenuComponent = forwardRef<HTMLDivElement, FabMenuComponentProps>(function FabMenuComponent(
  {
    items = [],
    icon: TriggerIcon,
    closeIcon: CloseIcon,
    variant = "primary",
    fixed = false,
    showScrim = true,
    disabled = false,
    ariaLabel = "Actions menu",
    className = "",
    ...rest
  },
  ref,
) {
  const { sound } = useComponents();
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const itemRefs = useRef<(HTMLButtonElement | null)[]>([]);

  // ── Merge refs ────────────────────────────────────────
  const setContainerRef = useCallback(
    (node: HTMLDivElement | null) => {
      containerRef.current = node;
      if (typeof ref === "function") ref(node);
      else if (ref) (ref as React.MutableRefObject<HTMLDivElement | null>).current = node;
    },
    [ref],
  );

  // ── Toggle ────────────────────────────────────────────
  const toggle = useCallback(() => {
    setIsOpen((prev) => !prev);
  }, []);

  const close = useCallback(() => {
    setIsOpen(false);
    // Return focus to trigger (M3 a11y requirement)
    triggerRef.current?.focus();
  }, []);

  // ── Ripple on trigger ─────────────────────────────────
  const handleRipple = useCallback((event: MouseEvent<HTMLButtonElement>) => {
    const element = triggerRef.current;
    if (!element) return;

    const rect = element.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = event.clientX - rect.left - size / 2;
    const y = event.clientY - rect.top - size / 2;

    const ripple = document.createElement("span");
    ripple.className = styles.ripple;
    ripple.style.width = `${size}px`;
    ripple.style.height = `${size}px`;
    ripple.style.left = `${x}px`;
    ripple.style.top = `${y}px`;

    element.appendChild(ripple);
    ripple.addEventListener("animationend", () => ripple.remove(), {
      once: true,
    });
  }, []);

  // ── Handle trigger click ──────────────────────────────
  const handleTriggerClick = useCallback(
    (event: MouseEvent<HTMLButtonElement>) => {
      if (sound) SoundService.playClickButton({ event });
      handleRipple(event);
      toggle();
    },
    [sound, handleRipple, toggle],
  );

  // ── Handle item click ─────────────────────────────────
  const handleItemClick = useCallback(
    (event: MouseEvent<HTMLButtonElement>, item: FabMenuItemConfig) => {
      if (sound) SoundService.playClickButton({ event });
      item.onClick?.(event);
      close();
    },
    [sound, close],
  );

  // ── Keyboard navigation (M3 a11y spec) ────────────────
  const handleKeyDown = useCallback(
    (event: KeyboardEvent<HTMLDivElement>) => {
      if (!isOpen) return;

      const focusableItems = itemRefs.current.filter((el): el is HTMLButtonElement => el !== null);
      const currentIndex = focusableItems.indexOf(document.activeElement as HTMLButtonElement);

      switch (event.key) {
        case "Escape":
          event.preventDefault();
          close();
          break;

        case "ArrowUp": {
          event.preventDefault();
          // Items are in column-reverse, so "up" visually is next index
          const nextIdx =
            currentIndex < focusableItems.length - 1
              ? currentIndex + 1
              : 0;
          focusableItems[nextIdx]?.focus();
          break;
        }

        case "ArrowDown": {
          event.preventDefault();
          const prevIdx =
            currentIndex > 0
              ? currentIndex - 1
              : focusableItems.length - 1;
          focusableItems[prevIdx]?.focus();
          break;
        }

        case "Home":
          event.preventDefault();
          focusableItems[focusableItems.length - 1]?.focus();
          break;

        case "End":
          event.preventDefault();
          focusableItems[0]?.focus();
          break;

        case "Tab":
          // Trap focus within the menu
          event.preventDefault();
          if (event.shiftKey) {
            // Move to trigger
            triggerRef.current?.focus();
          } else {
            const nextTab =
              currentIndex < focusableItems.length - 1
                ? currentIndex + 1
                : 0;
            focusableItems[nextTab]?.focus();
          }
          break;

        default:
          break;
      }
    },
    [isOpen, close],
  );

  // ── Close on outside click ────────────────────────────
  useEffect(() => {
    if (!isOpen) return;

    const handleOutsideClick = (event: globalThis.MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        close();
      }
    };

    // Delay to avoid catching the opening click
    const timer = setTimeout(() => {
      document.addEventListener("mousedown", handleOutsideClick);
    }, 0);

    return () => {
      clearTimeout(timer);
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [isOpen, close]);

  // ── Focus first item when menu opens ──────────────────
  useEffect(() => {
    if (isOpen && itemRefs.current.length > 0) {
      // Focus nearest item (first in reversed list = last visually closest)
      const timer = setTimeout(() => {
        itemRefs.current[0]?.focus();
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  // ── Variant class for trigger ─────────────────────────
  const variantMap = {
    primary: styles['trigger-primary'],
    secondary: styles['trigger-secondary'],
    tertiary: styles['trigger-tertiary'],
    surface: styles['trigger-surface'],
  };

  const containerClasses = [
    styles['fab-menu'],
    fixed ? styles.fixed : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  const triggerClasses = [
    styles.trigger,
    variantMap[variant] || variantMap.primary,
    isOpen ? styles['is-open-state'] : "",
  ]
    .filter(Boolean)
    .join(" ");

  // ── Resolve trigger icon ──────────────────────────────
  const ActiveIcon = isOpen && CloseIcon ? CloseIcon : TriggerIcon;
  const shouldRotate = isOpen && !CloseIcon;

  return (
    <>
      {/* Scrim overlay */}
      {showScrim && (
        <div
          className={styles.scrim}
          data-visible={isOpen}
          aria-hidden="true"
          onClick={close}
        />
      )}

      {/* FAB Menu container */}
      <div
        ref={setContainerRef}
        className={containerClasses}
        onKeyDown={handleKeyDown}
        {...rest}
      >
        {/* Menu items list */}
        <div
          className={styles['items-list']}
          role="menu"
          aria-label={ariaLabel}
          aria-hidden={!isOpen}
        >
          {items.map((item, index) => {
            const ItemIcon = item.icon;
            return (
              <div
                key={index}
                className={[
                  styles['menu-item'],
                  isOpen ? styles['menu-item-visible'] : "",
                ]
                  .filter(Boolean)
                  .join(" ")}
              >
                {/* Text label */}
                {item.label && (
                  <span className={styles['item-label']} aria-hidden="true">
                    {item.label}
                  </span>
                )}

                {/* Small FAB */}
                <button
                  ref={(element) => {
                    itemRefs.current[index] = element;
                  }}
                  className={styles['item-fab']}
                  role="menuitem"
                  tabIndex={isOpen ? 0 : -1}
                  aria-label={item.ariaLabel || item.label}
                  onClick={(event) => handleItemClick(event, item)}
                  onMouseEnter={(event) => {
                    if (sound) SoundService.playHoverButton({ event });
                  }}
                >
                  {ItemIcon && (
                    <span className={styles['item-icon']} aria-hidden="true">
                      <ItemIcon size={24} />
                    </span>
                  )}
                </button>
              </div>
            );
          })}
        </div>

        {/* Trigger FAB */}
        <button
          ref={triggerRef}
          className={triggerClasses}
          type="button"
          disabled={disabled}
          aria-expanded={isOpen}
          aria-haspopup="menu"
          aria-label={isOpen ? "Close menu" : ariaLabel}
          onClick={handleTriggerClick}
          onMouseEnter={(event) => {
            if (sound) SoundService.playHoverButton({ event });
          }}
        >
          <span
            className={styles['trigger-icon']}
            style={
              shouldRotate
                ? { transform: "rotate(45deg)" }
                : { transform: "rotate(0deg)" }
            }
          >
            {ActiveIcon ? (
              <ActiveIcon size={24} />
            ) : (
              /* Default plus icon when no icon provided */
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <line x1="12" y1="5" x2="12" y2="19" />
                <line x1="5" y1="12" x2="19" y2="12" />
              </svg>
            )}
          </span>
        </button>
      </div>
    </>
  );
});

export default FabMenuComponent;
