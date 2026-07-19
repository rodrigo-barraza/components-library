/**
 * CustomThemeService — Client-side custom theme management.
 *
 * Handles CRUD operations for user-created themes persisted in localStorage,
 * CSS injection via dynamic `<style>` tags, and auto-derivation of related
 * tokens from user-picked colors.
 *
 * Usage:
 *   import { CustomThemeService } from "@rodrigo-barraza/components-library";
 *   CustomThemeService.init("prism:custom-themes");
 *
 * CSS selector:  `[data-theme="custom-<id>"]`
 */

import { clamp } from "@rodrigo-barraza/utilities-library";

import { THEME_CATALOG } from "../components/ThemeProvider/ThemeProvider.js";
import type { ThemeCatalogEntry } from "../components/ThemeProvider/ThemeProvider.js";

// ── Types ──────────────────────────────────────────────────────────────

export interface CustomThemeTokens {
  // Surfaces
  backgroundBase: string;
  backgroundSurface: string;
  backgroundElevated: string;
  // Accent
  primary: string;
  secondary: string;
  tertiary: string;
  // Text
  textPrimary: string;
  textSecondary: string;
  textMuted: string;
  // Borders
  borderColor: string;
  // Semantic
  success: string;
  danger: string;
  warning: string;
  info: string;
}

export interface CustomTheme {
  id: string;
  name: string;
  icon: string;
  tokens: CustomThemeTokens;
  createdAt: string;
  updatedAt: string;
}

// ── Configuration ──────────────────────────────────────────────────────

let STORAGE_KEY = "custom-themes";
const STYLE_ID_PREFIX = "custom-theme-";

/**
 * Initialize the custom theme service with a project-specific storage key.
 * Call this once on app boot before any other operations.
 *
 * @param storageKey - localStorage key, e.g. "prism:custom-themes"
 */
function init(storageKey: string): void {
  STORAGE_KEY = storageKey;
}

/** Get the current storage key (useful for themeInit script) */
function getStorageKey(): string {
  return STORAGE_KEY;
}

// ── Color Utilities ────────────────────────────────────────────────────

/** Parse a hex color (#rrggbb) into [r, g, b] */
function hexToRgb(hex: string): [number, number, number] {
  if (!hex || typeof hex !== "string") {
    return [0, 0, 0];
  }
  const hexWithoutHash = hex.replace("#", "");
  const fullHex = hexWithoutHash.length === 3
    ? hexWithoutHash.split("").map((hexChar) => hexChar + hexChar).join("")
    : hexWithoutHash;
  return [
    parseInt(fullHex.slice(0, 2), 16) || 0,
    parseInt(fullHex.slice(2, 4), 16) || 0,
    parseInt(fullHex.slice(4, 6), 16) || 0,
  ];
}

/** Convert [r,g,b] to hex string */
function rgbToHex(r: number, g: number, b: number): string {
  const toChannel = (channelValue: number) => clamp(Math.round(channelValue), 0, 255);
  return `#${[toChannel(r), toChannel(g), toChannel(b)].map((channelValue) => channelValue.toString(16).padStart(2, "0")).join("")}`;
}

/** Darken a hex color by a percentage (0–100) */
function darken(hex: string, percent: number): string {
  const [r, g, b] = hexToRgb(hex);
  const factor = 1 - percent / 100;
  return rgbToHex(r * factor, g * factor, b * factor);
}

/** Lighten a hex color by a percentage (0–100) */
function lighten(hex: string, percent: number): string {
  const [r, g, b] = hexToRgb(hex);
  const factor = percent / 100;
  return rgbToHex(r + (255 - r) * factor, g + (255 - g) * factor, b + (255 - b) * factor);
}

