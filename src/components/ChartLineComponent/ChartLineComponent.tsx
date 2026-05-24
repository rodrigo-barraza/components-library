"use client";

import React, { useRef, useEffect, useState, useCallback } from "react";
import styles from "./ChartLineComponent.module.css";

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
export default function ChartLineComponent({
  data,
  color = "#10b981",
  maxValue = 100,
  height = 48,
  historyMax = 60,
  showGrid = false,
  formatValue,
  className,
}: ChartLineComponentProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Hover state — null when mouse is outside
  const [hover, setHover] = useState<{ x: number; value: number; containerWidth: number } | null>(null);

  // Cache resolved color components for crosshair drawing
  const colorRef = useRef({ r: 16, g: 185, b: 129, resolved: "#10b981" });

  // ── Resolve color once on change ──
  useEffect(() => {
    const resolvedColor = color.startsWith("var(")
      ? getComputedStyle(document.documentElement)
          .getPropertyValue(color.slice(4, -1))
          .trim() || "#10b981"
      : color;

    const parseColor = (c: string): [number, number, number] => {
      if (c.startsWith("#")) {
        const hex = c.slice(1);
        return [
          parseInt(hex.slice(0, 2), 16),
          parseInt(hex.slice(2, 4), 16),
          parseInt(hex.slice(4, 6), 16),
        ];
      }
      const match = c.match(/(\d+)/);
      return match ? [+match[1], +match[1], +match[1]] : [16, 185, 129];
    };
    const [r, g, b] = parseColor(resolvedColor);
    colorRef.current = { r, g, b, resolved: resolvedColor };
  }, [color]);

  // ── Mouse handlers ──
  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const container = containerRef.current;
      if (!container || data.length < 2) return;

      const rect = container.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const w = rect.width;

      const padding = { left: 0, right: 0 };
      const chartW = w - padding.left - padding.right;

      // Find nearest data index from mouse X position
      const ratio = (mouseX - padding.left) / chartW;
      const floatIndex = ratio * (historyMax - 1);
      const nearestIndex = Math.round(floatIndex);
      const clampedIndex = Math.max(0, Math.min(data.length - 1, nearestIndex));

      const dataPointValue = data[clampedIndex];
      const pointX =
        padding.left + (clampedIndex / (historyMax - 1)) * chartW;

      setHover({ x: pointX, value: dataPointValue, containerWidth: w });
    },
    [data, historyMax],
  );

  const handleMouseLeave = useCallback(() => {
    setHover(null);
  }, []);

  // ── Main draw effect ──
  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const rect = container.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    const w = rect.width;
    const h = height;

    canvas.width = w * dpr;
    canvas.height = h * dpr;
    canvas.style.width = `${w}px`;
    canvas.style.height = `${h}px`;

    const canvasContext = canvas.getContext("2d");
    if (!canvasContext) return;
    canvasContext.scale(dpr, dpr);
    canvasContext.clearRect(0, 0, w, h);

    // ── Optional grid background ──
    if (showGrid) {
      canvasContext.save();
      canvasContext.strokeStyle = "rgba(128, 128, 128, 0.15)";
      canvasContext.lineWidth = 0.5;

      // Horizontal grid lines (3 evenly spaced)
      const hLines = 3;
      for (let i = 1; i <= hLines; i++) {
        const y = (h / (hLines + 1)) * i;
        canvasContext.beginPath();
        canvasContext.moveTo(0, y);
        canvasContext.lineTo(w, y);
        canvasContext.stroke();
      }

      // Vertical grid lines — every ~15 sample slots
      const vStep = Math.max(15, Math.round(historyMax / 5));
      for (let i = vStep; i < historyMax; i += vStep) {
        const x = (i / (historyMax - 1)) * w;
        canvasContext.beginPath();
        canvasContext.moveTo(x, 0);
        canvasContext.lineTo(x, h);
        canvasContext.stroke();
      }

      canvasContext.restore();
    }

    if (data.length < 2) return;

    const { r, g, b } = colorRef.current;

    const padding = { top: 2, bottom: 2, left: 0, right: 0 };
    const chartW = w - padding.left - padding.right;
    const chartH = h - padding.top - padding.bottom;
    const clampedMax = Math.max(maxValue, 1);

    // Map data points to coordinates — always draw across full width
    const points = data.map((dataValue, i) => ({
      x: padding.left + (i / (historyMax - 1)) * chartW,
      y:
        padding.top +
        chartH -
        (Math.min(dataValue, clampedMax) / clampedMax) * chartH,
    }));

    // Build smooth path using monotone cubic interpolation (Catmull-Rom)
    const buildPath = () => {
      canvasContext.moveTo(points[0].x, points[0].y);
      for (let i = 0; i < points.length - 1; i++) {
        const p0 = points[Math.max(0, i - 1)];
        const p1 = points[i];
        const p2 = points[i + 1];
        const p3 = points[Math.min(points.length - 1, i + 2)];
        const tension = 0.3;
        const cp1x = p1.x + (p2.x - p0.x) * tension;
        const cp1y = p1.y + (p2.y - p0.y) * tension;
        const cp2x = p2.x - (p3.x - p1.x) * tension;
        const cp2y = p2.y - (p3.y - p1.y) * tension;
        canvasContext.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, p2.x, p2.y);
      }
    };

    // ── Gradient fill ──
    canvasContext.beginPath();
    buildPath();
    canvasContext.lineTo(points[points.length - 1].x, h);
    canvasContext.lineTo(points[0].x, h);
    canvasContext.closePath();

    const gradient = canvasContext.createLinearGradient(0, padding.top, 0, h);
    gradient.addColorStop(0, `rgba(${r}, ${g}, ${b}, 0.25)`);
    gradient.addColorStop(0.6, `rgba(${r}, ${g}, ${b}, 0.08)`);
    gradient.addColorStop(1, `rgba(${r}, ${g}, ${b}, 0.01)`);
    canvasContext.fillStyle = gradient;
    canvasContext.fill();

    // ── Line stroke with glow ──
    canvasContext.beginPath();
    buildPath();
    canvasContext.strokeStyle = `rgba(${r}, ${g}, ${b}, 0.9)`;
    canvasContext.lineWidth = 1.5;
    canvasContext.lineJoin = "round";
    canvasContext.lineCap = "round";
    canvasContext.shadowColor = `rgba(${r}, ${g}, ${b}, 0.4)`;
    canvasContext.shadowBlur = 4;
    canvasContext.stroke();
    canvasContext.shadowBlur = 0;

    // ── Hover crosshair + dot ──
    if (hover) {
      const hx = hover.x;

      // Vertical crosshair line
      canvasContext.save();
      canvasContext.beginPath();
      canvasContext.setLineDash([3, 3]);
      canvasContext.strokeStyle = `rgba(${r}, ${g}, ${b}, 0.4)`;
      canvasContext.lineWidth = 1;
      canvasContext.moveTo(hx, 0);
      canvasContext.lineTo(hx, h);
      canvasContext.stroke();
      canvasContext.setLineDash([]);
      canvasContext.restore();

      // Find the Y coordinate for this hover point
      const hoverIndex = Math.round(
        ((hx - padding.left) / chartW) * (historyMax - 1),
      );
      const ci = Math.max(0, Math.min(data.length - 1, hoverIndex));
      const hoverY =
        padding.top +
        chartH -
        (Math.min(data[ci], clampedMax) / clampedMax) * chartH;

      // Hover dot
      canvasContext.beginPath();
      canvasContext.arc(hx, hoverY, 3.5, 0, Math.PI * 2);
      canvasContext.fillStyle = `rgba(${r}, ${g}, ${b}, 1)`;
      canvasContext.shadowColor = `rgba(${r}, ${g}, ${b}, 0.6)`;
      canvasContext.shadowBlur = 8;
      canvasContext.fill();
      canvasContext.shadowBlur = 0;

      // White ring around hover dot
      canvasContext.beginPath();
      canvasContext.arc(hx, hoverY, 3.5, 0, Math.PI * 2);
      canvasContext.strokeStyle = "rgba(255, 255, 255, 0.9)";
      canvasContext.lineWidth = 1.2;
      canvasContext.stroke();
    }

    // ── Current value dot (only when not hovering) ──
    if (!hover && points.length > 0) {
      const last = points[points.length - 1];
      canvasContext.beginPath();
      canvasContext.arc(last.x, last.y, 2.5, 0, Math.PI * 2);
      canvasContext.fillStyle = `rgba(${r}, ${g}, ${b}, 1)`;
      canvasContext.shadowColor = `rgba(${r}, ${g}, ${b}, 0.6)`;
      canvasContext.shadowBlur = 6;
      canvasContext.fill();
      canvasContext.shadowBlur = 0;
    }
  }, [data, color, maxValue, height, historyMax, showGrid, hover]);

  // ── Format the tooltip value ──
  const formattedValue =
    hover != null
      ? formatValue
        ? formatValue(hover.value)
        : typeof hover.value === "number"
          ? hover.value % 1 === 0
            ? String(hover.value)
            : hover.value.toFixed(1)
          : String(hover.value)
      : "";

  // Tooltip positioning — nudge left when near right edge
  const tooltipStyle =
    hover != null
      ? {
          left:
            hover.x > hover.containerWidth - 60
              ? `${hover.x - 4}px`
              : `${hover.x + 4}px`,
          transform:
            hover.x > hover.containerWidth - 60
              ? "translateX(-100%)"
              : "translateX(0)",
        }
      : {};

  return (
    <div
      ref={containerRef}
      className={`${styles.sparklineContainer} ${className || ""}`}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <canvas ref={canvasRef} className={styles.sparklineCanvas} />
      {hover != null && (
        <div className={styles.sparklineTooltip} style={tooltipStyle}>
          {formattedValue}
        </div>
      )}
    </div>
  );
}
