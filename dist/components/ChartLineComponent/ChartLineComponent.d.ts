import React from "react";
export interface ChartLineComponentProps {
    data: number[];
    color?: string;
    maxValue?: number;
    height?: number;
    historyMax?: number;
    showGrid?: boolean;
    formatValue?: (value: number) => string;
    className?: string;
}
/**
 * ChartLineComponent — GPU-composited Canvas sparkline area chart.
 *
 * Renders a precise, filled line chart suitable for inline metrics
 * (CPU %, memory usage, etc.). Uses a linear path for exact data
 * point accuracy, a gradient fill under the line, a glow effect on the
 * stroke, and a trailing "current value" dot.
 *
 * On hover, a vertical crosshair and floating tooltip display the
 * Y-axis value at the nearest data point.
 */
export default function ChartLineComponent({ data, color, maxValue, height, historyMax, showGrid, formatValue, className, }: ChartLineComponentProps): React.JSX.Element;
//# sourceMappingURL=ChartLineComponent.d.ts.map