export interface ChartLineComponentProps {
    data: number[];
    color?: string;
    maxValue?: number;
    height?: number;
    historyMax?: number;
    showGrid?: boolean;
    formatValue?: (v: number) => string;
    className?: string;
}
/**
 * ChartLineComponent — GPU-composited Canvas sparkline area chart.
 *
 * Renders a smooth, filled line chart suitable for inline metrics
 * (CPU %, memory usage, etc.). Uses monotone cubic interpolation for
 * visually-pleasant curves, a gradient fill under the line, a glow
 * effect on the stroke, and a trailing "current value" dot.
 *
 * On hover, a vertical crosshair and floating tooltip display the
 * Y-axis value at the nearest data point.
 */
export default function ChartLineComponent({ data, color, maxValue, height, historyMax, showGrid, formatValue, className, }: ChartLineComponentProps): import("react/jsx-runtime").JSX.Element;
//# sourceMappingURL=ChartLineComponent.d.ts.map