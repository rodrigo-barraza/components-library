"use client";
import { useState, useCallback } from "react";
export default function useCrud(options) {
    const { createFn, updateFn, removeFn, idField = "_id" } = options;
    const [items, setItems] = useState([]);
    const create = useCallback(async (data) => {
        const item = await createFn(data);
        setItems((prev) => [item, ...prev]);
        return item;
    }, [createFn]);
    const update = useCallback(async (id, data) => {
        const item = await updateFn(id, data);
        setItems((prev) => prev.map((i) => (i[idField] === id ? item : i)));
        return item;
    }, [updateFn, idField]);
    const remove = useCallback(async (id) => {
        await removeFn(id);
        setItems((prev) => prev.filter((i) => i[idField] !== id));
    }, [removeFn, idField]);
    return { items, setItems, create, update, remove };
}
//# sourceMappingURL=useCrud.js.map