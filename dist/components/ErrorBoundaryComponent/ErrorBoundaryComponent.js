// @ts-nocheck
"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Component } from "react";
import styles from "./ErrorBoundaryComponent.module.css";
/**
 * ErrorBoundaryComponent — React Error Boundary that catches render errors
 * and displays a styled fallback UI instead of a white screen.
 *
 * Wrap page layouts or critical subtrees to prevent the entire app from
 * unmounting on an unexpected exception.
 *
 * @param {React.ReactNode} children — Protected subtree
 * @param {React.ReactNode} [fallback] — Custom fallback UI (default: built-in error card)
 * @param {string} [title] — Error card heading (default: "Something went wrong")
 * @param {string} [subtitle] — Error card description
 * @param {(error: Error, info: { componentStack: string }) => void} [onError] — Error callback
 * @param {boolean} [showDetails] — Show error.message in the fallback (default: false)
 */
export default class ErrorBoundaryComponent extends Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null };
    }
    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }
    componentDidCatch(error, info) {
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
        const { title = "Something went wrong", subtitle = "An unexpected error occurred. Try refreshing the page.", showDetails = false, } = this.props;
        return (_jsx("div", { className: styles.errorBoundary, children: _jsxs("div", { className: styles.errorCard, children: [_jsx("div", { className: styles.iconContainer, children: _jsxs("svg", { className: styles.icon, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "1.5", strokeLinecap: "round", strokeLinejoin: "round", children: [_jsx("circle", { cx: "12", cy: "12", r: "10" }), _jsx("line", { x1: "12", y1: "8", x2: "12", y2: "12" }), _jsx("line", { x1: "12", y1: "16", x2: "12.01", y2: "16" })] }) }), _jsx("h2", { className: styles.title, children: title }), _jsx("p", { className: styles.subtitle, children: subtitle }), showDetails && this.state.error?.message && (_jsx("pre", { className: styles.details, children: this.state.error.message })), _jsx("button", { className: styles.retryButton, onClick: this.handleRetry, children: "Try Again" })] }) }));
    }
}
//# sourceMappingURL=ErrorBoundaryComponent.js.map