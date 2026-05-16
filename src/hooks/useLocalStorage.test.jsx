import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import useLocalStorage from "./useLocalStorage.tsx";

describe("useLocalStorage", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("returns the initial value when nothing is stored", () => {
    const { result } = renderHook(() => useLocalStorage("test-key", "default"));
    expect(result.current[0]).toBe("default");
  });

  it("hydrates from localStorage on mount", async () => {
    localStorage.setItem("test-key", JSON.stringify("stored-value"));
    const { result } = renderHook(() => useLocalStorage("test-key", "default"));

    // Wait for the useEffect hydration
    await vi.waitFor(() => {
      expect(result.current[0]).toBe("stored-value");
    });
  });

  it("updates state and persists to localStorage", async () => {
    const { result } = renderHook(() => useLocalStorage("test-key", "initial"));

    act(() => {
      result.current[1]("updated");
    });

    expect(result.current[0]).toBe("updated");
    await vi.waitFor(() => {
      expect(localStorage.getItem("test-key")).toBe(JSON.stringify("updated"));
    });
  });

  it("supports functional updates", () => {
    const { result } = renderHook(() => useLocalStorage("counter", 0));

    act(() => {
      result.current[1]((prev) => prev + 1);
    });

    expect(result.current[0]).toBe(1);
  });

  it("removes from localStorage when removeValue is called", async () => {
    localStorage.setItem("test-key", JSON.stringify("value"));
    const { result } = renderHook(() => useLocalStorage("test-key", null));

    await vi.waitFor(() => {
      expect(result.current[0]).toBe("value");
    });

    act(() => {
      result.current[2](); // removeValue
    });

    expect(result.current[0]).toBeNull();
    await vi.waitFor(() => {
      expect(localStorage.getItem("test-key")).toBeNull();
    });
  });

  it("handles complex objects", async () => {
    const obj = { name: "test", items: [1, 2, 3] };
    const { result } = renderHook(() => useLocalStorage("obj-key", null));

    act(() => {
      result.current[1](obj);
    });

    expect(result.current[0]).toEqual(obj);
    await vi.waitFor(() => {
      expect(JSON.parse(localStorage.getItem("obj-key"))).toEqual(obj);
    });
  });
});
