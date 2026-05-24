import { type MouseEvent } from "react";
export interface SplitButtonComponentProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "onClick"> {
    variant?: "filled" | "outlined" | "tonal" | "text";
    size?: "small" | "medium" | "large";
    icon?: React.ComponentType<{
        size: number;
    }>;
    iconSize?: number;
    trailingIcon?: React.ComponentType<{
        size: number;
    }>;
    trailingToggled?: boolean;
    disabled?: boolean;
    loading?: boolean;
    fullWidth?: boolean;
    onClick?: (e: MouseEvent<HTMLButtonElement>) => void;
    onTrailingClick?: (e: MouseEvent<HTMLButtonElement>) => void;
    "aria-label"?: string;
    trailingAriaLabel?: string;
}
/**
 * SplitButtonComponent — Material Design 3 Split Button
 *
 * A compound button that splits into two interactive zones:
 *   • Leading button – performs the primary/default action
 *   • Trailing button – triggers a secondary action (e.g. menu toggle)
 *
 * The two zones share a common container shape but maintain independent
 * state layers, ripple indicators, and focus rings per M3 spec.
 *
 * M3 Spec: https://m3.material.io/components/split-button/specs
 *
 * Anatomy:
 *   ┌─────────────────────────┬──────┐
 *   │  [Icon]  Label Text     │  ▼   │
 *   └─────────────────────────┴──────┘
 *   ← leading action button →  ← trailing toggle →
 *   └──── divider (1px) ─────┘
 */
declare const SplitButtonComponent: import("react").ForwardRefExoticComponent<SplitButtonComponentProps & import("react").RefAttributes<HTMLDivElement>>;
export default SplitButtonComponent;
//# sourceMappingURL=SplitButtonComponent.d.ts.map