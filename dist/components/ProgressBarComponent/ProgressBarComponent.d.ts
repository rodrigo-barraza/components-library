import { ComponentPropsWithoutRef } from "react";
export interface ProgressBarComponentProps extends ComponentPropsWithoutRef<"div"> {
    value?: number | null;
    variant?: "accent" | "primary" | "secondary" | "tertiary" | string;
    size?: "xs" | "sm" | "md" | "lg" | string;
    label?: string;
    showValue?: boolean;
    animated?: boolean;
    striped?: boolean;
}
/**
 * ProgressBarComponent — M3 Linear Progress Indicator.
 *
 * Two modes:
 *   • **Determinate** — pass `value` (0–100) to show a definite progress bar
 *   • **Indeterminate** — omit `value` to show the M3 infinite sliding animation
 */
export default function ProgressBarComponent({ value, variant, size, label, showValue, animated, striped, className, ...rest }: ProgressBarComponentProps): import("react").JSX.Element;
//# sourceMappingURL=ProgressBarComponent.d.ts.map