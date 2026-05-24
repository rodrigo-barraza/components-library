interface SnackbarOptions {
    actionLabel?: string;
    onAction?: () => void;
    showClose?: boolean;
    duration?: number;
}
export declare function useSnackbar(): {
    showSnackbar: (message: string, options?: SnackbarOptions) => number;
    dismiss: () => void;
    snackbarProps: {
        open: boolean;
        message: string;
        actionLabel: string | undefined;
        showClose: boolean;
        onAction: () => void;
        onDismiss: () => void;
    };
};
export interface SnackbarComponentProps {
    open: boolean;
    message: string;
    actionLabel?: string;
    showClose?: boolean;
    onAction?: () => void;
    onDismiss?: () => void;
    className?: string;
    id?: string;
}
export default function SnackbarComponent({ open, message, actionLabel, showClose, onAction, onDismiss, className, id, }: SnackbarComponentProps): import("react/jsx-runtime").JSX.Element | null;
export {};
//# sourceMappingURL=SnackbarComponent.d.ts.map