/**
 * StatusDotComponent — Reusable health/connectivity indicator dot.
 *
 * Renders a colored, optionally pulsing circle to indicate status at a glance.
 * Designed to be large and obvious by default (md = 12px).
 *
 * @param {"healthy"|"unhealthy"|"warning"|"inactive"|"info"} [variant="healthy"] — Semantic color
 * @param {"sm"|"md"|"lg"} [size="md"] — Dot diameter (sm=8, md=12, lg=16)
 * @param {boolean} [pulse=true] — Whether to animate a pulse (healthy/warning default on)
 * @param {string} [className] — Additional CSS class
 */
export default function StatusDotComponent({ variant, size, pulse, className, ...rest }: {
    [x: string]: any;
    variant?: string;
    size?: string;
    pulse?: boolean;
    className?: string;
}): import("react/jsx-runtime").JSX.Element;
//# sourceMappingURL=StatusDotComponent.d.ts.map