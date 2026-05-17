"use client";
import { jsx as _jsx } from "react/jsx-runtime";
import { createContext, useContext } from "react";
const ComponentsContext = createContext({
    sound: false,
});
export function ComponentsProvider({ sound = false, children }) {
    return (_jsx(ComponentsContext.Provider, { value: { sound }, children: children }));
}
/**
 * Hook to access library-wide configuration.
 */
export function useComponents() {
    return useContext(ComponentsContext);
}
//# sourceMappingURL=ComponentsProvider.js.map