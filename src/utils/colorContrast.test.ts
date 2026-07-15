import { describe, it, expect } from "vitest";
import { getReadableTextColor, relativeLuminance } from "./colorContrast.js";

describe("colorContrast", () => {
  it("computes relative luminance for known anchors", () => {
    expect(relativeLuminance("#ffffff")).toBeCloseTo(1, 5);
    expect(relativeLuminance("#000000")).toBeCloseTo(0, 5);
    expect(relativeLuminance("not-a-color")).toBeNull();
  });

  it("picks black text on light swatches and white on dark ones", () => {
    expect(getReadableTextColor("#f5f5f7")).toBe("#000000"); // Daylight base
    expect(getReadableTextColor("#ffffff")).toBe("#000000");
    expect(getReadableTextColor("#0c0d12")).toBe("#ffffff"); // Twilight base
    expect(getReadableTextColor("#1a1a1a")).toBe("#ffffff");
    expect(getReadableTextColor("#ff2d9b")).toBe("#000000"); // punk fuchsia
  });

  it("falls back to white for non-hex values (gradients, oklch)", () => {
    expect(getReadableTextColor("linear-gradient(115deg, #fff, #000)")).toBe("#ffffff");
    expect(getReadableTextColor("oklch(65% 0 0)")).toBe("#ffffff");
  });
});
