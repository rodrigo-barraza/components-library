"use client";

import { createContext, useContext } from "react";

/**
 * ComponentsContext — Global configuration for @rodrigo-barraza/components-library.
 *
 * Wrap your app with <ComponentsProvider> to enable features like
 * spatial audio feedback on interactive components.
 *
 * @example
 *   import { ComponentsProvider } from "@rodrigo-barraza/components-library";
 *
 *   <ComponentsProvider sound>
 *     <App />
 *   </ComponentsProvider>
 */
const ComponentsContext = createContext({
  sound: false,
});

/**
 * @param {Object} props
 * @param {boolean} [props.sound=false] — Enable procedural audio feedback
 * @param {React.ReactNode} props.children
 */
export function ComponentsProvider({ sound = false, children }) {
  return (
    <ComponentsContext.Provider value={{ sound }}>
      {children}
    </ComponentsContext.Provider>
  );
}

/**
 * Hook to access library-wide configuration.
 * @returns {{ sound: boolean }}
 */
export function useComponents() {
  return useContext(ComponentsContext);
}
