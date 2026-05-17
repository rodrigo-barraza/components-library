/**
 * useLocalStorage — SSR-safe state synchronization with localStorage.
 *
 * Persists a JSON-serializable value under the given key. Hydrates from
 * localStorage on mount (post-SSR) and writes back on every state change.
 */
export default function useLocalStorage<T>(key: string, initialValue: T): [T, (value: T | ((prev: T) => T)) => void, () => void];
//# sourceMappingURL=useLocalStorage.d.ts.map