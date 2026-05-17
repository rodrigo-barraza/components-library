/**
 * ResponseTimeBadgeComponent — Threshold-based semantic badge for response latency.
 *
 * Color-codes the response time value based on performance tiers:
 * - ≤ 25ms  → Excellent (green)
 * - ≤ 50ms  → Good (blue)
 * - ≤ 100ms → Fair (amber)
 * - > 100ms → Slow (red)
 *
 * @param {number} ms — Response time in milliseconds
 * @param {(ms: number) => string} [formatter] — Custom formatter (defaults to `${ms}ms`)
 * @param {string} [className] — Additional CSS class
 */
export default function ResponseTimeBadgeComponent({ ms, formatter, className, ...rest }: {
    [x: string]: any;
    ms: any;
    formatter: any;
    className: any;
}): import("react/jsx-runtime").JSX.Element | null;
//# sourceMappingURL=ResponseTimeBadgeComponent.d.ts.map