/** Produce rgba() string from hex + alpha */
function hexToRgba(hex: string, alpha: number): string {
  const [r, g, b] = hexToRgb(hex);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

/** Check if a color is "light" (luma > 128) */
function isLight(hex: string): boolean {
  const [r, g, b] = hexToRgb(hex);
  return (r * 299 + g * 587 + b * 114) / 1000 > 128;
}

// ── Token Auto-Derivation ──────────────────────────────────────────────

/**
 * From the ~17 user-picked tokens, derive the full set of CSS custom
 * properties needed by the design system.
 *
 * Direct-mapped tokens keep standard names (e.g. --accent-primary).
 * Auto-derived/calculated tokens use the --calculated-* prefix
 * (e.g. --calculated-accent-primary-hover) to make it obvious they
 * are computed from user input, not directly specified.
 */
function deriveFullCSS(tokens: CustomThemeTokens): string {
  const themeTokens = tokens || {};
  const primary = themeTokens.primary || "#6366f1";
  const secondary = themeTokens.secondary || "#a78bfa";
  const tertiary = themeTokens.tertiary || "#38bdf8";
  const background = themeTokens.backgroundBase || "#0a0a0f";
  const surface = themeTokens.backgroundSurface || "#13141c";
  const elevated = themeTokens.backgroundElevated || "#1a1b26";
  const textPrimary = themeTokens.textPrimary || "#f8f8f8";
  const textSecondary = themeTokens.textSecondary || "#8e95ae";
  const textMuted = themeTokens.textMuted || "#565c74";
  const borderColor = themeTokens.borderColor || "#ffffff";
  const success = themeTokens.success || "#10b981";
  const danger = themeTokens.danger || "#ef4444";
  const warning = themeTokens.warning || "#f59e0b";
  const info = themeTokens.info || "#3b82f6";

  const lightMode = isLight(background);
  const borderRgb = hexToRgb(borderColor);

  // Derive text inverse (opposite of primary bg)
  const textInverse = lightMode ? background : textPrimary;

  const baseContrastColor = lightMode ? "rgba(0, 0, 0, 0.95)" : "rgba(255, 255, 255, 0.98)";
  const surfaceContrastColor = isLight(surface) ? "rgba(0, 0, 0, 0.95)" : "rgba(255, 255, 255, 0.98)";
  const elevatedContrastColor = isLight(elevated) ? "rgba(0, 0, 0, 0.95)" : "rgba(255, 255, 255, 0.98)";
  const primaryContrastColor = isLight(primary) ? "rgba(0, 0, 0, 0.95)" : "rgba(255, 255, 255, 0.98)";

  // Opacity scales depend on light/dark
  const borderOpacity = lightMode ? 0.1 : 0.06;
  const subtleMultiplier = lightMode ? 0.5 : 0.5;
  const mediumMultiplier = lightMode ? 1.0 : 1.67;
  const strongMultiplier = lightMode ? 1.4 : 2.5;
  const glowAlpha = lightMode ? 0.2 : 0.4;
  const subtleAlpha = lightMode ? 0.06 : 0.1;
  const shadowAlpha = lightMode ? 0.08 : 0.15;

  const lines = [
    `/* Accent — Primary (direct) */`,
    `--accent-primary: ${primary};`,
    `/* Accent — Primary (calculated) */`,
    `--calculated-accent-primary-hover: ${darken(primary, 12)};`,
    `--calculated-accent-primary-glow: ${hexToRgba(primary, glowAlpha)};`,
    `--calculated-accent-primary-subtle: ${hexToRgba(primary, subtleAlpha)};`,
    `--calculated-accent-primary-contrast: ${primaryContrastColor};`,
    `--calculated-shadow-glow: 0 0 20px ${hexToRgba(primary, shadowAlpha)};`,
    ``,
    `/* Accent — Secondary (direct) */`,
    `--accent-secondary: ${secondary};`,
    `/* Accent — Secondary (calculated) */`,
    `--calculated-accent-secondary-hover: ${darken(secondary, 12)};`,
    `--calculated-accent-secondary-glow: ${hexToRgba(secondary, glowAlpha)};`,
    `--calculated-accent-secondary-subtle: ${hexToRgba(secondary, subtleAlpha)};`,
    ``,
    `/* Accent — Tertiary (direct) */`,
    `--accent-tertiary: ${tertiary};`,
    ``,
    `/* Surfaces (direct) */`,
    `--background-base: ${background};`,
    `--background-surface: ${surface};`,
    `--background-elevated: ${elevated};`,
    `--calculated-background-base-contrast: ${baseContrastColor};`,
    `--calculated-background-surface-contrast: ${surfaceContrastColor};`,
    `--calculated-background-elevated-contrast: ${elevatedContrastColor};`,
    ``,
    `/* Borders (calculated) */`,
    `--calculated-border-color: rgba(${borderRgb.join(", ")}, ${borderOpacity});`,
    `--calculated-border-subtle: rgba(${borderRgb.join(", ")}, ${borderOpacity * subtleMultiplier});`,
    `--calculated-border-medium: rgba(${borderRgb.join(", ")}, ${borderOpacity * mediumMultiplier});`,
    `--calculated-border-strong: rgba(${borderRgb.join(", ")}, ${borderOpacity * strongMultiplier});`,
    ``,
    `/* Text (direct) */`,
    `--text-primary: ${textPrimary};`,
    `--text-secondary: ${textSecondary};`,
    `--text-muted: ${textMuted};`,
    `/* Text (calculated) */`,
    `--calculated-text-inverse: ${textInverse};`,
    ``,
    `/* Semantic (direct) */`,
    `--color-success: ${success};`,
    `/* Semantic (calculated) */`,
    `--calculated-color-success-subtle: ${hexToRgba(success, lightMode ? 0.06 : 0.1)};`,
    `--color-danger: ${danger};`,
    `--calculated-color-danger-subtle: ${hexToRgba(danger, lightMode ? 0.06 : 0.1)};`,
    `--color-warning: ${warning};`,
    `--calculated-color-warning-subtle: ${hexToRgba(warning, lightMode ? 0.06 : 0.1)};`,
    `--color-info: ${info};`,
    `--calculated-color-info-subtle: ${hexToRgba(info, lightMode ? 0.06 : 0.1)};`,
    ``,
    `/* Shadows (calculated) */`,
    `--calculated-shadow-sm: 0 1px 3px rgba(0, 0, 0, ${lightMode ? 0.08 : 0.3});`,
    `--calculated-shadow-md: 0 4px 12px rgba(0, 0, 0, ${lightMode ? 0.1 : 0.4});`,
    `--calculated-shadow-lg: 0 8px 32px rgba(0, 0, 0, ${lightMode ? 0.12 : 0.5});`,
    ``,
    `/* Select (calculated) */`,
    `--calculated-select-background-color: ${lightMode ? surface : hexToRgba(surface, 0.65)};`,
    `--calculated-select-option-background-color: ${surface};`,
    `--calculated-select-option-text: ${textPrimary};`,
  ];

  return lines.join("\n  ");
}

// ── CSS Injection ──────────────────────────────────────────────────────

/**
 * Returns the data-theme attribute value for a custom theme.
 * Custom themes use `custom-<id>` to avoid collisions with built-in themes.
 */
export function getCustomThemeAttr(id: string): string {
  return `custom-${id}`;
}

/** Build the full CSS rule for a custom theme */
function buildStyleContent(theme: CustomTheme): string {
  if (!theme || !theme.id) return "";
  const selector = `[data-theme="${getCustomThemeAttr(theme.id)}"]`;
  return `${selector} {\n  ${deriveFullCSS(theme.tokens)}\n}`;
}

/** Inject or update a <style> element for a single custom theme */
function injectThemeStyle(theme: CustomTheme): void {
  if (typeof document === "undefined") return;
  const styleId = STYLE_ID_PREFIX + theme.id;
  let styleElement = document.getElementById(styleId) as HTMLStyleElement | null;
  if (!styleElement) {
    styleElement = document.createElement("style");
    styleElement.id = styleId;
    styleElement.setAttribute("data-custom-theme", theme.id);
    document.head.appendChild(styleElement);
  }
  styleElement.textContent = buildStyleContent(theme);
}

/** Remove the <style> element for a custom theme */
function removeThemeStyle(id: string): void {
  if (typeof document === "undefined") return;
  const styleElement = document.getElementById(STYLE_ID_PREFIX + id);
  if (styleElement) styleElement.remove();
}

// ── CRUD Operations ────────────────────────────────────────────────────

/** Read all custom themes from localStorage */
function getAll(): CustomTheme[] {
  if (typeof localStorage === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

/** Persist the full custom themes array to localStorage */
function persistAll(themes: CustomTheme[]): void {
  if (typeof localStorage === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(themes));
  } catch {
    /* localStorage full or unavailable */
  }
}

/** Save (upsert) a custom theme */
function save(theme: CustomTheme): CustomTheme[] {
  const all = getAll();
  const index = all.findIndex((themeItem) => themeItem.id === theme.id);
  const updated = { ...theme, updatedAt: new Date().toISOString() };
  if (index >= 0) {
    all[index] = updated;
  } else {
    all.push(updated);
  }
  persistAll(all);
  injectThemeStyle(updated);
  return all;
}

/** Remove a custom theme by id */
function remove(id: string): CustomTheme[] {
  const all = getAll().filter((themeItem) => themeItem.id !== id);
  persistAll(all);
  removeThemeStyle(id);
  return all;
}

/** Duplicate a custom theme with a new id */
function duplicate(id: string): { themes: CustomTheme[]; newTheme: CustomTheme } | null {
  const all = getAll();
  const source = all.find((themeItem) => themeItem.id === id);
  if (!source) return null;

  const newId = crypto.randomUUID().slice(0, 8);
  const newTheme: CustomTheme = {
    ...structuredClone(source),
    id: newId,
    name: `${source.name} (Copy)`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  all.push(newTheme);
  persistAll(all);
  injectThemeStyle(newTheme);
  return { themes: all, newTheme };
}

/** Inject all custom theme <style> blocks (called on app boot) */
function injectAllCustomThemes(): void {
  const all = getAll();
  for (const theme of all) {
    if (theme) {
      injectThemeStyle(theme);
    }
  }
}

/** Get custom theme names for the ThemeProvider themes array */
function getCustomThemeNames(): string[] {
  return getAll().map((themeItem) => getCustomThemeAttr(themeItem.id));
}

/** Build a metadata map for the ThemePickerComponent */
function getCustomThemeMetaMap(): Record<string, ThemeCatalogEntry> {
  const themeMetaMap: Record<string, ThemeCatalogEntry> = {};
  for (const theme of getAll()) {
    if (!theme) continue;
    const themeTokens = theme.tokens || {};
    themeMetaMap[getCustomThemeAttr(theme.id)] = {
      label: theme.name || "Unnamed Theme",
      icon: theme.icon || "palette",
      backgroundBase: themeTokens.backgroundBase || "#0a0a0f",
      backgroundSurface: themeTokens.backgroundSurface || "#13141c",
      backgroundElevated: themeTokens.backgroundElevated || "#1a1b26",
      primary: themeTokens.primary || "#6366f1",
      secondary: themeTokens.secondary || "#a78bfa",
      tertiary: themeTokens.tertiary || "#38bdf8",
      textPrimary: themeTokens.textPrimary || "#f8f8f8",
      textSecondary: themeTokens.textSecondary || "#8e95ae",
      textMuted: themeTokens.textMuted || "#565c74",
      borderColor: themeTokens.borderColor || "#ffffff",
      success: themeTokens.success || "#10b981",
      danger: themeTokens.danger || "#ef4444",
      warning: themeTokens.warning || "#f59e0b",
      info: themeTokens.info || "#3b82f6",
    };
  }
  return themeMetaMap;
}

/**
 * Generate a raw CSS string for all custom themes (used by themeInit
 * for FOUC prevention — injected inline before first paint).
 */
function generateAllCustomThemeCSS(): string {
  return getAll()
    .map(buildStyleContent)
    .filter(Boolean)
    .join("\n");
}

// ── Default Token Presets ──────────────────────────────────────────────

// "auto" is a day/night resolver, not a palette (its preview values are
// gradient strings) — never offer it as a base for custom themes.
const BUILT_IN_PRESETS: Record<string, ThemeCatalogEntry> = Object.fromEntries(
  Object.entries(THEME_CATALOG).filter(([themeId]) => themeId !== "auto"),
);

function getBuiltInPreset(themeId: string): CustomThemeTokens {
  return BUILT_IN_PRESETS[themeId] || THEME_CATALOG.twilight;
}

// ── Public API ─────────────────────────────────────────────────────────

const CustomThemeService = {
  init,
  getStorageKey,
  getAll,
  save,
  remove,
  duplicate,
  injectAllCustomThemes,
  injectThemeStyle,
  getCustomThemeNames,
  getCustomThemeMetaMap,
  getCustomThemeAttr,
  getBuiltInPreset,
  generateAllCustomThemeCSS,
  BUILT_IN_PRESETS,
};

export default CustomThemeService;
