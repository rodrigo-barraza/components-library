import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import useClipboard from "./useClipboard.tsx";

describe("useClipboard", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    Object.assign(navigator, {
      clipboard: {
        writeText: vi.fn().mockResolvedValue(),
      },
    });
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("copies text and sets copied=true", async () => {
    const { result } = renderHook(() => useClipboard(2000));

    await act(async () => {
      const success = await result.current.copy("hello");
      expect(success).toBe(true);
    });

    expect(navigator.clipboard.writeText).toHaveBeenCalledWith("hello");
    expect(result.current.copied).toBe(true);
  });

  it("resets copied after timeout", async () => {
    const { result } = renderHook(() => useClipboard(1000));

    await act(async () => {
      await result.current.copy("text");
    });
    expect(result.current.copied).toBe(true);

    act(() => {
      vi.advanceTimersByTime(1000);
    });
    expect(result.current.copied).toBe(false);
  });

  it("returns false on clipboard failure", async () => {
    navigator.clipboard.writeText = vi
      .fn()
      .mockRejectedValue(new Error("denied"));

    const { result } = renderHook(() => useClipboard());

    let success;
    await act(async () => {
      success = await result.current.copy("text");
    });

    expect(success).toBe(false);
    expect(result.current.copied).toBe(false);
  });
});
