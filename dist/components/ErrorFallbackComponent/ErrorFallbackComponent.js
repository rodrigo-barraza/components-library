// @ts-nocheck
"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect } from "react";
import styles from "./ErrorFallbackComponent.module.css";
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
 *
 * @param {Error}    error      — The caught error object (from Next.js)
 * @param {Function} reset      — Reset function to retry rendering (from Next.js)
 * @param {string}   [title]    — Custom heading (default: "This page couldn't load")
 * @param {string}   [logLabel] — Console.error prefix (default: "[Error]")
 * @param {string}   [icon]     — Emoji icon (default: "⚠")
 */
export default function ErrorFallbackComponent({ error, reset, title = "This page couldn\u2019t load", logLabel = "[Error]", icon = "\u26A0", }) {
    useEffect(() => {
        console.error(`${logLabel} Unhandled error:`, error);
    }, [error, logLabel]);
    return (_jsxs("div", { className: styles.container, children: [_jsx("div", { className: styles.icon, children: icon }), _jsx("h2", { className: styles.title, children: title }), _jsx("p", { className: styles.message, children: error?.message || "An unexpected error occurred." }), _jsx("button", { className: styles.retryButton, onClick: reset, children: "Try Again" })] }));
}
//# sourceMappingURL=ErrorFallbackComponent.js.map