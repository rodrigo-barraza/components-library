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
import type { ThemeCatalogEntry } from "../components/ThemeProvider/ThemeProvider.js";
export interface CustomThemeTokens {
    background: string;
    surface: string;
    elevated: string;
    primary: string;
    secondary: string;
    tertiary: string;
    textPrimary: string;
    textSecondary: string;
    textMuted: string;
    borderColor: string;
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
/**
 * Initialize the custom theme service with a project-specific storage key.
 * Call this once on app boot before any other operations.
 *
 * @param storageKey - localStorage key, e.g. "prism:custom-themes"
 */
declare function init(storageKey: string): void;
/** Get the current storage key (useful for themeInit script) */
declare function getStorageKey(): string;
/**
 * Returns the data-theme attribute value for a custom theme.
 * Custom themes use `custom-<id>` to avoid collisions with built-in themes.
 */
export declare function getCustomThemeAttr(id: string): string;
/** Inject or update a <style> element for a single custom theme */
declare function injectThemeStyle(theme: CustomTheme): void;
/** Read all custom themes from localStorage */
declare function getAll(): CustomTheme[];
/** Save (upsert) a custom theme */
declare function save(theme: CustomTheme): CustomTheme[];
/** Remove a custom theme by id */
declare function remove(id: string): CustomTheme[];
/** Duplicate a custom theme with a new id */
declare function duplicate(id: string): {
    themes: CustomTheme[];
    newTheme: CustomTheme;
} | null;
/** Inject all custom theme <style> blocks (called on app boot) */
declare function injectAllCustomThemes(): void;
/** Get custom theme names for the ThemeProvider themes array */
declare function getCustomThemeNames(): string[];
/** Build a metadata map for the ThemePickerComponent */
declare function getCustomThemeMetaMap(): Record<string, ThemeCatalogEntry>;
/**
 * Generate a raw CSS string for all custom themes (used by themeInit
 * for FOUC prevention — injected inline before first paint).
 */
declare function generateAllCustomThemeCSS(): string;
declare function getBuiltInPreset(themeId: string): CustomThemeTokens;
declare const CustomThemeService: {
    init: typeof init;
    getStorageKey: typeof getStorageKey;
    getAll: typeof getAll;
    save: typeof save;
    remove: typeof remove;
    duplicate: typeof duplicate;
    injectAllCustomThemes: typeof injectAllCustomThemes;
    injectThemeStyle: typeof injectThemeStyle;
    getCustomThemeNames: typeof getCustomThemeNames;
    getCustomThemeMetaMap: typeof getCustomThemeMetaMap;
    getCustomThemeAttr: typeof getCustomThemeAttr;
    getBuiltInPreset: typeof getBuiltInPreset;
    generateAllCustomThemeCSS: typeof generateAllCustomThemeCSS;
    BUILT_IN_PRESETS: Record<string, ThemeCatalogEntry>;
};
export default CustomThemeService;
//# sourceMappingURL=CustomThemeService.d.ts.map