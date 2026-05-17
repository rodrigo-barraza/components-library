export { formatBytes, formatDuration, formatCompact } from "@rodrigo-barraza/utilities-library";
/**
 * Format a percentage with adaptive precision (components-library default).
 * Wraps the utilities-library version with "adaptive" as the default mode.
 */
export declare function formatPercent(value: number, decimals?: number | "adaptive"): string;
/**
 * Format a number as currency using Intl.NumberFormat.
 * Signature: (amount, locale?, currencyCode?) — wraps the utilities-library
 * version which uses (amount, currencyCode?) to support the locale parameter.
 */
export declare function formatCurrency(n: number, locale?: string, currency?: string): string;
//# sourceMappingURL=formatters.d.ts.map