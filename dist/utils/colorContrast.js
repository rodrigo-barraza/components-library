/**
 * Minimal color-contrast helpers for picking readable foregrounds at runtime
 * (e.g. a check icon rendered on an arbitrary theme swatch color).
 */
/** Parse #rgb / #rrggbb / #rrggbbaa to [r, g, b] in 0–1, or null. */
function hexToRgb(hex) {
    const match = hex.trim().match(/^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})$/);
    if (!match)
        return null;
    let h = match[1];
    if (h.length === 3)
        h = h.split("").map((c) => c + c).join("");
    const n = parseInt(h.slice(0, 6), 16);
    return [((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255];
}
/** WCAG relative luminance of a hex color (0 = black, 1 = white). */
export function relativeLuminance(hexColor) {
    const rgb = hexToRgb(hexColor);
    if (!rgb)
        return null;
    const linear = rgb.map((c) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4));
    return 0.2126 * linear[0] + 0.7152 * linear[1] + 0.0722 * linear[2];
}
/**
 * Black or white — whichever reads better on the given hex background.
 * Non-hex input (gradients, oklch strings) falls back to white, which is
 * correct for this design system's dark-leaning surfaces.
 */
export function getReadableTextColor(backgroundColor) {
    const luminance = relativeLuminance(backgroundColor);
    if (luminance === null)
        return "#ffffff";
    // Threshold ≈ where black and white yield equal WCAG contrast
    return luminance > 0.179 ? "#000000" : "#ffffff";
}
//# sourceMappingURL=colorContrast.js.map