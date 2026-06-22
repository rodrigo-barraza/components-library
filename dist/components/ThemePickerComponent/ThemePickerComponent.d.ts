import React from "react";
import { type ThemeCatalogEntry } from "../ThemeProvider/ThemeProvider.js";
/**
 * ThemePickerComponent — Dropup theme selector for sidebar footers.
 *
 * Displays the current theme as a trigger button. Clicking opens a dropup
 * popover with all available themes rendered as selectable buttons, each
 * showing a dual-color swatch (primary + secondary), icon, and label.
 */
interface ThemePickerProps {
    theme: string;
    themes?: string[];
    onSelectTheme: (theme: string) => void;
    collapsed?: boolean;
    className?: string;
    /** Dynamic metadata for custom user themes (overlays onto THEME_CATALOG) */
    customThemeMeta?: Record<string, ThemeCatalogEntry>;
}
export default function ThemePickerComponent({ theme, themes, onSelectTheme, collapsed, className, customThemeMeta, }: ThemePickerProps): React.JSX.Element;
export {};
//# sourceMappingURL=ThemePickerComponent.d.ts.map