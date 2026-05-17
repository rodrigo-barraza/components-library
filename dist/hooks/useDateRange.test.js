// @ts-nocheck
import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import useDateRange from "./useDateRange.js";
describe("useDateRange", () => {
    beforeEach(() => {
        localStorage.clear();
    });
    it("returns null when nothing is stored", () => {
        const { result } = renderHook(() => useDateRange("date-range"));
        expect(result.current[0]).toBeNull();
    });
    it("hydrates from localStorage on mount", async () => {
        const stored = { from: "2026-01-01", to: "2026-01-31" };
        localStorage.setItem("date-range", JSON.stringify(stored));
        const { result } = renderHook(() => useDateRange("date-range"));
        await vi.waitFor(() => {
            expect(result.current[0]).toEqual(stored);
        });
    });
    it("updates state and persists to localStorage", async () => {
        const { result } = renderHook(() => useDateRange("date-range"));
        // Trigger initialization
        await vi.waitFor(() => {
            expect(result.current[2].current).toBe(true);
        });
        const range = { from: "2026-03-01", to: "2026-03-15" };
        act(() => {
            result.current[1](range);
        });
        expect(result.current[0]).toEqual(range);
        await vi.waitFor(() => {
            expect(JSON.parse(localStorage.getItem("date-range"))).toEqual(range);
        });
    });
    it("calls onChange callback when hydrating from storage", async () => {
        const stored = { from: "2026-01-01", to: "2026-01-31" };
        localStorage.setItem("date-range", JSON.stringify(stored));
        const onChange = vi.fn();
        renderHook(() => useDateRange("date-range", onChange));
        await vi.waitFor(() => {
            expect(onChange).toHaveBeenCalledWith(stored);
        });
    });
    it("calls onChange callback on setter", async () => {
        const onChange = vi.fn();
        const { result } = renderHook(() => useDateRange("date-range", onChange));
        // Wait for initialization
        await vi.waitFor(() => {
            expect(result.current[2].current).toBe(true);
        });
        const range = { from: "2026-06-01", to: "2026-06-30" };
        act(() => {
            result.current[1](range);
        });
        expect(onChange).toHaveBeenCalledWith(range);
    });
    it("removes from localStorage when cleared to null", async () => {
        const stored = { from: "2026-01-01", to: "2026-01-31" };
        localStorage.setItem("date-range", JSON.stringify(stored));
        const { result } = renderHook(() => useDateRange("date-range"));
        await vi.waitFor(() => {
            expect(result.current[0]).toEqual(stored);
        });
        act(() => {
            result.current[1](null);
        });
        expect(result.current[0]).toBeNull();
        await vi.waitFor(() => {
            expect(localStorage.getItem("date-range")).toBeNull();
        });
    });
    it("does not initialize without a storageKey", () => {
        const { result } = renderHook(() => useDateRange(null));
        expect(result.current[0]).toBeNull();
        expect(result.current[2].current).toBe(false);
    });
});
//# sourceMappingURL=useDateRange.test.js.map