import { HTMLAttributes, ReactNode } from "react";
import styles from "./DividerComponent.module.css";

export interface DividerComponentProps extends HTMLAttributes<HTMLElement> {
  variant?: "fullWidth" | "inset" | "middleInset";
  orientation?: "horizontal" | "vertical";
  spacing?: "none" | "small" | "medium" | "large" | string;
  decorative?: boolean;
}

/**
 * DividerComponent — Material Design 3 divider.
 *
 * A thin line that groups content in lists and containers.
 * Renders a semantic `<hr>` (horizontal) or `<div>` (vertical) with
 * appropriate ARIA attributes.
 *
 * M3 defines two variants beyond the default full-width:
 *   • inset       — 16px leading padding (aligns with list text)
 *   • middleInset — 16px inset on both leading and trailing edges
 *
 * @see https://m3.material.io/components/divider/overview
 * @see https://m3.material.io/components/divider/specs
 */
export default function DividerComponent({
  variant = "fullWidth",
  orientation = "horizontal",
  spacing,
  decorative = false,
  className,
  style,
  ...rest
}: DividerComponentProps) {
  const classes = [
    styles.divider,
    styles[orientation],
    variant === "inset" && styles.inset,
    variant === "middleInset" && styles['middle-inset'],
    spacing && spacing.length > 0 && styles[`spacing${spacing.charAt(0).toUpperCase()}${spacing.slice(1)}`],
    className,
  ]
    .filter(Boolean)
    .join(" ");

  /* Accessibility:
     - Decorative dividers (inside lists, between related items) get role="none"
       so screen readers skip them — they're visual sugar, not semantic separators.
     - Semantic dividers get role="separator" + aria-orientation.
       <hr> has implicit role="separator" + orientation="horizontal",
       so we only need explicit attributes for vertical or non-<hr> elements.  */

  if (orientation === "vertical") {
    return (
      <div
        className={classes}
        style={style}
        role={decorative ? "none" : "separator"}
        aria-orientation={decorative ? undefined : "vertical"}
        {...rest}
      />
    );
  }

  return (
    <hr
      className={classes}
      style={style}
      role={decorative ? "none" : undefined}
      aria-orientation={decorative ? undefined : undefined}
      {...rest}
    />
  );
}

/* ── Subheader Divider ───────────────────────────────────────────── */

export interface DividerSubheaderProps extends HTMLAttributes<HTMLDivElement> {
  label: ReactNode;
  variant?: "fullWidth" | "inset" | "middleInset";
}

/**
 * DividerComponent.Subheader — a labeled section divider.
 *
 * Renders a horizontal rule split by a centered text label.
 * Common in lists, settings panels, and form sections.
 * Always decorative — the label itself provides the semantic meaning.
 */
function DividerSubheader({
  label,
  variant = "fullWidth",
  className,
  style,
  ...rest
}: DividerSubheaderProps) {
  const classes = [
    styles.divider,
    styles.subheader,
    variant === "inset" && styles.inset,
    variant === "middleInset" && styles['middle-inset'],
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={classes} style={style} role="none" {...rest}>
      <span className={styles['subheader-line']} />
      <span className={styles['subheader-label']}>{label}</span>
      <span className={styles['subheader-line']} />
    </div>
  );
}

/* ── Attach sub-components ───────────────────────────────────────── */

DividerComponent.Subheader = DividerSubheader;
