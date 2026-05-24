import { ReactNode } from "react";
export interface LoadingIndicatorComponentProps {
    variant?: "circular" | "linear";
    mode?: "indeterminate" | "determinate";
    value?: number;
    buffer?: number | null;
    size?: "small" | "medium" | "large" | string;
    trackSize?: "thin" | "thick" | "default" | string;
    color?: "primary" | "secondary" | "tertiary" | "error" | "inherit" | string;
    showPercentage?: boolean;
    label?: ReactNode;
    ariaLabel?: string;
    className?: string;
    id?: string;
}
/**
 * LoadingIndicatorComponent — M3-compliant progress indicator with circular
 * and linear variants, both indeterminate and determinate modes.
 *
 * M3 Spec Reference (Loading Indicator / Progress Indicator):
 *   • Circular: 48dp default container, 4dp stroke, rounded caps
 *   • Linear:   full-width, 4dp track height, rounded shape
 *   • Track:    20% opacity of active color
 *   • Caps:     rounded (stroke-linecap: round)
 *   • Variants: indeterminate (unknown duration), determinate (known %)
 *
 * Accessibility (per M3 Loading Indicator / Accessibility):
 *   • role="progressbar" on the indicator element
 *   • aria-valuemin="0" and aria-valuemax="100" always present
 *   • aria-valuenow set to current value for determinate, omitted for indeterminate
 *   • aria-label provided via ariaLabel prop — required for screen readers
 *   • aria-busy="true" can be set on the loading region by the consumer
 *   • aria-live="polite" on label for progress updates
 *   • Reduced motion: animation durations extended (not removed) per M3 guidelines
 */
export default function LoadingIndicatorComponent({ variant, mode, value, buffer, size, trackSize, color, showPercentage, label, ariaLabel, className, id, }: LoadingIndicatorComponentProps): import("react/jsx-runtime").JSX.Element;
//# sourceMappingURL=LoadingIndicatorComponent.d.ts.map