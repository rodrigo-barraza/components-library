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
declare function DividerComponent({ variant, orientation, spacing, decorative, className, style, ...rest }: {
    [x: string]: any;
    variant?: string | undefined;
    orientation?: string | undefined;
    spacing: any;
    decorative?: boolean | undefined;
    className: any;
    style: any;
}): import("react/jsx-runtime").JSX.Element;
declare namespace DividerComponent {
    var Subheader: typeof DividerSubheader;
}
export default DividerComponent;
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
declare function DividerSubheader({ label, variant, className, style, ...rest }: {
    [x: string]: any;
    label: any;
    variant?: string | undefined;
    className: any;
    style: any;
}): import("react/jsx-runtime").JSX.Element;
//# sourceMappingURL=DividerComponent.d.ts.map