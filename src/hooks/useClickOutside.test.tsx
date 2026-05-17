import { describe, it, expect, vi } from "vitest";
import { renderHook } from "@testing-library/react";
import { createRef } from "react";
import useClickOutside from "./useClickOutside.js";

describe("useClickOutside", () => {
  it("fires handler when clicking outside the ref", () => {
    const handler = vi.fn();
    const ref = createRef();
    ref.current = document.createElement("div");
    document.body.appendChild(ref.current);

    renderHook(() => useClickOutside(ref, handler));

    // Click outside
    document.dispatchEvent(new MouseEvent("mousedown", { bubbles: true }));
    expect(handler).toHaveBeenCalledTimes(1);

    document.body.removeChild(ref.current);
  });

  it("does not fire when clicking inside the ref", () => {
    const handler = vi.fn();
    const ref = createRef();
    ref.current = document.createElement("div");
    document.body.appendChild(ref.current);

    renderHook(() => useClickOutside(ref, handler));

    // Click inside
    ref.current.dispatchEvent(
      new MouseEvent("mousedown", { bubbles: true }),
    );
    expect(handler).not.toHaveBeenCalled();

    document.body.removeChild(ref.current);
  });

  it("does not fire when enabled=false", () => {
    const handler = vi.fn();
    const ref = createRef();
    ref.current = document.createElement("div");

    renderHook(() => useClickOutside(ref, handler, { enabled: false }));

    document.dispatchEvent(new MouseEvent("mousedown", { bubbles: true }));
    expect(handler).not.toHaveBeenCalled();
  });

  it("supports multiple refs", () => {
    const handler = vi.fn();
    const ref1 = createRef();
    const ref2 = createRef();
    ref1.current = document.createElement("div");
    ref2.current = document.createElement("div");
    document.body.appendChild(ref1.current);
    document.body.appendChild(ref2.current);

    renderHook(() => useClickOutside([ref1, ref2], handler));

    // Click inside ref2 — should NOT fire
    ref2.current.dispatchEvent(
      new MouseEvent("mousedown", { bubbles: true }),
    );
    expect(handler).not.toHaveBeenCalled();

    // Click outside both
    document.dispatchEvent(new MouseEvent("mousedown", { bubbles: true }));
    expect(handler).toHaveBeenCalledTimes(1);

    document.body.removeChild(ref1.current);
    document.body.removeChild(ref2.current);
  });
});
