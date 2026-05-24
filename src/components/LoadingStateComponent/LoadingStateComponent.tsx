import { ReactNode } from "react";
import styles from "./LoadingStateComponent.module.css";

export interface LoadingStateComponentProps {
  message?: string | ReactNode;
  className?: string;
}

/**
 * LoadingStateComponent — Centered loading indicator with a pulsing dot and message.
 */
export default function LoadingStateComponent({ message = "Loading…", className }: LoadingStateComponentProps) {
  return (
    <div className={`${styles.loadingState}${className ? ` ${className}` : ""}`}>
      <div className={styles.loadingDot} />
      <span>{message}</span>
    </div>
  );
}
