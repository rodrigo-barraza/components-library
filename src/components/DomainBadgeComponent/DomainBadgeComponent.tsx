"use client";

import BadgeComponent from "../BadgeComponent/BadgeComponent.js";
import styles from "./DomainBadgeComponent.module.css";

/**
 * DomainBadgeComponent — Semantic badge for a service's public domain.
 *
 * Renders the domain as a clickable badge linking to the HTTPS URL.
 * Accepts a Globe icon via props to stay icon-library-agnostic.
 */
export default function DomainBadgeComponent({ domain, icons, className, ...rest }) {
  if (!domain) return null;

  const { Globe } = icons || {};

  return (
    <a
      href={`https://${domain}`}
      target="_blank"
      rel="noopener noreferrer"
      className={styles.link}
    >
      <BadgeComponent
        variant="accent"
        className={`${styles.badge} ${className || ""}`}
        tooltip={`https://${domain}`}
        {...rest}
      >
        {Globe && <Globe size={9} strokeWidth={2.2} />}
        {domain}
      </BadgeComponent>
    </a>
  );
}
