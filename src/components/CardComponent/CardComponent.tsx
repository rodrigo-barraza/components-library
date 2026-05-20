"use client";

import { forwardRef } from "react";
import styles from "./CardComponent.module.css";

/**
 * CardComponent — M3-inspired compound card with elevated / filled / outlined variants.
 *
 * Material Design 3 defines three card types:
 *   • elevated  — surface-tint + shadow elevation (default)
 *   • filled   — highest surface container color, no outline
 *   • outlined — thin outline border, no elevation
 *
 * Compound sub-components:
 *   CardComponent.Header      — top bar with icon, title, subtitle, trailing actions
 *   CardComponent.Media       — full-bleed media slot (images, video, illustration)
 *   CardComponent.Body        — main content area with padding
 *   CardComponent.Footer      — bottom bar (e.g. action buttons)
 *   CardComponent.ActionArea  — makes the card (or a region) clickable with ripple
 */
export default function CardComponent({
  variant = "outlined",
  interactive = false,
  draggable: isDraggable = false,
  fullWidth = false,
  className,
  style,
  children,
  ...rest
}) {
  const classes = [
    styles.card,
    styles[variant],
    interactive && styles.interactive,
    isDraggable && styles.draggable,
    fullWidth && styles.fullWidth,
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={classes} style={style} {...rest}>
      {children}
    </div>
  );
}

/* ── Header ──────────────────────────────────────────────────────── */

function CardHeader({ icon: Icon, title, subtitle, children, className }) {
  return (
    <div className={`${styles.header}${className ? ` ${className}` : ""}`}>
      {Icon && <Icon size={16} className={styles.icon} />}
      {title && <span className={styles.title}>{title}</span>}
      {subtitle && <span className={styles.subtitle}>{subtitle}</span>}
      {children}
    </div>
  );
}

/* ── Media ───────────────────────────────────────────────────────── */

/**
 * CardMedia — M3 media slot for full-bleed images, video, or illustrations.
 */
function CardMedia({
  src,
  alt = "",
  height,
  aspectRatio,
  position = "top",
  className,
  children,
}) {
  const mediaStyle: Record<string, any> = {};
  if (height) mediaStyle.height = typeof height === "number" ? `${height}px` : height;
  if (aspectRatio) mediaStyle.aspectRatio = aspectRatio;

  return (
    <div
      className={[styles.media, styles[`media-${position}`], className]
        .filter(Boolean)
        .join(" ")}
      style={Object.keys(mediaStyle).length ? mediaStyle : undefined}
    >
      {children || (
        src ? (
          <img
            src={src}
            alt={alt}
            className={styles.mediaImage}
            loading="lazy"
            draggable={false}
          />
        ) : null
      )}
    </div>
  );
}

/* ── Body ────────────────────────────────────────────────────────── */

function CardBody({ children, className }) {
  return (
    <div className={`${styles.body}${className ? ` ${className}` : ""}`}>
      {children}
    </div>
  );
}

/* ── Footer ──────────────────────────────────────────────────────── */

function CardFooter({ children, className }) {
  return (
    <div className={`${styles.footer}${className ? ` ${className}` : ""}`}>
      {children}
    </div>
  );
}

/* ── Action Area ─────────────────────────────────────────────────── */

/**
 * CardActionArea — wraps card content to make it clickable / tappable.
 * Renders a full-surface interactive layer with ripple and state layer.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any -- renders as anchor or button, polymorphic ref
const CardActionArea = forwardRef<any, any>(function CardActionArea(
  { onClick, href, className, children, ...rest },
  ref,
) {
  const classes = [styles.actionArea, className].filter(Boolean).join(" ");

  if (href) {
    return (
      <a ref={ref} href={href} className={classes} {...rest}>
        <span className={styles.stateLayer} />
        {children}
      </a>
    );
  }

  return (
    <button ref={ref} type="button" onClick={onClick} className={classes} {...rest}>
      <span className={styles.stateLayer} />
      {children}
    </button>
  );
});

/* ── Attach sub-components ───────────────────────────────────────── */

CardComponent.Header = CardHeader;
CardComponent.Media = CardMedia;
CardComponent.Body = CardBody;
CardComponent.Footer = CardFooter;
CardComponent.ActionArea = CardActionArea;
