/**
 * ProgressBarComponent — M3 Linear Progress Indicator.
 *
 * Two modes:
 *   • **Determinate** — pass `value` (0–100) to show a definite progress bar
 *   • **Indeterminate** — omit `value` to show the M3 infinite sliding animation
 *
 * @param {number}   [value]                — Progress percentage (0–100). Omit for indeterminate.
 * @param {"accent"|"success"|"warning"|"danger"|"info"} [variant="accent"] — Color theme
 * @param {"sm"|"md"|"lg"} [size="md"]     — Track height preset
 * @param {string}   [label]               — Optional text label displayed above the bar
 * @param {boolean}  [showValue=false]     — Display percentage text
 * @param {boolean}  [animated=true]       — Animate the bar fill transition
 * @param {boolean}  [striped=false]       — Add diagonal stripe pattern on the active bar
 * @param {string}   [className]
 */
export default function ProgressBarComponent({ value, variant, size, label, showValue, animated, striped, className, ...rest }: {
    [x: string]: any;
    value: any;
    variant?: string | undefined;
    size?: string | undefined;
    label: any;
    showValue?: boolean | undefined;
    animated?: boolean | undefined;
    striped?: boolean | undefined;
    className: any;
}): import("react/jsx-runtime").JSX.Element;
//# sourceMappingURL=ProgressBarComponent.d.ts.map