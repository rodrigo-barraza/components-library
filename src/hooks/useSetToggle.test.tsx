// @ts-nocheck
import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import useSetToggle from "./useSetToggle.js";

describe("useSetToggle", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("starts with an empty set", () => {
    const { result } = renderHook(() => useSetToggle());
    expect(result.current.selected.size).toBe(0);
  });

  it("toggles items in and out", () => {
    const { result } = renderHook(() => useSetToggle());

    act(() => result.current.toggle("a"));
    expect(result.current.has("a")).toBe(true);

    act(() => result.current.toggle("a"));
    expect(result.current.has("a")).toBe(false);
  });

  it("toggleAll enables/disables multiple items", () => {
    const { result } = renderHook(() => useSetToggle());
    const items = ["x", "y", "z"];

    // Disable all (add to set)
    act(() => result.current.toggleAll(items, false));
    expect(result.current.selected.size).toBe(3);

    // Enable all (remove from set)
    act(() => result.current.toggleAll(items, true));
    expect(result.current.selected.size).toBe(0);
  });

  it("clears the set", () => {
    const { result } = renderHook(() => useSetToggle());

    act(() => {
      result.current.toggle("a");
      result.current.toggle("b");
    });
    expect(result.current.selected.size).toBe(2);

    act(() => result.current.clear());
    expect(result.current.selected.size).toBe(0);
  });

  it("persists to localStorage with storageKey", async () => {
    const { result } = renderHook(() =>
      useSetToggle({ storageKey: "toggles", storageField: "items" }),
    );

    act(() => result.current.toggle("tool-a"));

    await vi.waitFor(() => {
      const stored = JSON.parse(localStorage.getItem("toggles"));
      expect(stored.items).toContain("tool-a");
    });
  });

  it("restores from localStorage on mount", () => {
    localStorage.setItem(
      "toggles",
      JSON.stringify({ items: ["saved-a", "saved-b"] }),
    );

    const { result } = renderHook(() =>
      useSetToggle({ storageKey: "toggles", storageField: "items" }),
    );

    expect(result.current.has("saved-a")).toBe(true);
    expect(result.current.has("saved-b")).toBe(true);
  });
});
