// @ts-nocheck
import { describe, it, expect, vi } from "vitest";
import { renderHook } from "@testing-library/react";
import useKeyboard from "./useKeyboard.js";

describe("useKeyboard", () => {
  it("fires handler for matching key", () => {
    const handler = vi.fn();
    renderHook(() => useKeyboard({ escape: handler }));
    document.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape", bubbles: true }));
    expect(handler).toHaveBeenCalledTimes(1);
  });

  it("handles modifier combos", () => {
    const handler = vi.fn();
    renderHook(() => useKeyboard({ "ctrl+k": handler }));
    document.dispatchEvent(new KeyboardEvent("keydown", { key: "k", ctrlKey: true, bubbles: true }));
    expect(handler).toHaveBeenCalledTimes(1);
  });

  it("ignores input elements by default", () => {
    const handler = vi.fn();
    renderHook(() => useKeyboard({ k: handler }));
    const input = document.createElement("input");
    document.body.appendChild(input);
    input.dispatchEvent(new KeyboardEvent("keydown", { key: "k", bubbles: true }));
    expect(handler).not.toHaveBeenCalled();
    document.body.removeChild(input);
  });

  it("does not fire when enabled=false", () => {
    const handler = vi.fn();
    renderHook(() => useKeyboard({ escape: handler }, { enabled: false }));
    document.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape", bubbles: true }));
    expect(handler).not.toHaveBeenCalled();
  });
});
