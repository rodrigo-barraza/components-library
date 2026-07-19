export interface ToastEntry {
    id: number;
    message: string;
    type: "success" | "warning" | "error" | "info" | string;
    /** Auto-dismiss duration in ms — drives the progress rail. 0 = sticky. */
    duration?: number;
}
/**
 * useToast — multi-toast queue hook.
 *
 * Returns { toasts, addToast, removeToast } plus a ready-to-render
 * <ToastComponent /> element you can drop into JSX.
 */
export declare function useToast(defaultDuration?: number): {
    toasts: ToastEntry[];
    addToast: (message: string, type?: "success" | "warning" | "error" | "info" | string, duration?: number) => number;
    removeToast: (id: number) => void;
};
export interface ToastComponentProps {
    toasts?: ToastEntry[];
    onRemove?: (id: number) => void;
}
/**
 * ToastComponent — renders a stacked toast container.
 */
export default function ToastComponent({ toasts, onRemove }: ToastComponentProps): import("react").JSX.Element | null;
//# sourceMappingURL=ToastComponent.d.ts.map