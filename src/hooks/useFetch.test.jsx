import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import useFetch from "./useFetch.tsx";

describe("useFetch", () => {
  it("fetches data on mount", async () => {
    const fetcher = vi.fn().mockResolvedValue({ items: [1, 2] });
    const { result } = renderHook(() => useFetch(fetcher));

    expect(result.current.loading).toBe(true);

    await vi.waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.data).toEqual({ items: [1, 2] });
    expect(result.current.error).toBeNull();
  });

  it("handles errors gracefully", async () => {
    const fetcher = vi.fn().mockRejectedValue(new Error("fail"));
    const { result } = renderHook(() => useFetch(fetcher));

    await vi.waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.error).toBe("fail");
    expect(result.current.data).toBeNull();
  });

  it("skips fetch when enabled=false", async () => {
    const fetcher = vi.fn().mockResolvedValue("data");
    const { result } = renderHook(() =>
      useFetch(fetcher, { enabled: false }),
    );

    await vi.waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(fetcher).not.toHaveBeenCalled();
    expect(result.current.data).toBeNull();
  });

  it("re-fetches when deps change", async () => {
    const fetcher = vi.fn().mockResolvedValue("data");
    let dep = "a";

    const { result, rerender } = renderHook(() =>
      useFetch(fetcher, { deps: [dep] }),
    );

    await vi.waitFor(() => {
      expect(result.current.loading).toBe(false);
    });
    expect(fetcher).toHaveBeenCalledTimes(1);

    dep = "b";
    rerender();

    await vi.waitFor(() => {
      expect(fetcher).toHaveBeenCalledTimes(2);
    });
  });

  it("applies transform function", async () => {
    const fetcher = vi.fn().mockResolvedValue({ items: [1, 2, 3] });
    const { result } = renderHook(() =>
      useFetch(fetcher, { transform: (d) => d.items.length }),
    );

    await vi.waitFor(() => {
      expect(result.current.data).toBe(3);
    });
  });

  it("refresh() re-fetches data", async () => {
    let callCount = 0;
    const fetcher = vi.fn().mockImplementation(() => {
      callCount++;
      return Promise.resolve(`call-${callCount}`);
    });

    const { result } = renderHook(() => useFetch(fetcher));

    await vi.waitFor(() => {
      expect(result.current.data).toBe("call-1");
    });

    await act(async () => {
      await result.current.refresh();
    });

    expect(result.current.data).toBe("call-2");
  });
});
