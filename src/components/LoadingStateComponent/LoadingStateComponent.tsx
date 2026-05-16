// @ts-nocheck
"use client";

import styles from "./LoadingStateComponent.module.css";

/**
 * LoadingStateComponent — Centered loading indicator with a pulsing dot and message.
 *
 * @param {string} [message="Loading…"] — Text shown beside the dot
 * @param {string} [className] — Additional CSS class
 */
export default function LoadingStateComponent({ message = "Loading…", className }) {
  return (
    <div className={`${styles.loadingState}${className ? ` ${className}` : ""}`}>
      <div className={styles.loadingDot} />
      <span>{message}</span>
    </div>
  );
}
