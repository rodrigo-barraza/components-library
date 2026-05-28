import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect } from "react";
import { usePageHeaderContext } from "../PageHeaderContext.js";
import { ArrowLeft } from "lucide-react";
import styles from "./PageHeaderComponent.module.css";
/**
 * PageHeaderComponent — When used inside a PageLayoutComponent, pushes
 * page identity (title, subtitle, back) up to LayoutHeaderComponent
 * via context, and renders only the action children inline.
 *
 * When used standalone (no context provider), falls back to rendering
 * the classic pageHeader bar with title/subtitle/back inline.
 */
export default function PageHeaderComponent({ title, subtitle, onBack, centerContent, children, sticky = true, className, }) {
    const setIdentity = usePageHeaderContext();
    useEffect(() => {
        if (setIdentity) {
            setIdentity({ title, onBack });
        }
        return () => {
            if (setIdentity) {
                setIdentity({});
            }
        };
    }, [title, subtitle, onBack, setIdentity]);
    // Context-driven mode: identity is pushed to LayoutHeaderComponent,
    // only render the action children inline.
    if (setIdentity) {
        const hasContent = children || centerContent;
        if (!hasContent)
            return null;
        return (_jsxs("div", { className: styles.headerActions, children: [centerContent && _jsx("div", { className: styles.headerCenter, children: centerContent }), children] }));
    }
    // Standalone fallback: render the full pageHeader bar.
    return (_jsxs("header", { className: `${styles.pageHeader} ${sticky ? styles.sticky : ""} ${className || ""}`, children: [_jsxs("div", { className: styles.headerLeft, children: [onBack && (_jsx("button", { className: styles.backButton, onClick: onBack, children: _jsx(ArrowLeft, { size: 16 }) })), _jsxs("div", { children: [_jsx("h1", { className: styles.pageTitle, children: title }), subtitle && _jsx("p", { className: styles.pageSubtitle, children: subtitle })] })] }), centerContent && (_jsx("div", { className: styles.headerCenter, children: centerContent })), children && _jsx("div", { className: styles.headerActions, children: children })] }));
}
//# sourceMappingURL=PageHeaderComponent.js.map