import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import BadgeComponent from "../BadgeComponent/BadgeComponent.js";
import StatusDotComponent from "../StatusDotComponent/StatusDotComponent.js";
import styles from "./StatusBadgeComponent.module.css";
/**
 * StatusBadgeComponent — Semantic badge for service health status.
 *
 * Renders a pulsing dot indicator alongside a Noto Emoji glyph:
 *   ✓ (U+2713 CHECK MARK) for healthy
 *   ✗ (U+2717 BALLOT X) for down
 *
 * The glyphs are rendered in the monochrome "Noto Emoji" typeface
 * via the `--font-emoji` design token.
 */
export default function StatusBadgeComponent({ healthy, className, ...rest }) {
    const variant = healthy ? "success" : "error";
    return (_jsxs(BadgeComponent, { variant: variant, className: `${styles.badge} ${className || ""}`, tooltip: healthy ? "Healthy" : "Down", ...rest, children: [_jsx(StatusDotComponent, { variant: healthy ? "healthy" : "unhealthy", size: "sm", pulse: healthy }), _jsx("span", { className: styles.icon, "aria-label": healthy ? "Healthy" : "Down", children: healthy ? "✓" : "✗" })] }));
}
//# sourceMappingURL=StatusBadgeComponent.js.map