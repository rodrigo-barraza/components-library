import { describe, it, expect } from "vitest";
import {
  formatBytes,
  formatPercent,
  formatDuration,
  formatCurrency,
  formatCompact,
} from "../src/utils/formatters.js";

// ── formatBytes ────────────────────────────────────────────────

describe("formatBytes", () => {
  it("returns '0 B' for zero / falsy", () => {
    expect(formatBytes(0)).toBe("0 B");
    expect(formatBytes(null)).toBe("0 B");
    expect(formatBytes(undefined)).toBe("0 B");
  });

  it("formats small values with 2 decimals", () => {
    expect(formatBytes(512)).toBe("512 B");
    expect(formatBytes(1024)).toBe("1.00 KB");
    expect(formatBytes(1536)).toBe("1.50 KB");
  });

  it("formats medium values with 1 decimal", () => {
    expect(formatBytes(50 * 1024)).toBe("50.0 KB");
  });

  it("formats large values rounded", () => {
    expect(formatBytes(1024 * 1024)).toBe("1.00 MB");
    expect(formatBytes(1024 * 1024 * 1024)).toBe("1.00 GB");
  });
});

// ── formatPercent ──────────────────────────────────────────────
// Defaults to "adaptive" mode via the components-library wrapper.

describe("formatPercent", () => {
  it("returns '0%' for near-zero", () => {
    expect(formatPercent(0)).toBe("0%");
    expect(formatPercent(0.005)).toBe("0%");
  });

  it("uses 2 decimals for < 1%", () => {
    expect(formatPercent(0.42)).toBe("0.42%");
  });

  it("uses 1 decimal for < 10%", () => {
    expect(formatPercent(5.67)).toBe("5.7%");
  });

  it("rounds for >= 10%", () => {
    expect(formatPercent(42.8)).toBe("43%");
  });

  it("returns '—' for null", () => {
    expect(formatPercent(null)).toBe("—");
  });
});

// ── formatDuration ─────────────────────────────────────────────
// Now uses the utilities-library canonical version:
//   - 0/null → "—"
//   - sub-second → "500ms"
//   - seconds → "5.0s"

describe("formatDuration", () => {
  it("returns '—' for null/undefined", () => {
    expect(formatDuration(null)).toBe("—");
    expect(formatDuration(undefined)).toBe("—");
  });

  it("formats sub-second as milliseconds", () => {
    expect(formatDuration(500)).toBe("500ms");
    expect(formatDuration(0)).toBe("0ms");
  });

  it("formats seconds with 1 decimal", () => {
    expect(formatDuration(5000)).toBe("5.0s");
  });

  it("formats minutes and seconds", () => {
    expect(formatDuration(90000)).toBe("1m 30s");
    expect(formatDuration(120000)).toBe("2m");
  });

  it("formats hours", () => {
    expect(formatDuration(3600000)).toBe("1h");
    expect(formatDuration(5400000)).toBe("1h 30m");
  });
});

// ── formatCurrency ─────────────────────────────────────────────

describe("formatCurrency", () => {
  it("formats USD by default", () => {
    const result = formatCurrency(1234.5);
    expect(result).toContain("1,234.50");
  });

  it("formats CAD with locale", () => {
    const result = formatCurrency(1234.5, "en-CA", "CAD");
    expect(result).toContain("1,234.50");
  });

  it("handles null/zero gracefully", () => {
    expect(formatCurrency(0)).toContain("0.00");
    expect(formatCurrency(null)).toContain("0.00");
  });
});

// ── formatCompact ──────────────────────────────────────────────
// Uses the utilities-library version which handles up to M (not B).
// The canonical version uses adaptive decimals and toLocaleString for < 1K.

describe("formatCompact", () => {
  it("returns '—' for null/undefined", () => {
    expect(formatCompact(null)).toBe("—");
    expect(formatCompact(undefined)).toBe("—");
  });

  it("returns formatted number for < 1K", () => {
    expect(formatCompact(500)).toBe("500");
  });

  it("uses K suffix for thousands", () => {
    expect(formatCompact(1234)).toBe("1.2K");
  });

  it("uses M suffix for millions", () => {
    expect(formatCompact(1234567)).toBe("1.2M");
  });

  it("uses M for large values", () => {
    expect(formatCompact(1234567890)).toBe("1234.6M");
  });
});
