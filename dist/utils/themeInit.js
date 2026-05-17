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
export function generateThemeInitScript(storageKey, validThemes = ["light", "dark", "tropical", "oceanic", "punk"]) {
    const themeList = JSON.stringify(validThemes);
    return `(function(){try{var r=localStorage.getItem(${JSON.stringify(storageKey)});if(r){var t=JSON.parse(r);if(${themeList}.indexOf(t)!==-1){document.documentElement.setAttribute("data-theme",t)}}}catch(e){}})();`;
}
//# sourceMappingURL=themeInit.js.map