export interface SliderComponentProps<T extends number | number[] = number | number[]> {
    value: T;
    min?: number;
    max?: number;
    step?: number;
    onChange: (value: T) => void;
    disabled?: boolean;
    centered?: boolean;
    showValue?: boolean;
    discrete?: boolean;
    label?: string;
    formatValue?: (v: number) => string;
    className?: string;
    id?: string;
}
/**
 * SliderComponent — M3-compliant slider with continuous, discrete, centered,
 * and range selection configurations.
 *
 * M3 Spec Reference:
 *   • Active track:   4px height, primary fill, 2px border-radius
 *   • Inactive track: 4px height, secondary-container fill
 *   • Handle (thumb):  20px diameter, primary color, 40px state layer
 *   • Value indicator: Teardrop label shown during press/drag
 *   • Tick marks:      4×4px circles at each discrete step
 *   • Stop indicators: 4×4px dots at track endpoints
 *
 * Accessibility (WCAG 2.1 AA):
 *   • role="slider" with aria-valuemin, aria-valuemax, aria-valuenow, aria-valuetext
 *   • Keyboard: Arrow keys step ±1, Page Up/Down step ±10%, Home/End to min/max
 *   • Focus-visible state layer for keyboard navigation
 *   • Minimum 48×48px touch target via state layer
 *
 * Configurations:
 *   • Continuous (default):  Smooth selection across full range
 *   • Discrete (step > 0):   Snaps to defined increments, shows tick marks
 *   • Centered:              Origin at center, fills left/right from midpoint
 *   • Range:                 Two handles for selecting a value range
 */
export default function SliderComponent<T extends number | number[]>({ value, min, max, step, onChange, disabled, centered, showValue, discrete, label, formatValue, className, id, }: SliderComponentProps<T>): import("react/jsx-runtime").JSX.Element;
//# sourceMappingURL=SliderComponent.d.ts.map