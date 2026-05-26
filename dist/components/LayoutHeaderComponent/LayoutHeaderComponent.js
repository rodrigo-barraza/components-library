import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { forwardRef } from "react";
import styles from "./LayoutHeaderComponent.module.css";
const LayoutHeaderComponent = forwardRef(function LayoutHeaderComponent({ leadingToggle, trailingToggle, centerContent, metaContent, controls, isMobile = false, className, children, }, ref) {
    return (_jsxs(_Fragment, { children: [_jsxs("header", { ref: ref, className: `${styles["layout-header-container"]}${className ? ` ${className}` : ""}`, children: [leadingToggle && (_jsx("button", { className: `${styles["header-toggle-button"]} ${!leadingToggle.isVisible ? styles["is-panel-hidden"] : ""}`, onClick: leadingToggle.onToggle, title: leadingToggle.isVisible
                            ? `Hide ${leadingToggle.label || "panel"}`
                            : `Show ${leadingToggle.label || "panel"}`, children: leadingToggle.isVisible
                            ? leadingToggle.visibleIcon
                            : leadingToggle.hiddenIcon })), !isMobile && metaContent, centerContent && (_jsx("div", { className: styles["header-center-area"], children: centerContent })), controls, children, trailingToggle && (_jsx("button", { className: `${styles["header-toggle-button"]} ${!trailingToggle.isVisible ? styles["is-panel-hidden"] : ""}`, onClick: trailingToggle.onToggle, title: trailingToggle.isVisible
                            ? `Hide ${trailingToggle.label || "panel"}`
                            : `Show ${trailingToggle.label || "panel"}`, children: trailingToggle.isVisible
                            ? trailingToggle.visibleIcon
                            : trailingToggle.hiddenIcon }))] }), isMobile && metaContent && (_jsx("div", { className: styles["mobile-metadata-bar"], children: metaContent }))] }));
});
export default LayoutHeaderComponent;
export { styles as layoutHeaderStyles };
//# sourceMappingURL=LayoutHeaderComponent.js.map