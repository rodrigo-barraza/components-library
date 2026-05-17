// @ts-nocheck
"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import styles from "./DividerComponent.module.css";
/**
 * DividerComponent — Material Design 3 divider.
 *
 * A thin line that groups content in lists and containers.
 * Renders a semantic `<hr>` (horizontal) or `<div>` (vertical) with
 * appropriate ARIA attributes.
 *
 * M3 defines two variants beyond the default full-width:
 *   • inset       — 16px leading padding (aligns with list text)
 *   • middleInset — 16px inset on both leading and trailing edges
 *
 * @see https://m3.material.io/components/divider/overview
 * @see https://m3.material.io/components/divider/specs
 *
 * @param {"fullWidth"|"inset"|"middleInset"} [variant="fullWidth"] — M3 inset variant
 * @param {"horizontal"|"vertical"} [orientation="horizontal"] — axis of the divider
 * @param {"sm"|"md"|"lg"}  [spacing]       — optional spacing preset around the divider
 * @param {boolean}          [decorative=false] — if true, renders as `role="none"` (purely visual)
 * @param {string}           [className]
 * @param {object}           [style]        — use --divider-color / --divider-thickness to theme
 * @param {React.Ref}        [ref]
 */
export default function DividerComponent({ variant = "fullWidth", orientation = "horizontal", spacing, decorative = false, className, style, ...rest }) {
    const classes = [
        styles.divider,
        styles[orientation],
        variant === "inset" && styles.inset,
        variant === "middleInset" && styles.middleInset,
        spacing && styles[`spacing${spacing.charAt(0).toUpperCase()}${spacing.slice(1)}`],
        className,
    ]
        .filter(Boolean)
        .join(" ");
    /* Accessibility:
       - Decorative dividers (inside lists, between related items) get role="none"
         so screen readers skip them — they're visual sugar, not semantic separators.
       - Semantic dividers get role="separator" + aria-orientation.
         <hr> has implicit role="separator" + orientation="horizontal",
         so we only need explicit attributes for vertical or non-<hr> elements.  */
    if (orientation === "vertical") {
        return (_jsx("div", { className: classes, style: style, role: decorative ? "none" : "separator", "aria-orientation": decorative ? undefined : "vertical", ...rest }));
    }
    return (_jsx("hr", { className: classes, style: style, role: decorative ? "none" : undefined, "aria-orientation": decorative ? undefined : undefined, ...rest }));
}
/* ── Subheader Divider ───────────────────────────────────────────── */
/**
 * DividerComponent.Subheader — a labeled section divider.
 *
 * Renders a horizontal rule split by a centered text label.
 * Common in lists, settings panels, and form sections.
 * Always decorative — the label itself provides the semantic meaning.
 *
 * @param {string}  label      — the section label text
 * @param {"fullWidth"|"inset"|"middleInset"} [variant="fullWidth"]
 * @param {string}  [className]
 * @param {object}  [style]
 */
function DividerSubheader({ label, variant = "fullWidth", className, style, ...rest }) {
    const classes = [
        styles.divider,
        styles.subheader,
        variant === "inset" && styles.inset,
        variant === "middleInset" && styles.middleInset,
        className,
    ]
        .filter(Boolean)
        .join(" ");
    return (_jsxs("div", { className: classes, style: style, role: "none", ...rest, children: [_jsx("span", { className: styles.subheaderLine }), _jsx("span", { className: styles.subheaderLabel, children: label }), _jsx("span", { className: styles.subheaderLine })] }));
}
/* ── Attach sub-components ───────────────────────────────────────── */
DividerComponent.Subheader = DividerSubheader;
//# sourceMappingURL=DividerComponent.js.map