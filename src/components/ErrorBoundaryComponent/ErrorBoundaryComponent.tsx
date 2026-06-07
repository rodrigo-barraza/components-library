"use client";

import { Component, type ReactNode } from "react";
import styles from "./ErrorBoundaryComponent.module.css";

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
  title?: string;
  subtitle?: string;
  onError?: (error: Error, info: { componentStack: string }) => void;
  showDetails?: boolean;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

/**
 * ErrorBoundaryComponent — React Error Boundary that catches render errors
 * and displays a styled fallback UI instead of a white screen.
 *
 * Wrap page layouts or critical subtrees to prevent the entire app from
 * unmounting on an unexpected exception.
 */
export default class ErrorBoundaryComponent extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: { componentStack: string }) {
    console.error("[ErrorBoundary] Caught render error:", error.message);
    this.props.onError?.(error, info);
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (!this.state.hasError) {
      return this.props.children;
    }

    if (this.props.fallback) {
      return this.props.fallback;
    }

    const {
      title = "Something went wrong",
      subtitle = "An unexpected error occurred. Try refreshing the page.",
      showDetails = false,
    } = this.props;

    return (
      <div className={`error-boundary-component ${styles['error-boundary']}`}>
        <div className={styles['error-card']}>
          <div className={styles['icon-container']}>
            <svg
              className={styles['icon']}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
          </div>
          <h2 className={styles['title']}>{title}</h2>
          <p className={styles['subtitle']}>{subtitle}</p>
          {showDetails && this.state.error?.message && (
            <pre className={styles['details']}>{this.state.error.message}</pre>
          )}
          <button className={styles['retry-button']} onClick={this.handleRetry}>
            Try Again
          </button>
        </div>
      </div>
    );
  }
}
