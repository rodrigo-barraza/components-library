// @ts-nocheck
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { renderHook, act, waitFor } from "@testing-library/react";
import usePolling from "./usePolling.js";

describe("usePolling", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("fetches data on mount", async () => {
    const fetcher = vi.fn().mockResolvedValue({ ok: true });
    const { result } = renderHook(() => usePolling(fetcher, 5000));

    // Flush the initial setTimeout(..., 0)
    await act(async () => {
      await vi.advanceTimersByTimeAsync(1);
    });

    expect(fetcher).toHaveBeenCalledTimes(1);
    expect(result.current.data).toEqual({ ok: true });
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it("polls at the specified interval", async () => {
    const fetcher = vi.fn().mockResolvedValue("data");
    renderHook(() => usePolling(fetcher, 1000));

    // Initial fetch
    await act(async () => {
      await vi.advanceTimersByTimeAsync(1);
    });
    expect(fetcher).toHaveBeenCalledTimes(1);

    // First poll
    await act(async () => {
      await vi.advanceTimersByTimeAsync(1000);
    });
    expect(fetcher).toHaveBeenCalledTimes(2);

    // Second poll
    await act(async () => {
      await vi.advanceTimersByTimeAsync(1000);
    });
    expect(fetcher).toHaveBeenCalledTimes(3);
  });

  it("sets error on fetch failure", async () => {
    const fetcher = vi.fn().mockRejectedValue(new Error("network down"));
    const { result } = renderHook(() => usePolling(fetcher, 5000));

    await act(async () => {
      await vi.advanceTimersByTimeAsync(1);
    });

    expect(result.current.error).toBe("network down");
    expect(result.current.data).toBeNull();
  });

  it("respects enabled=false", async () => {
    const fetcher = vi.fn().mockResolvedValue("data");
    renderHook(() => usePolling(fetcher, 1000, { enabled: false }));

    await act(async () => {
      await vi.advanceTimersByTimeAsync(5000);
    });

    expect(fetcher).not.toHaveBeenCalled();
  });

  it("applies transform function", async () => {
    const fetcher = vi.fn().mockResolvedValue([1, 2, 3]);
    const transform = (data) => data.length;
    const { result } = renderHook(() =>
      usePolling(fetcher, 5000, { transform }),
    );

    await act(async () => {
      await vi.advanceTimersByTimeAsync(1);
    });

    expect(result.current.data).toBe(3);
  });
});
