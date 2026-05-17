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
export default function ErrorFallbackComponent({ error, reset, title, logLabel, icon, }: {
    error: any;
    reset: any;
    title?: string | undefined;
    logLabel?: string | undefined;
    icon?: string | undefined;
}): import("react/jsx-runtime").JSX.Element;
//# sourceMappingURL=ErrorFallbackComponent.d.ts.map