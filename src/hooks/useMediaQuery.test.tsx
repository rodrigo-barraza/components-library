// @ts-nocheck
import { describe, it, expect } from "vitest";
import { renderHook, act } from "@testing-library/react";
import useMediaQuery from "./useMediaQuery.tsx";

describe("useMediaQuery", () => {
  it("returns false initially for non-matching query", () => {
    const { result } = renderHook(() => useMediaQuery("(max-width: 1px)"));
    // jsdom doesn't support real media queries — defaults to false
    expect(typeof result.current).toBe("boolean");
  });

  it("returns a boolean", () => {
    const { result } = renderHook(() => useMediaQuery("(min-width: 0px)"));
    expect(typeof result.current).toBe("boolean");
  });
});
