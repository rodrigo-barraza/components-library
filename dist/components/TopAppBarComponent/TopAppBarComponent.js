"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useRef, useState, useEffect, forwardRef, } from "react";
import styles from "./TopAppBarComponent.module.css";
export default function TopAppBarComponent({ variant = "small", title, navigationIcon, onNavigationClick, navigationAriaLabel = "Navigate back", position = "sticky", scrollTargetRef, scrollThreshold = 4, showScrollIndicator = false, headingLevel = 1, ariaLabel, className, style, children, ...rest }) {
    const barRef = useRef(null);
    const [isScrolled, setIsScrolled] = useState(false);
    const [scrollProgress, setScrollProgress] = useState(0);
    // Determine whether we use an expanded row (medium/large)
    const isExpandable = variant === "medium" || variant === "large";
    /**
     * Scroll listener — controls elevation and collapse state.
     * Uses requestAnimationFrame for jank-free scroll tracking.
     */
    useEffect(() => {
        const scrollEl = scrollTargetRef?.current || (typeof window !== "undefined" ? window : null);
        if (!scrollEl)
            return;
        let rafId = null;
        const handleScroll = () => {
            if (rafId)
                cancelAnimationFrame(rafId);
            rafId = requestAnimationFrame(() => {
                const scrollTop = scrollEl === window
                    ? window.scrollY || document.documentElement.scrollTop
                    : scrollEl.scrollTop;
                setIsScrolled(scrollTop > scrollThreshold);
                // Scroll progress (for the optional indicator line)
                if (showScrollIndicator && scrollEl) {
                    const maxScroll = scrollEl === window
                        ? document.documentElement.scrollHeight - window.innerHeight
                        : scrollEl.scrollHeight - scrollEl.clientHeight;
                    setScrollProgress(maxScroll > 0 ? Math.min(scrollTop / maxScroll, 1) : 0);
                }
            });
        };
        scrollEl.addEventListener("scroll", handleScroll, { passive: true });
        // Run once to catch initial scroll state (e.g. restored scroll position)
        handleScroll();
        return () => {
            scrollEl.removeEventListener("scroll", handleScroll);
            if (rafId)
                cancelAnimationFrame(rafId);
        };
    }, [scrollTargetRef, scrollThreshold, showScrollIndicator]);
    // Variant class mapping
    const variantClass = ({
        "center-aligned": styles['center-aligned'],
        small: styles.small,
        medium: styles.medium,
        large: styles.large,
    })[variant] || styles.small;
    // Position class
    const positionClass = position === "fixed"
        ? styles.fixed
        : position === "sticky"
            ? styles.sticky
            : "";
    const rootClasses = [
        styles['top-app-bar'],
        variantClass,
        positionClass,
        isScrolled && styles.elevated,
        isScrolled && isExpandable && styles['is-collapsed-state'],
        className,
    ]
        .filter(Boolean)
        .join(" ");
    // Heading element for the title
    const Heading = `h${headingLevel}`;
    return (_jsxs("header", { ref: barRef, role: "banner", "aria-label": ariaLabel, className: rootClasses, style: style, ...rest, children: [_jsxs("div", { className: styles['main-row'], children: [navigationIcon && (_jsx("div", { className: styles['navigation-slot'], children: _jsx("button", { type: "button", className: styles['navigation-button'], "aria-label": navigationAriaLabel, onClick: onNavigationClick, children: navigationIcon }) })), _jsx("div", { className: styles['title-area'], children: _jsx(Heading, { className: styles.title, children: title }) }), children && _jsx("div", { className: styles['actions-slot'], children: children })] }), isExpandable && (_jsx("div", { className: styles['expanded-row'], children: _jsx("span", { className: styles['expanded-title'], children: title }) })), showScrollIndicator && (_jsx("div", { className: styles['scroll-indicator'], style: { width: `${scrollProgress * 100}%` }, "aria-hidden": "true" }))] }));
}
const TopAppBarAction = forwardRef(function TopAppBarAction({ icon: Icon, ariaLabel, disabled = false, onClick, className, children, ...rest }, ref) {
    const classes = [styles['action-button'], className].filter(Boolean).join(" ");
    return (_jsx("button", { ref: ref, type: "button", className: classes, "aria-label": ariaLabel, disabled: disabled, onClick: onClick, ...rest, children: children || (Icon && _jsx(Icon, { size: 24 })) }));
});
/* ── Attach sub-components ──────────────────────────────────────────── */
TopAppBarComponent.Action = TopAppBarAction;
//# sourceMappingURL=TopAppBarComponent.js.map