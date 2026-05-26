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
export function generateThemeInitScript(
  storageKey: string,
  validThemes: string[] = ["light", "dark", "tropical", "oceanic", "punk"],
  customThemesKey?: string,
): string {
  const themeList = JSON.stringify(validThemes);
  // Derive the custom themes storage key from the main storageKey if not provided
  // e.g. "prism:theme" -> "prism:custom-themes"
  const customKey = customThemesKey || storageKey.replace(/:theme$/, ":custom-themes");

  // The blocking script:
  // 1. Read theme preference and apply data-theme attribute
  // 2. Read custom themes and inject their CSS as <style> blocks
  return `(function(){try{var r=localStorage.getItem(${JSON.stringify(storageKey)});if(r){var t=JSON.parse(r);if(${themeList}.indexOf(t)!==-1||t.indexOf("custom-")===0){document.documentElement.setAttribute("data-theme",t)}}}catch(e){}try{var c=localStorage.getItem(${JSON.stringify(customKey)});if(c){var themes=JSON.parse(c);if(Array.isArray(themes)){themes.forEach(function(th){if(th&&th.id&&th.tokens){var s=document.createElement("style");s.id="custom-theme-"+th.id;s.setAttribute("data-custom-theme",th.id);var tk=th.tokens;var isL=(function(h){var hex=(h||"#000").replace("#","");var r2=parseInt(hex.slice(0,2),16),g2=parseInt(hex.slice(2,4),16),b2=parseInt(hex.slice(4,6),16);return(r2*299+g2*587+b2*114)/1000>128})(tk.background||"#000");var sel='[data-theme="custom-'+th.id+'"]';s.textContent=sel+"{--accent-primary:"+tk.primary+";--accent-secondary:"+(tk.secondary||tk.primary)+";--accent-tertiary:"+(tk.tertiary||tk.primary)+";--background-base:"+tk.background+";--background-surface:"+tk.surface+";--background-elevated:"+tk.elevated+";--text-primary:"+tk.textPrimary+";--text-secondary:"+tk.textSecondary+";--text-muted:"+tk.textMuted+";--calculated-border-color:"+(isL?"rgba(0,0,0,0.1)":"rgba(255,255,255,0.06)")+";--color-success:"+tk.success+";--color-danger:"+tk.danger+";--color-warning:"+tk.warning+";--color-info:"+tk.info+"}";document.head.appendChild(s)}})}}}catch(e2){}})();`;
}

