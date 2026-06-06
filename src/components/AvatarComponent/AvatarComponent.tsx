"use client";

import { useState, ElementType, ComponentPropsWithoutRef, ReactNode } from "react";
import styles from "./AvatarComponent.module.css";

export interface AvatarComponentProps extends ComponentPropsWithoutRef<"div"> {
  src?: string;
  alt?: string;
  name?: string;
  icon?: ElementType;
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  status?: "online" | "offline" | "busy" | "away";
}

/**
 * AvatarComponent — M3-inspired avatar with image, initials, or icon fallback.
 *
 * Supports five sizes and an optional online/offline/busy/away status dot.
 * Compound sub-component `AvatarComponent.Group` stacks avatars with
 * overlapping borders and a "+N" overflow indicator.
 */
export default function AvatarComponent({
  src,
  alt = "",
  name,
  icon: Icon,
  size = "md",
  status,
  className,
  style,
  ...rest
}: AvatarComponentProps) {
  const [imgError, setImgError] = useState(false);

  const initials = name
    ? name
        .split(" ")
        .filter(Boolean)
        .map((word: string) => word[0])
        .slice(0, 2)
        .join("")
        .toUpperCase()
    : null;

  const showImage = src && !imgError;

  const iconSize =
    size === "xs" ? 12 : size === "sm" ? 14 : size === "lg" ? 22 : size === "xl" ? 28 : 18;

  const classes = [styles['avatar'], styles[size], className].filter(Boolean).join(" ");

  return (
    <div className={classes} style={style} {...rest}>
      {showImage ? (
        <img
          src={src}
          alt={alt || name || ""}
          className={styles['image']}
          draggable={false}
          onError={() => setImgError(true)}
        />
      ) : initials ? (
        <span className={styles['initials']}>{initials}</span>
      ) : Icon ? (
        <Icon size={iconSize} className={styles['icon']} />
      ) : (
        <span className={styles['initials']}>?</span>
      )}

      {status && (
        <span
          className={`${styles['status']} ${styles[`status-${status}`]}`}
          aria-label={status}
        />
      )}
    </div>
  );
}

/* ── AvatarGroup ─────────────────────────────────────────── */

export interface AvatarGroupProps {
  max?: number;
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  className?: string;
  children?: ReactNode;
}

/**
 * AvatarComponent.Group — stacks avatars with overlapping layout.
 */
function AvatarGroup({ max = 5, size = "md", className, children }: AvatarGroupProps) {
  const items = Array.isArray(children) ? children : children ? [children] : [];
  const visible = items.slice(0, max);
  const overflow = items.length - max;

  return (
    <div className={`${styles['group']} ${className || ""}`}>
      {visible.map((child, i) => (
        <div key={i} className={styles['group-item']} style={{ zIndex: visible.length - i }}>
          {child}
        </div>
      ))}
      {overflow > 0 && (
        <div className={`${styles['avatar']} ${styles[size]} ${styles['overflow']}`}>
          <span className={styles['initials']}>+{overflow}</span>
        </div>
      )}
    </div>
  );
}

AvatarComponent.Group = AvatarGroup;

