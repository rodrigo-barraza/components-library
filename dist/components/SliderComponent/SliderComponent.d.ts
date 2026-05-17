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
 *
 * @param {number|[number,number]} value      — Current value(s). Array for range mode.
 * @param {number}                 [min=0]    — Minimum value
 * @param {number}                 [max=100]  — Maximum value
 * @param {number}                 [step=1]   — Step increment (0 for continuous)
 * @param {Function}               onChange   — (value: number|[number,number]) => void
 * @param {boolean}                [disabled] — Disabled state (0.38 opacity, no interaction)
 * @param {boolean}                [centered] — Center-origin mode (fills from midpoint)
 * @param {boolean}                [showValue] — Show value indicator tooltip on drag
 * @param {boolean}                [discrete] — Force discrete mode with tick marks
 * @param {string}                 [label]    — Accessible label (aria-label)
 * @param {Function}               [formatValue] — Custom value formatter for indicator
 * @param {string}                 [className] — Additional wrapper class
 * @param {string}                 [id]       — Element ID
 */
export default function SliderComponent({ value, min, max, step, onChange, disabled, centered, showValue, discrete, label, formatValue, className, id, }: {
    value: any;
    min?: number | undefined;
    max?: number | undefined;
    step?: number | undefined;
    onChange: any;
    disabled?: boolean | undefined;
    centered?: boolean | undefined;
    showValue?: boolean | undefined;
    discrete?: boolean | undefined;
    label: any;
    formatValue: any;
    className?: string | undefined;
    id: any;
}): import("react/jsx-runtime").JSX.Element;
//# sourceMappingURL=SliderComponent.d.ts.map