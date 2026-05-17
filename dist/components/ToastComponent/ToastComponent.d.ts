/**
 * useToast — multi-toast queue hook.
 *
 * Returns { toasts, addToast, removeToast } plus a ready-to-render
 * <ToastComponent /> element you can drop into JSX.
 *
 * @param {number} [defaultDuration=3500] — default auto-dismiss time in ms
 */
export declare function useToast(defaultDuration?: number): {
    toasts: any[];
    addToast: (message: any, type?: string, duration?: number) => number;
    removeToast: (id: any) => void;
};
/**
 * ToastComponent — renders a stacked toast container.
 *
 * @param {{ id: number, message: string, type: string }[]} toasts

 */
export default function ToastComponent({ toasts, onRemove }: {
    toasts?: any[];
    onRemove: any;
}): import("react/jsx-runtime").JSX.Element;
//# sourceMappingURL=ToastComponent.d.ts.map