// @ts-nocheck
import { describe, it, expect, vi } from "vitest";
import { renderHook, act } from "@testing-library/react";
import useCrud from "./useCrud.js";

describe("useCrud", () => {
  it("creates and prepends to list", async () => {
    const createFn = vi.fn().mockResolvedValue({ _id: "1", name: "New" });
    const { result } = renderHook(() =>
      useCrud({ createFn, updateFn: vi.fn(), removeFn: vi.fn() }),
    );

    let created;
    await act(async () => {
      created = await result.current.create({ name: "New" });
    });

    expect(created).toEqual({ _id: "1", name: "New" });
    expect(result.current.items).toHaveLength(1);
    expect(result.current.items[0]).toEqual({ _id: "1", name: "New" });
  });

  it("updates item in list by id", async () => {
    const updateFn = vi
      .fn()
      .mockResolvedValue({ _id: "1", name: "Updated" });
    const { result } = renderHook(() =>
      useCrud({ createFn: vi.fn(), updateFn, removeFn: vi.fn() }),
    );

    // Seed with initial data
    act(() => {
      result.current.setItems([{ _id: "1", name: "Original" }]);
    });

    await act(async () => {
      await result.current.update("1", { name: "Updated" });
    });

    expect(result.current.items[0].name).toBe("Updated");
  });

  it("removes item from list by id", async () => {
    const removeFn = vi.fn().mockResolvedValue();
    const { result } = renderHook(() =>
      useCrud({ createFn: vi.fn(), updateFn: vi.fn(), removeFn }),
    );

    act(() => {
      result.current.setItems([
        { _id: "1", name: "A" },
        { _id: "2", name: "B" },
      ]);
    });

    await act(async () => {
      await result.current.remove("1");
    });

    expect(result.current.items).toHaveLength(1);
    expect(result.current.items[0]._id).toBe("2");
  });

  it("supports custom id field", async () => {
    const removeFn = vi.fn().mockResolvedValue();
    const { result } = renderHook(() =>
      useCrud({
        createFn: vi.fn(),
        updateFn: vi.fn(),
        removeFn,
        idField: "id",
      }),
    );

    act(() => {
      result.current.setItems([{ id: "a" }, { id: "b" }]);
    });

    await act(async () => {
      await result.current.remove("a");
    });

    expect(result.current.items).toHaveLength(1);
    expect(result.current.items[0].id).toBe("b");
  });
});
