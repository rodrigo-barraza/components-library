"use client";

import { useState, useCallback } from "react";

/**
 * useCrud — generic CRUD operations over a service layer with optimistic state.
 *
 * Extracts the repeated pattern from useContracts, useInvoices, useExpenses:
 * - create → prepend to list
 * - update → replace in list by `_id`
 * - remove → filter from list by `_id`
 *
 * Pair with useFetch for initial data loading.
 */

export interface UseCrudOptions<T> {
  /** service create function */
  createFn: (data: Record<string, unknown>) => Promise<T>;
  /** service update function */
  updateFn: (id: string, data: Record<string, unknown>) => Promise<T>;
  /** service delete function */
  removeFn: (id: string) => Promise<void>;
  /** field name for entity ID */
  idField?: string;
}

export interface UseCrudResult<T> {
  items: T[];
  setItems: React.Dispatch<React.SetStateAction<T[]>>;
  create: (data: Record<string, unknown>) => Promise<T>;
  update: (id: string, data: Record<string, unknown>) => Promise<T>;
  remove: (id: string) => Promise<void>;
}

export default function useCrud<T extends Record<string, unknown>>(options: UseCrudOptions<T>): UseCrudResult<T> {
  const { createFn, updateFn, removeFn, idField = "_id" } = options;
  const [items, setItems] = useState<T[]>([]);

  const create = useCallback(
    async (data: Record<string, unknown>): Promise<T> => {
      const item = await createFn(data);
      setItems((prev) => [item, ...prev]);
      return item;
    },
    [createFn],
  );

  const update = useCallback(
    async (id: string, data: Record<string, unknown>): Promise<T> => {
      const item = await updateFn(id, data);
      setItems((prev) =>
        prev.map((i) => (i[idField] === id ? item : i)),
      );
      return item;
    },
    [updateFn, idField],
  );

  const remove = useCallback(
    async (id: string): Promise<void> => {
      await removeFn(id);
      setItems((prev) => prev.filter((i) => i[idField] !== id));
    },
    [removeFn, idField],
  );

  return { items, setItems, create, update, remove };
}
