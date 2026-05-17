"use client";

import TooltipComponent from "../TooltipComponent/TooltipComponent.js";
import styles from "./CountBadgeComponent.module.css";

/**
 * CountBadgeComponent — Numeric pill badge with state-driven coloring.
 *
 * States:
 *  - "default"  → existing / already-read data (indigo)
 *  - "new"      → fresh unread data (cyan pulse animation)
 *
 * Modifiers:
 *  - disabled   → greyed out when count is 0
 *  - rainbow    → hue-rotate animation (active workers, etc.)
 *
 * Colors are overridable via CSS custom properties:
 *  - --count-badge-default  (fallback: #6366f1)
 *  - --count-badge-new      (fallback: #22d3ee)
 *
 * @param {number|string} count — The value to display
 * @param {"default"|"new"} [state="default"] — Visual state
 * @param {boolean} [disabled=false] — Force disabled look
 * @param {boolean} [rainbow=false] — Rainbow hue-rotate animation
 * @param {string} [tooltip] — Optional tooltip label on hover
 * @param {string} [className] — Additional class
 */
export default function CountBadgeComponent({
  count,
  state = "default",
  disabled = false,
  rainbow = false,
  tooltip,
  className,
}) {
  if (count == null) return null;

  const isDisabled = disabled || count === 0;

  const stateClass = rainbow
    ? styles.rainbow
    : isDisabled
      ? styles.stateDisabled
      : state === "new"
        ? styles.stateNew
        : styles.stateDefault;

  const badge = (
    <span
      className={`${styles.badge} ${stateClass}${className ? ` ${className}` : ""}`}
    >
      {count}
    </span>
  );

  if (tooltip) {
    return (
      <TooltipComponent label={tooltip} position="top">
        {badge}
      </TooltipComponent>
    );
  }

  return badge;
}
