/**
 * SparklineComponent — GPU-composited Canvas sparkline area chart.
 *
 * Renders a smooth, filled line chart suitable for inline metrics
 * (CPU %, memory usage, etc.). Uses monotone cubic interpolation for
 * visually-pleasant curves, a gradient fill under the line, a glow
 * effect on the stroke, and a trailing "current value" dot.
 *
 * @param {number[]} data — Array of numeric samples (newest last)
 * @param {string} [color="#10b981"] — Line/fill color (hex or CSS var())
 * @param {number} [maxValue=100] — Y-axis ceiling (data is clamped to this)
 * @param {number} [height=48] — Canvas CSS height in px
 * @param {number} [historyMax=60] — Total slots in the X axis (controls density)
 * @param {string} [className] — Extra class for the wrapper div
 */
export default function SparklineComponent({ data, color, maxValue, height, historyMax, className, }: {
    data: any;
    color?: string;
    maxValue?: number;
    height?: number;
    historyMax?: number;
    className: any;
}): import("react/jsx-runtime").JSX.Element;
//# sourceMappingURL=SparklineComponent.d.ts.map