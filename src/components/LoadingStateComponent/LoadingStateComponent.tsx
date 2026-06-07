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
    <div className={`loading-state-component ${styles['loading-state']}${className ? ` ${className}` : ""}`}>
      <div className={styles['loading-dot']} />
      <span>{message}</span>
    </div>
  );
}
