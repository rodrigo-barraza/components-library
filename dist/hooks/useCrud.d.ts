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
export default function useCrud<T extends Record<string, unknown>>(options: UseCrudOptions<T>): UseCrudResult<T>;
//# sourceMappingURL=useCrud.d.ts.map