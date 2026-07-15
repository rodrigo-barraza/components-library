/**
 * Minimal color-contrast helpers for picking readable foregrounds at runtime
 * (e.g. a check icon rendered on an arbitrary theme swatch color).
 */
/** WCAG relative luminance of a hex color (0 = black, 1 = white). */
export declare function relativeLuminance(hexColor: string): number | null;
/**
 * Black or white — whichever reads better on the given hex background.
 * Non-hex input (gradients, oklch strings) falls back to white, which is
 * correct for this design system's dark-leaning surfaces.
 */
export declare function getReadableTextColor(backgroundColor: string): "#000000" | "#ffffff";
//# sourceMappingURL=colorContrast.d.ts.map