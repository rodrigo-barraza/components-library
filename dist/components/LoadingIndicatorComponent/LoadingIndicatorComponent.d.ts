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
 *   • `role="progressbar"` on the indicator element
 *   • `aria-valuemin="0"` and `aria-valuemax="100"` always present
 *   • `aria-valuenow` set to current value for determinate, omitted for indeterminate
 *   • `aria-label` provided via `ariaLabel` prop — required for screen readers
 *   • `aria-busy="true"` can be set on the loading region by the consumer
 *   • `aria-live="polite"` on label for progress updates
 *   • Reduced motion: animation durations extended (not removed) per M3 guidelines
 *
 * @param {"circular"|"linear"} [variant="circular"]  — Indicator shape
 * @param {"indeterminate"|"determinate"} [mode="indeterminate"] — Animation mode
 * @param {number}  [value=0]              — Progress 0–100 (determinate only)
 * @param {number|null} [buffer=null]      — 0–100 buffer fill (linear determinate only)
 * @param {"small"|"medium"|"large"} [size="medium"] — Circular size preset
 * @param {"thin"|"default"|"thick"} [trackSize="default"] — Linear track height
 * @param {"primary"|"secondary"|"tertiary"|"error"|"inherit"} [color="primary"]
 * @param {boolean} [showPercentage=false] — Show % text inside circular indicator
 * @param {string}  [label]               — Optional descriptive label below indicator
 * @param {string}  [ariaLabel="Loading"]  — Accessible label for screen readers
 * @param {string}  [className]           — Additional CSS class
 * @param {string}  [id]                  — Element ID
 */
export default function LoadingIndicatorComponent({ variant, mode, value, buffer, size, trackSize, color, showPercentage, label, ariaLabel, className, id, }: {
    variant?: string | undefined;
    mode?: string | undefined;
    value?: number | undefined;
    buffer?: null | undefined;
    size?: string | undefined;
    trackSize?: string | undefined;
    color?: string | undefined;
    showPercentage?: boolean | undefined;
    label: any;
    ariaLabel?: string | undefined;
    className?: string | undefined;
    id: any;
}): import("react/jsx-runtime").JSX.Element;
//# sourceMappingURL=LoadingIndicatorComponent.d.ts.map