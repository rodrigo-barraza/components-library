// ─────────────────────────────────────────────────────────────
// Formatters — Re-exported from @rodrigo-barraza/utilities-library
// ─────────────────────────────────────────────────────────────
// The utilities-library is the single source of truth for all
// formatting functions. This module re-exports a curated subset
// so clients that already import from components-library don't
// need to add a direct utilities-library dependency.
//
// formatPercent is wrapped to default to "adaptive" mode, which
// matches the original components-library behavior.
//
// formatCurrency is wrapped to match the (amount, locale, code)
// signature that clients may already use.
// ─────────────────────────────────────────────────────────────

import {
  formatPercent as _formatPercent,
  formatCurrency as _formatCurrency,
} from "@rodrigo-barraza/utilities-library";

export { formatBytes, formatDuration, formatCompact } from "@rodrigo-barraza/utilities-library";

/**
 * Format a percentage with adaptive precision (components-library default).
 * Wraps the utilities-library version with "adaptive" as the default mode.
 *
 * @param {number} value
 * @param {number|"adaptive"} [decimals="adaptive"]
 * @returns {string}
 */
export function formatPercent(value, decimals = "adaptive") {
  return _formatPercent(value, decimals);
}

/**
 * Format a number as currency using Intl.NumberFormat.
 * Signature: (amount, locale?, currencyCode?) — wraps the utilities-library
 * version which uses (amount, currencyCode?) to support the locale parameter.
 *
 * @param {number}  n           — amount
 * @param {string}  [locale="en-US"]
 * @param {string}  [currency="USD"]
 * @returns {string}
 */
export function formatCurrency(n, locale = "en-US", currency = "USD") {
  if (locale === "en-US") {
    return _formatCurrency(n, currency);
  }
  return new Intl.NumberFormat(locale, { style: "currency", currency }).format(n || 0);
}
