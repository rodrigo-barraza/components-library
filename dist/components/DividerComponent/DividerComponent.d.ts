import { HTMLAttributes, ReactNode } from "react";
export interface DividerComponentProps extends HTMLAttributes<HTMLElement> {
    variant?: "fullWidth" | "inset" | "middleInset";
    orientation?: "horizontal" | "vertical";
    spacing?: "none" | "small" | "medium" | "large" | string;
    decorative?: boolean;
}
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
 */
declare function DividerComponent({ variant, orientation, spacing, decorative, className, style, ...rest }: DividerComponentProps): import("react").JSX.Element;
declare namespace DividerComponent {
    var Subheader: typeof DividerSubheader;
}
export default DividerComponent;
export interface DividerSubheaderProps extends HTMLAttributes<HTMLDivElement> {
    label: ReactNode;
    variant?: "fullWidth" | "inset" | "middleInset";
}
/**
 * DividerComponent.Subheader — a labeled section divider.
 *
 * Renders a horizontal rule split by a centered text label.
 * Common in lists, settings panels, and form sections.
 * Always decorative — the label itself provides the semantic meaning.
 */
declare function DividerSubheader({ label, variant, className, style, ...rest }: DividerSubheaderProps): import("react").JSX.Element;
//# sourceMappingURL=DividerComponent.d.ts.map