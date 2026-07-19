"use client";

import { forwardRef, type ReactNode, type CSSProperties, type MouseEvent } from "react";
import { cx } from "@rodrigo-barraza/utilities-library";
import styles from "./CardComponent.module.css";

interface CardComponentProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "elevated" | "filled" | "outlined";
  interactive?: boolean;
  draggable?: boolean;
  fullWidth?: boolean;
}

interface CardHeaderProps {
  icon?: React.ComponentType<{ size: number; className?: string }>;
  title?: string;
  subtitle?: string;
  children?: ReactNode;
  className?: string;
}

interface CardMediaProps {
  src?: string;
  alt?: string;
  height?: number | string;
  aspectRatio?: string;
  position?: "top" | "bottom";
  className?: string;
  children?: ReactNode;
}

interface CardBodyProps {
  children?: ReactNode;
  className?: string;
}

interface CardFooterProps {
  children?: ReactNode;
  className?: string;
}

interface CardActionAreaProps extends React.HTMLAttributes<HTMLElement> {
  onClick?: (event: MouseEvent<HTMLButtonElement>) => void;
  href?: string;
}

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
}: CardComponentProps) {
  const classes = [
    "card-component",
    styles['card'],
    styles[variant],
    interactive && styles['interactive'],
    isDraggable && styles['draggable'],
    fullWidth && styles['full-width'],
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

function CardHeader({ icon: Icon, title, subtitle, children, className }: CardHeaderProps) {
  return (
    <div className={`${styles['header']}${className ? ` ${className}` : ""}`}>
      {Icon && <Icon size={16} className={styles['icon']} />}
      {title && <span className={styles['title']}>{title}</span>}
      {subtitle && <span className={styles['subtitle']}>{subtitle}</span>}
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
}: CardMediaProps) {
  const mediaStyle: CSSProperties = {};
  if (height) mediaStyle.height = typeof height === "number" ? `${height}px` : height;
  if (aspectRatio) mediaStyle.aspectRatio = aspectRatio;

  return (
    <div
      className={[styles['media'], styles[`media-${position}`], className]
        .filter(Boolean)
        .join(" ")}
      style={Object.keys(mediaStyle).length ? mediaStyle : undefined}
    >
      {children || (
        src ? (
          <img
            src={src}
            alt={alt}
            className={styles['media-image']}
            loading="lazy"
            draggable={false}
          />
        ) : null
      )}
    </div>
  );
}

/* ── Body ────────────────────────────────────────────────────────── */

function CardBody({ children, className }: CardBodyProps) {
  return (
    <div className={`${styles['body']}${className ? ` ${className}` : ""}`}>
      {children}
    </div>
  );
}

/* ── Footer ──────────────────────────────────────────────────────── */

function CardFooter({ children, className }: CardFooterProps) {
  return (
    <div className={`${styles['footer']}${className ? ` ${className}` : ""}`}>
      {children}
    </div>
  );
}

/* ── Action Area ─────────────────────────────────────────────────── */

/**
 * CardActionArea — wraps card content to make it clickable / tappable.
 * Renders a full-surface interactive layer with ripple and state layer.
 */
const CardActionArea = forwardRef<HTMLAnchorElement | HTMLButtonElement, CardActionAreaProps>(function CardActionArea(
  { onClick, href, className, children, ...rest },
  ref,
) {
  const classes = cx(styles['action-area'], className);

  if (href) {
    return (
      <a ref={ref as React.Ref<HTMLAnchorElement>} href={href} className={classes} {...rest}>
        <span className={styles['state-layer']} />
        {children}
      </a>
    );
  }

  return (
    <button ref={ref as React.Ref<HTMLButtonElement>} type="button" onClick={onClick} className={classes} {...rest}>
      <span className={styles['state-layer']} />
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
