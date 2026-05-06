"use client";

import {
  forwardRef,
  useCallback,
  useEffect,
  useRef,
  useState,
  Children,
  cloneElement,
  isValidElement,
  useMemo,
  createContext,
  useContext,
} from "react";
import styles from "./MenuComponent.module.css";
import { useComponents } from "../ComponentsProvider.js";
import SoundService from "../../services/SoundService.js";

// ── Internal context for nested submenu depth tracking ────────────
const MenuDepthContext = createContext(0);

// ──────────────────────────────────────────────────────────────────
//  MenuDivider — Visual separator between groups of menu items
//  M3: 1px height, outline-variant color, 8px vertical margin
// ──────────────────────────────────────────────────────────────────
export function MenuDivider() {
  return <div className={styles.divider} role="separator" />;
}

// ──────────────────────────────────────────────────────────────────
//  MenuGroupLabel — Optional header label for a group of items
//  M3: label-small typography, on-surface-variant color
// ──────────────────────────────────────────────────────────────────
export function MenuGroupLabel({ children }) {
  return (
    <div className={styles.groupLabel} role="presentation">
      {children}
    </div>
  );
}

// ──────────────────────────────────────────────────────────────────
//  MenuItem — Individual selectable row
//  M3 anatomy: state-layer → [leading-icon] → label → [trailing]
//  Height: 48px · Padding: 0 12px
// ──────────────────────────────────────────────────────────────────
export const MenuItem = forwardRef(function MenuItem(
  {
    leadingIcon,
    trailingIcon,
    trailingText,
    disabled = false,
    selected = false,
    onClick,
    onMouseEnter,
    onFocus,
    children,
    className = "",
    ...rest
  },
  ref,
) {
  const { sound } = useComponents();

  const handleClick = useCallback(
    (e) => {
      if (disabled) return;
      if (sound) SoundService.playClickButton({ event: e });
      onClick?.(e);
    },
    [disabled, sound, onClick],
  );

  const handleMouseEnter = useCallback(
    (e) => {
      if (sound) SoundService.playHoverButton({ event: e });
      onMouseEnter?.(e);
    },
    [sound, onMouseEnter],
  );

  const itemClasses = [
    styles.menuItem,
    selected ? styles.menuItemSelected : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <button
      ref={ref}
      type="button"
      role="menuitem"
      className={itemClasses}
      disabled={disabled}
      aria-disabled={disabled || undefined}
      tabIndex={-1}
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
      onFocus={onFocus}
      {...rest}
    >
      {leadingIcon && (
        <span className={styles.leadingIcon} aria-hidden="true">
          {leadingIcon}
        </span>
      )}

      <span className={styles.label}>{children}</span>

      {trailingText && (
        <span className={styles.trailingText}>{trailingText}</span>
      )}

      {trailingIcon && (
        <span className={styles.trailingIcon} aria-hidden="true">
          {trailingIcon}
        </span>
      )}
    </button>
  );
});

// ──────────────────────────────────────────────────────────────────
//  SubMenu — Cascading nested menu triggered by a parent item
//  Opens on hover/focus after a short delay (M3 pattern)
// ──────────────────────────────────────────────────────────────────
export function SubMenu({
  label,
  leadingIcon,
  disabled = false,
  children,
}) {
  const depth = useContext(MenuDepthContext);
  const [isOpen, setIsOpen] = useState(false);
  const timeoutRef = useRef(null);
  const containerRef = useRef(null);
  const itemRefs = useRef([]);

  const open = useCallback(() => {
    clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => setIsOpen(true), 150);
  }, []);

  const close = useCallback(() => {
    clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => setIsOpen(false), 100);
  }, []);

  // Clean up timeouts
  useEffect(() => () => clearTimeout(timeoutRef.current), []);

  // Keyboard within submenu
  const handleKeyDown = useCallback(
    (e) => {
      if (!isOpen) {
        if (e.key === "ArrowRight" || e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          e.stopPropagation();
          setIsOpen(true);
          requestAnimationFrame(() => itemRefs.current[0]?.focus());
        }
        return;
      }

      const focusable = itemRefs.current.filter(Boolean);
      const idx = focusable.indexOf(document.activeElement);

      switch (e.key) {
        case "ArrowDown":
          e.preventDefault();
          e.stopPropagation();
          focusable[(idx + 1) % focusable.length]?.focus();
          break;
        case "ArrowUp":
          e.preventDefault();
          e.stopPropagation();
          focusable[(idx - 1 + focusable.length) % focusable.length]?.focus();
          break;
        case "ArrowLeft":
        case "Escape":
          e.preventDefault();
          e.stopPropagation();
          setIsOpen(false);
          containerRef.current
            ?.querySelector(`[role="menuitem"]`)
            ?.focus();
          break;
        default:
          break;
      }
    },
    [isOpen],
  );

  // Collect refs from children
  const indexedChildren = useMemo(() => {
    let idx = 0;
    return Children.map(children, (child) => {
      if (isValidElement(child) && child.type === MenuItem) {
        const currentIdx = idx++;
        return cloneElement(child, {
          ref: (el) => {
            itemRefs.current[currentIdx] = el;
          },
          tabIndex: isOpen ? 0 : -1,
        });
      }
      return child;
    });
  }, [children, isOpen]);

  const chevronSvg = (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <polyline points="9 18 15 12 9 6" />
    </svg>
  );

  return (
    <MenuDepthContext.Provider value={depth + 1}>
      <div
        ref={containerRef}
        className={styles.submenuAnchor}
        onMouseEnter={open}
        onMouseLeave={close}
        onKeyDown={handleKeyDown}
      >
        <button
          type="button"
          role="menuitem"
          className={styles.menuItem}
          aria-haspopup="menu"
          aria-expanded={isOpen}
          disabled={disabled}
          tabIndex={-1}
        >
          {leadingIcon && (
            <span className={styles.leadingIcon} aria-hidden="true">
              {leadingIcon}
            </span>
          )}
          <span className={styles.label}>{label}</span>
          <span className={styles.submenuArrow} aria-hidden="true">
            {chevronSvg}
          </span>
        </button>

        <div
          className={styles.submenuSurface}
          role="menu"
          data-open={isOpen}
          aria-label={label}
        >
          {indexedChildren}
        </div>
      </div>
    </MenuDepthContext.Provider>
  );
}

