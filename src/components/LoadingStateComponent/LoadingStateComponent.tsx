"use client";

import styles from "./LoadingStateComponent.module.css";

/**
 * LoadingStateComponent — Centered loading indicator with a pulsing dot and message.
 */
export default function LoadingStateComponent({ message = "Loading…", className }) {
  return (
    <div className={`${styles.loadingState}${className ? ` ${className}` : ""}`}>
      <div className={styles.loadingDot} />
      <span>{message}</span>
    </div>
  );
}
