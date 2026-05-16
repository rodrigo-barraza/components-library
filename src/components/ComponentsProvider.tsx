"use client";

import { createContext, useContext, type ReactNode } from "react";

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

export interface ComponentsContextValue {
  sound: boolean;
}

const ComponentsContext = createContext<ComponentsContextValue>({
  sound: false,
});

interface ComponentsProviderProps {
  /** Enable procedural audio feedback */
  sound?: boolean;
  children: ReactNode;
}

export function ComponentsProvider({ sound = false, children }: ComponentsProviderProps) {
  return (
    <ComponentsContext.Provider value={{ sound }}>
      {children}
    </ComponentsContext.Provider>
  );
}

/**
 * Hook to access library-wide configuration.
 */
export function useComponents(): ComponentsContextValue {
  return useContext(ComponentsContext);
}
