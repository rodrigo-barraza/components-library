import useTweenValue from "../../hooks/useTweenValue.js";
import TooltipComponent from "../TooltipComponent/TooltipComponent.js";
import styles from "./MetricBadgeComponent.module.css";

/**
 * MetricBadgeComponent — Generic inline metric pill with optional icon,
 * count-up tween animation, and tooltip.
 *
 * Replaces the pattern of 17+ nearly-identical badge components in prism-client
 * (CostBadge, TokenCountBadge, RequestCountBadge, ThroughputBadge, etc.) with
 * a single parameterized component.
 */
export default function MetricBadgeComponent({
  value,
  label,
  icon,
  tooltip,
  formatFn,
  color,
  tween = false,
  tweenDuration = 600,
  round = true,
  mini = false,
  hideWhenZero = true,
  className = "",
}) {
  const [displayValue, tweening] = useTweenValue(value, {
    duration: tweenDuration,
    round,
    enabled: tween,
  });

  if (hideWhenZero && (!value || value <= 0)) return null;

  const formattedValue = formatFn
    ? formatFn(displayValue)
    : round
      ? Math.round(displayValue).toLocaleString()
      : displayValue.toLocaleString();

  const tooltipLabel = tooltip || `${Math.round(value).toLocaleString()}${label ? ` ${label}` : ""}`;

  // Resolve color class or inline style
  const colorClass = color && styles[color] ? styles[color] : "";
  const customColorStyle = color && !styles[color]
    ? { "--metric-color": color } as React.CSSProperties
    : undefined;

  return (
    <TooltipComponent label={tooltipLabel} position="top">
      <span
        className={[
          styles.badge,
          colorClass,
          !colorClass && color ? styles.custom : "",
          mini ? styles.mini : "",
          tweening ? styles.tweening : "",
          className,
        ].filter(Boolean).join(" ")}
        style={customColorStyle}
      >
        {icon && <span className={styles.icon}>{icon}</span>}
        <span>{formattedValue}</span>
        {label && <span>{label}</span>}
      </span>
    </TooltipComponent>
  );
}
