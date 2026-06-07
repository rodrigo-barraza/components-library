"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { forwardRef, useCallback, useEffect, useRef, useState, Children, cloneElement, isValidElement, useMemo, createContext, useContext, } from "react";
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
    return _jsx("div", { className: styles['divider'], role: "separator" });
}
export function MenuGroupLabel({ children }) {
    return (_jsx("div", { className: styles['group-label'], role: "presentation", children: children }));
}
export const MenuItem = forwardRef(function MenuItem({ leadingIcon, trailingIcon, trailingText, disabled = false, selected = false, onClick, onMouseEnter, onFocus, children, className = "", ...rest }, ref) {
    const { sound } = useComponents();
    const handleClick = useCallback((event) => {
        if (disabled)
            return;
        if (sound)
            SoundService.playClickButton({ event });
        onClick?.(event);
    }, [disabled, sound, onClick]);
    const handleMouseEnter = useCallback((event) => {
        if (sound)
            SoundService.playHoverButton({ event });
        onMouseEnter?.(event);
    }, [sound, onMouseEnter]);
    const itemClasses = [
        styles['menu-item'],
        selected ? styles['menu-item-selected'] : "",
        className,
    ]
        .filter(Boolean)
        .join(" ");
    return (_jsxs("button", { ref: ref, type: "button", role: "menuitem", className: itemClasses, disabled: disabled, "aria-disabled": disabled || undefined, tabIndex: -1, onClick: handleClick, onMouseEnter: handleMouseEnter, onFocus: onFocus, ...rest, children: [leadingIcon && (_jsx("span", { className: styles['leading-icon'], "aria-hidden": "true", children: leadingIcon })), _jsx("span", { className: styles['label'], children: children }), trailingText && (_jsx("span", { className: styles['trailing-text'], children: trailingText })), trailingIcon && (_jsx("span", { className: styles['trailing-icon'], "aria-hidden": "true", children: trailingIcon }))] }));
});
export function SubMenu({ label, leadingIcon, disabled = false, children, }) {
    const depth = useContext(MenuDepthContext);
    const [isOpen, setIsOpen] = useState(false);
    const timeoutRef = useRef(null);
    const containerRef = useRef(null);
    const itemRefs = useRef([]);
    const open = useCallback(() => {
        if (timeoutRef.current)
            clearTimeout(timeoutRef.current);
        timeoutRef.current = setTimeout(() => setIsOpen(true), 150);
    }, []);
    const close = useCallback(() => {
        if (timeoutRef.current)
            clearTimeout(timeoutRef.current);
        timeoutRef.current = setTimeout(() => setIsOpen(false), 100);
    }, []);
    // Clean up timeouts
    useEffect(() => () => {
        if (timeoutRef.current)
            clearTimeout(timeoutRef.current);
    }, []);
    // Keyboard within submenu
    const handleKeyDown = useCallback((event) => {
        if (!isOpen) {
            if (event.key === "ArrowRight" || event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                event.stopPropagation();
                setIsOpen(true);
                requestAnimationFrame(() => itemRefs.current[0]?.focus());
            }
            return;
        }
        const focusable = itemRefs.current.filter((item) => item !== null);
        const index = focusable.indexOf(document.activeElement);
        switch (event.key) {
            case "ArrowDown":
                event.preventDefault();
                event.stopPropagation();
                focusable[(index + 1) % focusable.length]?.focus();
                break;
            case "ArrowUp":
                event.preventDefault();
                event.stopPropagation();
                focusable[(index - 1 + focusable.length) % focusable.length]?.focus();
                break;
            case "ArrowLeft":
            case "Escape":
                event.preventDefault();
                event.stopPropagation();
                setIsOpen(false);
                containerRef.current
                    ?.querySelector(`[role="menuitem"]`)
                    ?.focus();
                break;
            default:
                break;
        }
    }, [isOpen]);
    // Collect refs from children
    const indexedChildren = useMemo(() => {
        let index = 0;
        return Children.map(children, (child) => {
            if (isValidElement(child) && child.type === MenuItem) {
                const currentIdx = index++;
                return cloneElement(child, {
                    ref: (element) => {
                        itemRefs.current[currentIdx] = element;
                    },
                    tabIndex: isOpen ? 0 : -1,
                });
            }
            return child;
        });
    }, [children, isOpen]);
    const chevronSvg = (_jsx("svg", { width: "18", height: "18", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", "aria-hidden": "true", children: _jsx("polyline", { points: "9 18 15 12 9 6" }) }));
    return (_jsx(MenuDepthContext.Provider, { value: depth + 1, children: _jsxs("div", { ref: containerRef, className: styles['submenu-anchor'], onMouseEnter: open, onMouseLeave: close, onKeyDown: handleKeyDown, children: [_jsxs("button", { type: "button", role: "menuitem", className: styles['menu-item'], "aria-haspopup": "menu", "aria-expanded": isOpen, disabled: disabled, tabIndex: -1, children: [leadingIcon && (_jsx("span", { className: styles['leading-icon'], "aria-hidden": "true", children: leadingIcon })), _jsx("span", { className: styles['label'], children: label }), _jsx("span", { className: styles['submenu-arrow'], "aria-hidden": "true", children: chevronSvg })] }), _jsx("div", { className: styles['submenu-surface'], role: "menu", "data-open": isOpen, "aria-label": label, children: indexedChildren })] }) }));
}
const MenuComponent = forwardRef(function MenuComponent({ trigger, open: controlledOpen, onOpenChange, position = "bottom-start", matchWidth = false, closeOnSelect = true, maxHeight, ariaLabel = "Menu", className = "", children, ...rest }, ref) {
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
    const setAnchorRef = useCallback((node) => {
        anchorRef.current = node;
        if (typeof ref === "function")
            ref(node);
        else if (ref)
            ref.current = node;
    }, [ref]);
    // ── Open / close helpers ────────────────────────────────
    const setOpen = useCallback((next) => {
        const value = typeof next === "function" ? next(isOpen) : next;
        if (!isControlled)
            setInternalOpen(value);
        onOpenChange?.(value);
    }, [isControlled, isOpen, onOpenChange]);
    const toggle = useCallback(() => setOpen((prev) => !prev), [setOpen]);
    const close = useCallback(() => {
        setOpen(false);
        triggerElRef.current?.focus();
    }, [setOpen]);
    // ── Trigger click ───────────────────────────────────────
    const handleTriggerClick = useCallback((event) => {
        event.stopPropagation();
        toggle();
    }, [toggle]);
    // ── Outside click ───────────────────────────────────────
    useEffect(() => {
        if (!isOpen)
            return;
        const handleOutside = (event) => {
            if (anchorRef.current &&
                !anchorRef.current.contains(event.target)) {
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
        if (!isOpen)
            return;
        const timer = requestAnimationFrame(() => {
            const first = itemRefs.current.find(Boolean);
            first?.focus();
        });
        return () => cancelAnimationFrame(timer);
    }, [isOpen]);
    // ── Keyboard navigation (M3 a11y spec) ──────────────────
    const handleKeyDown = useCallback((event) => {
        // Open on ArrowDown/Up/Enter/Space when menu is closed
        if (!isOpen) {
            if (["ArrowDown", "ArrowUp", "Enter", " "].includes(event.key)) {
                event.preventDefault();
                setOpen(true);
            }
            return;
        }
        const focusable = itemRefs.current.filter((item) => item !== null);
        const currentIdx = focusable.indexOf(document.activeElement);
        switch (event.key) {
            case "Escape":
                event.preventDefault();
                close();
                break;
            case "ArrowDown": {
                event.preventDefault();
                const next = currentIdx < focusable.length - 1 ? currentIdx + 1 : 0;
                focusable[next]?.focus();
                break;
            }
            case "ArrowUp": {
                event.preventDefault();
                const previousFocusIndex = currentIdx > 0 ? currentIdx - 1 : focusable.length - 1;
                focusable[previousFocusIndex]?.focus();
                break;
            }
            case "Home":
                event.preventDefault();
                focusable[0]?.focus();
                break;
            case "End":
                event.preventDefault();
                focusable[focusable.length - 1]?.focus();
                break;
            case "Tab":
                // Close menu on Tab to allow normal tab flow
                event.preventDefault();
                close();
                break;
            case "Enter":
            case " ":
                // Let the focused item handle its own click
                if (document.activeElement?.getAttribute("role") === "menuitem") {
                    event.preventDefault();
                    document.activeElement.click();
                }
                break;
            default: {
                // Type-ahead: match item labels by first character(s)
                if (event.key.length === 1 && !event.ctrlKey && !event.metaKey) {
                    if (typeAheadTimer.current)
                        clearTimeout(typeAheadTimer.current);
                    typeAheadBuffer.current += event.key.toLowerCase();
                    typeAheadTimer.current = setTimeout(() => {
                        typeAheadBuffer.current = "";
                    }, 500);
                    const match = focusable.find((element) => {
                        const text = element.textContent?.toLowerCase() || "";
                        return text.startsWith(typeAheadBuffer.current);
                    });
                    if (match)
                        match.focus();
                }
                break;
            }
        }
    }, [isOpen, setOpen, close]);
    // ── Build children with refs ────────────────────────────
    const indexedChildren = useMemo(() => {
        let index = 0;
        itemRefs.current = [];
        return Children.map(children, (child) => {
            if (!isValidElement(child))
                return child;
            // MenuItem or SubMenu trigger — assign roving tabindex ref
            if (child.type === MenuItem || child.type === SubMenu) {
                const currentIdx = index++;
                const originalOnClick = child.props.onClick;
                return cloneElement(child, {
                    ref: (element) => {
                        itemRefs.current[currentIdx] = element;
                    },
                    tabIndex: isOpen ? 0 : -1,
                    onClick: (event) => {
                        originalOnClick?.(event);
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
        "bottom-start": styles['position-bottom-start'],
        "bottom-end": styles['position-bottom-end'],
        "top-start": styles['position-top-start'],
        "top-end": styles['position-top-end'],
    }[position] || styles['position-bottom-start'];
    const surfaceClasses = [
        styles['surface'],
        positionClass,
        matchWidth ? styles['match-width'] : "",
        className,
    ]
        .filter(Boolean)
        .join(" ");
    // ── Clone trigger to inject ARIA + click ────────────────
    const clonedTrigger = isValidElement(trigger)
        ? cloneElement(trigger, {
            ref: (element) => {
                triggerElRef.current = element;
                // Forward the trigger's own ref
                const triggerRef = trigger.ref;
                if (typeof triggerRef === "function")
                    triggerRef(element);
                else if (triggerRef)
                    triggerRef.current = element;
            },
            "aria-haspopup": "menu",
            "aria-expanded": isOpen,
            onClick: (event) => {
                trigger.props.onClick?.(event);
                handleTriggerClick(event);
            },
        })
        : trigger;
    return (_jsxs("div", { ref: setAnchorRef, className: `menu-component ${styles['anchor']}`, onKeyDown: handleKeyDown, ...rest, children: [clonedTrigger, _jsx("div", { ref: surfaceRef, className: surfaceClasses, role: "menu", "aria-label": ariaLabel, "data-open": isOpen, "data-scrollable": maxHeight ? true : undefined, style: maxHeight ? { "--menu-max-height": `${maxHeight}px` } : undefined, children: indexedChildren })] }));
});
export default MenuComponent;
//# sourceMappingURL=MenuComponent.js.map