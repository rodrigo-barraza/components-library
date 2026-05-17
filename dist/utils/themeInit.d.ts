/**
 * Generate the blocking inline script that prevents FOUC (Flash of Unstyled Content)
 * by reading the persisted theme from localStorage before first paint.
 *
 * This script is designed to be injected into the `<head>` of a Next.js layout
 * via a `<template>` tag with `dangerouslySetInnerHTML`.
 *
 * @param storageKey — localStorage key (e.g. "prism:theme")
 * @param validThemes — allowed theme values
 * @returns raw JavaScript source string
 *
 * @example
 *   import { generateThemeInitScript } from "@rodrigo-barraza/components-library";
 *
 *   // In layout.js:
 *   <template
 *     dangerouslySetInnerHTML={{
 *       __html: `<script>${generateThemeInitScript("portal:theme")}</script>`,
 *     }}
 *     suppressHydrationWarning
 *   />
 */
export declare function generateThemeInitScript(storageKey: string, validThemes?: string[]): string;
//# sourceMappingURL=themeInit.d.ts.map