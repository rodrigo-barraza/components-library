"use client";

import styles from "./SkeletonComponent.module.css";

/**
 * SkeletonComponent — Content placeholder loader with shimmer animation.
 *
 * Renders a grey, pulsing rectangle that indicates where content will appear.
 * Follows the "skeleton screen" pattern — the industry-standard approach for
 * perceived performance in data-heavy views.
 *
 * Supports text lines, circular avatars, rectangular cards, and fully custom
 * dimensions via width/height props.
 */
export default function SkeletonComponent({
  variant = "text",
  width,
  height,
  lines = 1,
  animate = true,
  className = "",
  id,
}) {
  const resolveSize = (value) =>
    value == null ? undefined : typeof value === "number" ? `${value}px` : value;

  const baseClass = [
    styles.skeleton,
    styles[variant],
    animate && styles.animate,
    className,
  ]
    .filter(Boolean)
    .join(" ");

  // Text variant: render multiple lines
  if (variant === "text" && lines > 1) {
    return (
      <div className={styles.textGroup} id={id}>
        {Array.from({ length: lines }, (_, i) => {
          // Last line is shorter for a natural look
          const isLast = i === lines - 1;
          const lineWidth = isLast ? "75%" : width || "100%";
          return (
            <div
              key={i}
              className={baseClass}
              style={{
                width: resolveSize(lineWidth),
                height: resolveSize(height),
              }}
              aria-hidden="true"
            />
          );
        })}
      </div>
    );
  }

  return (
    <div
      id={id}
      className={baseClass}
      style={{
        width: resolveSize(width),
        height: resolveSize(height),
      }}
      role="status"
      aria-label="Loading"
      aria-hidden="true"
    />
  );
}

/**
 * SkeletonGroup — Compose multiple skeleton shapes inside a container.
 */
export function SkeletonGroup({
  gap = "12px",
  direction = "column",
  className = "",
  children,
}) {
  return (
    <div
      className={`${styles.group} ${className}`}
      style={{ gap, flexDirection: direction as React.CSSProperties['flexDirection'] }}
      role="status"
      aria-label="Loading content"
    >
      {children}
    </div>
  );
}
