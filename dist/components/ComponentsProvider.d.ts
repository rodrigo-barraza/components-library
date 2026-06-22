import { type ReactNode } from "react";
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
    userMenu?: ReactNode;
}
interface ComponentsProviderProps {
    /** Enable procedural audio feedback */
    sound?: boolean;
    /** Global user avatar menu/dropdown widget to display in header sections */
    userMenu?: ReactNode;
    children: ReactNode;
}
export declare function ComponentsProvider({ sound, userMenu, children }: ComponentsProviderProps): import("react").JSX.Element;
/**
 * Hook to access library-wide configuration.
 */
export declare function useComponents(): ComponentsContextValue;
export {};
//# sourceMappingURL=ComponentsProvider.d.ts.map