// @ts-nocheck
"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import styles from "./LoadingStateComponent.module.css";
/**
 * LoadingStateComponent — Centered loading indicator with a pulsing dot and message.
 *
 * @param {string} [message="Loading…"] — Text shown beside the dot
 * @param {string} [className] — Additional CSS class
 */
export default function LoadingStateComponent({ message = "Loading…", className }) {
    return (_jsxs("div", { className: `${styles.loadingState}${className ? ` ${className}` : ""}`, children: [_jsx("div", { className: styles.loadingDot }), _jsx("span", { children: message })] }));
}
//# sourceMappingURL=LoadingStateComponent.js.map