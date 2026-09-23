import { describe, it, expect } from "vitest";
import { sizeClass, variantClass } from "./moduleClasses.js";

describe("sizeClass", () => {
  const styles = { "size-small": "s", "size-extra-large": "xl" };

  it("accepts the short token, the long name and the class name", () => {
    expect(sizeClass(styles, "sm")).toBe("s");
    expect(sizeClass(styles, "small")).toBe("s");
    expect(sizeClass(styles, "size-small")).toBe("s");
    expect(sizeClass(styles, "xl")).toBe("xl");
  });

  it("is undefined for no size or an unknown one", () => {
    expect(sizeClass(styles, undefined)).toBeUndefined();
    expect(sizeClass(styles, "huge")).toBeUndefined();
  });
});

describe("variantClass", () => {
  const styles = { "multi-browse": "mb", danger: "d", accent: "a" };

  it("maps camelCase tokens to kebab-case classes", () => {
    expect(variantClass(styles, "multiBrowse")).toBe("mb");
  });

  it("renames through aliases, then falls back", () => {
    expect(variantClass(styles, "error", { aliases: { error: "danger" } })).toBe("d");
    expect(variantClass(styles, "primary", { fallback: "accent" })).toBe("a");
    expect(variantClass(styles, "primary")).toBeUndefined();
  });
});
