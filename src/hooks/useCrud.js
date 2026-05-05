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
 *
 * @template T
 * @param {object} options
 * @param {(data: object) => Promise<T>} options.createFn — service create function
 * @param {(id: string, data: object) => Promise<T>} options.updateFn — service update function
 * @param {(id: string) => Promise<void>} options.removeFn — service delete function
 * @param {string} [options.idField="_id"] — field name for entity ID
 * @returns {{
 *   items: T[],
 *   setItems: Function,
 *   create: (data: object) => Promise<T>,
 *   update: (id: string, data: object) => Promise<T>,
 *   remove: (id: string) => Promise<void>,
 * }}
 */
export default function useCrud(options = {}) {
  const { createFn, updateFn, removeFn, idField = "_id" } = options;
  const [items, setItems] = useState([]);

  const create = useCallback(
    async (data) => {
      const item = await createFn(data);
      setItems((prev) => [item, ...prev]);
      return item;
    },
    [createFn],
  );

  const update = useCallback(
    async (id, data) => {
      const item = await updateFn(id, data);
      setItems((prev) =>
        prev.map((i) => (i[idField] === id ? item : i)),
      );
      return item;
    },
    [updateFn, idField],
  );

  const remove = useCallback(
    async (id) => {
      await removeFn(id);
      setItems((prev) => prev.filter((i) => i[idField] !== id));
    },
    [removeFn, idField],
  );

  return { items, setItems, create, update, remove };
}
