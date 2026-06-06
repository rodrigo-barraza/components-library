import { useEffect } from "react";
import styles from "./ErrorFallbackComponent.module.css";

export interface ErrorFallbackComponentProps {
  error?: Error | null;
  reset?: () => void;
  title?: string;
  logLabel?: string;
  icon?: string;
}

/**
 * ErrorFallbackComponent — Shared error recovery UI for Next.js
 * `error.js` route boundaries. Replaces inline-styled error pages
 * across all client projects with a single, theme-aware component.
 *
 * **Usage in error.js:**
 * ```js
 * "use client";
 * import ErrorFallbackComponent from "@rodrigo-barraza/components-library/src/components/ErrorFallbackComponent/ErrorFallbackComponent";
 * export default function Error({ error, reset }) {
 *   return <ErrorFallbackComponent error={error} reset={reset} />;
 * }
 * ```
 */
export default function ErrorFallbackComponent({
  error,
  reset,
  title = "This page couldn’t load",
  logLabel = "[Error]",
  icon = "⚠",
}: ErrorFallbackComponentProps) {
  useEffect(() => {
    console.error(`${logLabel} Unhandled error:`, error);
  }, [error, logLabel]);

  return (
    <div className={styles.container}>
      <div className={styles.icon}>{icon}</div>
      <h2 className={styles.title}>{title}</h2>
      <p className={styles.message}>
        {error?.message || "An unexpected error occurred."}
      </p>
      <button className={styles['retry-button']} onClick={reset}>
        Try Again
      </button>
    </div>
  );
}
