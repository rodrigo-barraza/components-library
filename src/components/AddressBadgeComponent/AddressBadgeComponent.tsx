// @ts-nocheck
"use client";

import BadgeComponent from "../BadgeComponent/BadgeComponent.tsx";
import styles from "./AddressBadgeComponent.module.css";

/**
 * AddressBadgeComponent — Semantic badge for a network socket address (IP:port).
 *
 * Strips the protocol prefix and displays the raw address in monospace.
 * Optionally renders as a clickable link.
 *
 * @param {string} address — Full URL or raw address (e.g. "http://192.168.86.2:3000")
 * @param {boolean} [link=false] — Render as an anchor tag
 * @param {string} [className] — Additional CSS class
 */
export default function AddressBadgeComponent({ address, link = false, className, ...rest }) {
  if (!address) return null;

  const display = address.replace(/^https?:\/\//, "");

  const badge = (
    <BadgeComponent
      variant="info"
      className={`${styles.badge} ${className || ""}`}
      tooltip={`Internal address: ${display}`}
      {...rest}
    >
      {display}
    </BadgeComponent>
  );

  if (link) {
    const href = address.startsWith("http") ? address : `http://${address}`;
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={styles.link}
      >
        {badge}
      </a>
    );
  }

  return badge;
}
