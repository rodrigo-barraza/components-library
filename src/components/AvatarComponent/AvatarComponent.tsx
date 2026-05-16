// @ts-nocheck
"use client";

import { useState } from "react";
import styles from "./AvatarComponent.module.css";

/**
 * AvatarComponent — M3-inspired avatar with image, initials, or icon fallback.
 *
 * Supports five sizes and an optional online/offline/busy/away status dot.
 * Compound sub-component `AvatarComponent.Group` stacks avatars with
 * overlapping borders and a "+N" overflow indicator.
 *
 * @param {string}   [src]                — Image URL
 * @param {string}   [alt=""]             — Alt text for the image
 * @param {string}   [name]               — Full name for initials fallback (picks first + last initial)
 * @param {React.ComponentType} [icon]    — Lucide-compatible icon as fallback (after initials)
 * @param {"xs"|"sm"|"md"|"lg"|"xl"} [size="md"] — Size preset
 * @param {"online"|"offline"|"busy"|"away"} [status] — Status dot indicator
 * @param {string}   [className]
 * @param {object}   [style]
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
}) {
  const [imgError, setImgError] = useState(false);

  const initials = name
    ? name
        .split(" ")
        .filter(Boolean)
        .map((w) => w[0])
        .slice(0, 2)
        .join("")
        .toUpperCase()
    : null;

  const showImage = src && !imgError;

  const iconSize =
    size === "xs" ? 12 : size === "sm" ? 14 : size === "lg" ? 22 : size === "xl" ? 28 : 18;

  const classes = [styles.avatar, styles[size], className].filter(Boolean).join(" ");

  return (
    <div className={classes} style={style} {...rest}>
      {showImage ? (
        <img
          src={src}
          alt={alt || name || ""}
          className={styles.image}
          draggable={false}
          onError={() => setImgError(true)}
        />
      ) : initials ? (
        <span className={styles.initials}>{initials}</span>
      ) : Icon ? (
        <Icon size={iconSize} className={styles.icon} />
      ) : (
        <span className={styles.initials}>?</span>
      )}

      {status && (
        <span
          className={`${styles.status} ${styles[`status-${status}`]}`}
          aria-label={status}
        />
      )}
    </div>
  );
}

/* ── AvatarGroup ─────────────────────────────────────────── */

/**
 * AvatarComponent.Group — stacks avatars with overlapping layout.
 *
 * @param {number}   [max=5]       — Max visible avatars before "+N" overflow
 * @param {"xs"|"sm"|"md"|"lg"|"xl"} [size="md"] — Size applied to all children
 * @param {string}   [className]
 * @param {React.ReactNode} children — AvatarComponent instances
 */
function AvatarGroup({ max = 5, size = "md", className, children }) {
  const items = Array.isArray(children) ? children : children ? [children] : [];
  const visible = items.slice(0, max);
  const overflow = items.length - max;

  return (
    <div className={`${styles.group} ${className || ""}`}>
      {visible.map((child, i) => (
        <div key={i} className={styles.groupItem} style={{ zIndex: visible.length - i }}>
          {child}
        </div>
      ))}
      {overflow > 0 && (
        <div className={`${styles.avatar} ${styles[size]} ${styles.overflow}`}>
          <span className={styles.initials}>+{overflow}</span>
        </div>
      )}
    </div>
  );
}

AvatarComponent.Group = AvatarGroup;
