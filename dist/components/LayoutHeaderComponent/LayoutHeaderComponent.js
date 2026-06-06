import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { forwardRef, useEffect, useRef } from "react";
import { ArrowLeft, Server, Clock, ImageIcon, Wrench, MemoryStick, Eye, Type, Settings, Target, FlaskConical, Workflow, MessageSquare, LayoutDashboard, } from "lucide-react";
import styles from "./LayoutHeaderComponent.module.css";
// Helper to determine the header page title icon dynamically
function getHeaderTitleIcon(title) {
    if (typeof title !== "string") {
        return null;
    }
    const normalizedTitle = title.trim().toLowerCase();
    switch (normalizedTitle) {
        case "models":
            return _jsx(Server, { className: styles["header-page-title-icon"], size: 14 });
        case "cron jobs":
        case "scheduled tasks":
            return _jsx(Clock, { className: styles["header-page-title-icon"], size: 14 });
        case "media":
            return _jsx(ImageIcon, { className: styles["header-page-title-icon"], size: 14 });
        case "tools":
            return _jsx(Wrench, { className: styles["header-page-title-icon"], size: 14 });
        case "vram benchmark":
        case "vram bench":
            return _jsx(MemoryStick, { className: styles["header-page-title-icon"], size: 14 });
        case "vision":
            return _jsx(Eye, { className: styles["header-page-title-icon"], size: 14 });
        case "text":
            return _jsx(Type, { className: styles["header-page-title-icon"], size: 14 });
        case "settings":
            return _jsx(Settings, { className: styles["header-page-title-icon"], size: 14 });
        case "benchmarks":
            return _jsx(Target, { className: styles["header-page-title-icon"], size: 14 });
        case "synthesis":
            return _jsx(FlaskConical, { className: styles["header-page-title-icon"], size: 14 });
        case "workflows":
        case "workflow":
            return _jsx(Workflow, { className: styles["header-page-title-icon"], size: 14 });
        case "conversations":
        case "chat":
            return _jsx(MessageSquare, { className: styles["header-page-title-icon"], size: 14 });
        case "dashboard":
        case "admin":
            return _jsx(LayoutDashboard, { className: styles["header-page-title-icon"], size: 14 });
        default:
            if (normalizedTitle.includes("chat") || normalizedTitle.includes("conversation")) {
                return _jsx(MessageSquare, { className: styles["header-page-title-icon"], size: 14 });
            }
            if (normalizedTitle.includes("benchmark")) {
                return _jsx(Target, { className: styles["header-page-title-icon"], size: 14 });
            }
            if (normalizedTitle.includes("tool")) {
                return _jsx(Wrench, { className: styles["header-page-title-icon"], size: 14 });
            }
            if (normalizedTitle.includes("setting")) {
                return _jsx(Settings, { className: styles["header-page-title-icon"], size: 14 });
            }
            if (normalizedTitle.includes("admin") || normalizedTitle.includes("dash")) {
                return _jsx(LayoutDashboard, { className: styles["header-page-title-icon"], size: 14 });
            }
            return null;
    }
}
const LayoutHeaderComponent = forwardRef(function LayoutHeaderComponent({ title, titleBadge, onBack, leadingToggle, trailingToggle, centerContent, metaContent, controls, isMobile = false, className, children, }, ref) {
    const headerReference = useRef(null);
    // Programmatic contrast color for header content based on --accent-primary luminance
    useEffect(() => {
        const headerElement = headerReference.current;
        if (!headerElement)
            return;
        const computeAndApplyContrastColor = () => {
            const computedStyle = getComputedStyle(headerElement);
            const backgroundColorValue = computedStyle.backgroundColor;
            const redGreenBlueMatch = backgroundColorValue.match(/rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)/);
            if (!redGreenBlueMatch)
                return;
            const redChannel = parseInt(redGreenBlueMatch[1], 10);
            const greenChannel = parseInt(redGreenBlueMatch[2], 10);
            const blueChannel = parseInt(redGreenBlueMatch[3], 10);
            const toLinearComponent = (channelValue) => {
                const normalizedValue = channelValue / 255;
                return normalizedValue <= 0.03928
                    ? normalizedValue / 12.92
                    : Math.pow((normalizedValue + 0.055) / 1.055, 2.4);
            };
            const relativeLuminance = 0.2126 * toLinearComponent(redChannel) +
                0.7152 * toLinearComponent(greenChannel) +
                0.0722 * toLinearComponent(blueChannel);
            const isLightBackground = relativeLuminance > 0.179;
            headerElement.style.setProperty("--header-contrast-color", isLightBackground ? "rgba(0, 0, 0, 0.87)" : "rgba(255, 255, 255, 0.92)");
            headerElement.style.setProperty("--header-contrast-color-muted", isLightBackground ? "rgba(0, 0, 0, 0.5)" : "rgba(255, 255, 255, 0.55)");
            headerElement.style.setProperty("--header-contrast-border", isLightBackground ? "rgba(0, 0, 0, 0.15)" : "rgba(255, 255, 255, 0.15)");
            headerElement.style.setProperty("--header-contrast-hover-background", isLightBackground ? "rgba(0, 0, 0, 0.08)" : "rgba(255, 255, 255, 0.08)");
        };
        computeAndApplyContrastColor();
        const mutationObserver = new MutationObserver(computeAndApplyContrastColor);
        mutationObserver.observe(headerElement, {
            attributes: true,
            attributeFilter: ["style", "class"],
        });
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
    return (_jsxs(_Fragment, { children: [_jsxs("header", { ref: (node) => {
                    headerReference.current = node;
                    if (typeof ref === "function")
                        ref(node);
                    else if (ref)
                        ref.current = node;
                }, className: `${styles["layout-header-container"]}${className ? ` ${className}` : ""}`, children: [leadingToggle && (_jsx("button", { className: `${styles["header-toggle-button"]} ${!leadingToggle.isVisible ? styles["is-panel-hidden"] : ""}`, onClick: leadingToggle.onToggle, title: leadingToggle.isVisible
                            ? `Hide ${leadingToggle.label || "panel"}`
                            : `Show ${leadingToggle.label || "panel"}`, children: leadingToggle.isVisible
                            ? leadingToggle.visibleIcon
                            : leadingToggle.hiddenIcon })), title && (_jsxs("div", { className: `${styles["header-identity"]} ${leadingToggle ? styles["has-leading-toggle"] : ""}`, children: [_jsx("div", { className: styles["header-identity-start"], children: onBack && (_jsx("button", { className: styles["header-back-button"], onClick: onBack, title: "Go back", children: _jsx(ArrowLeft, { size: 16 }) })) }), _jsxs("h1", { className: styles["header-page-title"], children: [getHeaderTitleIcon(title), typeof title === "string" ? _jsx("span", { children: title }) : title, titleBadge] }), _jsx("div", { className: styles["header-identity-end"] })] })), !isMobile && metaContent, centerContent && (_jsx("div", { className: styles["header-center-area"], children: centerContent })), controls, children, trailingToggle && (_jsx("button", { className: `${styles["header-toggle-button"]} ${!trailingToggle.isVisible ? styles["is-panel-hidden"] : ""}`, onClick: trailingToggle.onToggle, title: trailingToggle.isVisible
                            ? `Hide ${trailingToggle.label || "panel"}`
                            : `Show ${trailingToggle.label || "panel"}`, children: trailingToggle.isVisible
                            ? trailingToggle.visibleIcon
                            : trailingToggle.hiddenIcon }))] }), isMobile && metaContent && (_jsx("div", { className: styles["mobile-metadata-bar"], children: metaContent }))] }));
});
export default LayoutHeaderComponent;
export { styles as layoutHeaderStyles };
//# sourceMappingURL=LayoutHeaderComponent.js.map