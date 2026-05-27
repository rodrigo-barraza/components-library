"use client";
import { jsx as _jsx } from "react/jsx-runtime";
import { createContext, useContext } from "react";
const PageHeaderContext = createContext(null);
export function PageHeaderProvider({ children, onIdentityChange, }) {
    return (_jsx(PageHeaderContext.Provider, { value: onIdentityChange, children: children }));
}
export function usePageHeaderContext() {
    return useContext(PageHeaderContext);
}
//# sourceMappingURL=PageHeaderContext.js.map