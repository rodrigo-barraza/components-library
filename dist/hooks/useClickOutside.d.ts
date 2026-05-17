import { type RefObject } from "react";
/**
 * useClickOutside — triggers a callback when a click occurs outside the
 * referenced element(s). Essential for dropdown menus, popovers, modals,
 * and any dismissible overlay.
 *
 * @param refs — ref(s) to the container element(s)
 * @param handler — callback invoked on outside click
 * @param options
 */
interface UseClickOutsideOptions {
    /** set false to pause detection */
    enabled?: boolean;
}
export default function useClickOutside(refs: RefObject<Element | null> | RefObject<Element | null>[], handler: (event: MouseEvent | TouchEvent) => void, options?: UseClickOutsideOptions): void;
export {};
//# sourceMappingURL=useClickOutside.d.ts.map