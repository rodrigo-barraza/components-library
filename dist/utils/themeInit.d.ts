/**
 * Generate the blocking inline script that prevents FOUC (Flash of Unstyled Content)
 * by reading the persisted theme from localStorage before first paint.
 *
 * Also reads custom themes from a companion localStorage key and injects their
 * CSS custom properties as inline `<style>` blocks so custom themes render
 * without a flash.
 *
 * This script is designed to be injected into the `<head>` of a Next.js layout
 * via a `<template>` tag with `dangerouslySetInnerHTML`.
 *
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
export declare function generateThemeInitScript(storageKey: string, validThemes?: string[], customThemesKey?: string): string;
//# sourceMappingURL=themeInit.d.ts.map