// ══════════════════════════════════════════════════════════════════
//  MenuComponent — Material Design 3 Dropdown Menu
//
//  Displays a list of choices on a temporary elevated surface,
//  triggered from buttons, icon buttons, or other anchor elements.
//
//  M3 Specs: https://m3.material.io/components/menus/specs
//
//  Anatomy:
//    anchor → surface → [ menu-item | divider | group-label | sub-menu ]
//
//  Accessibility (per M3):
//    • Surface has role="menu"
//    • Items have role="menuitem"
//    • Arrow-key roving focus within items
//    • Escape closes the menu and restores focus to trigger
//    • Home/End jump to first/last item
//    • Type-ahead character search
//    • Focus trapped within menu when open
//
//  @param {Object} props
//  @param {React.ReactElement} props.trigger
//    The element that anchors and opens the menu (e.g., IconButton).
//    Gets aria-haspopup and aria-expanded injected automatically.
//  @param {boolean}  [props.open]           — Controlled open state
//  @param {Function} [props.onOpenChange]   — Callback for open changes
//  @param {"bottom-start"|"bottom-end"|"top-start"|"top-end"}
//         [props.position="bottom-start"]   — Menu placement
//  @param {boolean}  [props.matchWidth=false]  — Match trigger width
//  @param {boolean}  [props.closeOnSelect=true]— Close after item click
//  @param {number}   [props.maxHeight]         — Max height in px
//  @param {string}   [props.ariaLabel="Menu"]
//  @param {string}   [props.className]
//  @param {React.ReactNode} props.children — MenuItem, MenuDivider, etc.
// ══════════════════════════════════════════════════════════════════
const MenuComponent = forwardRef(function MenuComponent(
  {
    trigger,
    open: controlledOpen,
    onOpenChange,
    position = "bottom-start",
    matchWidth = false,
    closeOnSelect = true,
    maxHeight,
    ariaLabel = "Menu",
    className = "",
    children,
    ...rest
  },
  ref,
) {
  const isControlled = controlledOpen !== undefined;
  const [internalOpen, setInternalOpen] = useState(false);
  const isOpen = isControlled ? controlledOpen : internalOpen;

  const anchorRef = useRef(null);
  const surfaceRef = useRef(null);
  const triggerElRef = useRef(null);
  const itemRefs = useRef([]);
  const typeAheadBuffer = useRef("");
  const typeAheadTimer = useRef(null);

  // ── Merge ref ───────────────────────────────────────────
  const setAnchorRef = useCallback(
    (node) => {
      anchorRef.current = node;
      if (typeof ref === "function") ref(node);
      else if (ref) ref.current = node;
    },
    [ref],
  );

  // ── Open / close helpers ────────────────────────────────
  const setOpen = useCallback(
    (next) => {
      const value = typeof next === "function" ? next(isOpen) : next;
      if (!isControlled) setInternalOpen(value);
      onOpenChange?.(value);
    },
    [isControlled, isOpen, onOpenChange],
  );

  const toggle = useCallback(() => setOpen((prev) => !prev), [setOpen]);
  const close = useCallback(() => {
    setOpen(false);
    triggerElRef.current?.focus();
  }, [setOpen]);

  // ── Trigger click ───────────────────────────────────────
  const handleTriggerClick = useCallback(
    (e) => {
      e.stopPropagation();
      toggle();
    },
    [toggle],
  );

  // ── Outside click ───────────────────────────────────────
  useEffect(() => {
    if (!isOpen) return;

    const handleOutside = (e) => {
      if (
        anchorRef.current &&
        !anchorRef.current.contains(e.target)
      ) {
        close();
      }
    };

    // Defer to avoid catching opening click
    const timer = setTimeout(() => {
      document.addEventListener("mousedown", handleOutside);
    }, 0);

    return () => {
      clearTimeout(timer);
      document.removeEventListener("mousedown", handleOutside);
    };
  }, [isOpen, close]);

  // ── Focus first item on open ────────────────────────────
  useEffect(() => {
    if (!isOpen) return;

    const timer = requestAnimationFrame(() => {
      const first = itemRefs.current.find(Boolean);
      first?.focus();
    });

    return () => cancelAnimationFrame(timer);
  }, [isOpen]);

  // ── Keyboard navigation (M3 a11y spec) ──────────────────
  const handleKeyDown = useCallback(
    (e) => {
      // Open on ArrowDown/Up/Enter/Space when menu is closed
      if (!isOpen) {
        if (["ArrowDown", "ArrowUp", "Enter", " "].includes(e.key)) {
          e.preventDefault();
          setOpen(true);
        }
        return;
      }

      const focusable = itemRefs.current.filter(Boolean);
      const currentIdx = focusable.indexOf(document.activeElement);

      switch (e.key) {
        case "Escape":
          e.preventDefault();
          close();
          break;

        case "ArrowDown": {
          e.preventDefault();
          const next = currentIdx < focusable.length - 1 ? currentIdx + 1 : 0;
          focusable[next]?.focus();
          break;
        }

        case "ArrowUp": {
          e.preventDefault();
          const prev =
            currentIdx > 0 ? currentIdx - 1 : focusable.length - 1;
          focusable[prev]?.focus();
          break;
        }

        case "Home":
          e.preventDefault();
          focusable[0]?.focus();
          break;

        case "End":
          e.preventDefault();
          focusable[focusable.length - 1]?.focus();
          break;

        case "Tab":
          // Close menu on Tab to allow normal tab flow
          e.preventDefault();
          close();
          break;

        case "Enter":
        case " ":
          // Let the focused item handle its own click
          if (document.activeElement?.getAttribute("role") === "menuitem") {
            e.preventDefault();
            document.activeElement.click();
          }
          break;

        default: {
          // Type-ahead: match item labels by first character(s)
          if (e.key.length === 1 && !e.ctrlKey && !e.metaKey) {
            clearTimeout(typeAheadTimer.current);
            typeAheadBuffer.current += e.key.toLowerCase();

            typeAheadTimer.current = setTimeout(() => {
              typeAheadBuffer.current = "";
            }, 500);

            const match = focusable.find((el) => {
              const text = el.textContent?.toLowerCase() || "";
              return text.startsWith(typeAheadBuffer.current);
            });

            if (match) match.focus();
          }
          break;
        }
      }
    },
    [isOpen, setOpen, close],
  );

  // ── Build children with refs ────────────────────────────
  const indexedChildren = useMemo(() => {
    let idx = 0;
    itemRefs.current = [];

    return Children.map(children, (child) => {
      if (!isValidElement(child)) return child;

      // MenuItem or SubMenu trigger — assign roving tabindex ref
      if (child.type === MenuItem || child.type === SubMenu) {
        const currentIdx = idx++;
        const originalOnClick = child.props.onClick;

        return cloneElement(child, {
          ref: (el) => {
            itemRefs.current[currentIdx] = el;
          },
          tabIndex: isOpen ? 0 : -1,
          onClick: (e) => {
            originalOnClick?.(e);
            if (closeOnSelect && child.type === MenuItem) {
              close();
            }
          },
        });
      }

      // Dividers, labels, etc. pass through
      return child;
    });
  }, [children, isOpen, closeOnSelect, close]);

  // ── Position class ──────────────────────────────────────
  const positionClass = {
    "bottom-start": styles.positionBottomStart,
    "bottom-end": styles.positionBottomEnd,
    "top-start": styles.positionTopStart,
    "top-end": styles.positionTopEnd,
  }[position] || styles.positionBottomStart;

  const surfaceClasses = [
    styles.surface,
    positionClass,
    matchWidth ? styles.matchWidth : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  // ── Clone trigger to inject ARIA + click ────────────────
  const clonedTrigger = isValidElement(trigger)
    ? cloneElement(trigger, {
        ref: (el) => {
          triggerElRef.current = el;
          // Forward the trigger's own ref
          const triggerRef = trigger.ref;
          if (typeof triggerRef === "function") triggerRef(el);
          else if (triggerRef) triggerRef.current = el;
        },
        "aria-haspopup": "menu",
        "aria-expanded": isOpen,
        onClick: (e) => {
          trigger.props.onClick?.(e);
          handleTriggerClick(e);
        },
      })
    : trigger;

  return (
    <div
      ref={setAnchorRef}
      className={styles.anchor}
      onKeyDown={handleKeyDown}
      {...rest}
    >
      {clonedTrigger}

      <div
        ref={surfaceRef}
        className={surfaceClasses}
        role="menu"
        aria-label={ariaLabel}
        data-open={isOpen}
        data-scrollable={maxHeight ? true : undefined}
        style={maxHeight ? { "--menu-max-height": `${maxHeight}px` } : undefined}
      >
        {indexedChildren}
      </div>
    </div>
  );
});

export default MenuComponent;
