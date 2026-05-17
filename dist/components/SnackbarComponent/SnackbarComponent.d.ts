export declare function useSnackbar(): {
    showSnackbar: (message: any, options?: {}) => number;
    dismiss: () => void;
    snackbarProps: {
        open: boolean;
        message: any;
        actionLabel: any;
        showClose: any;
        onAction: () => void;
        onDismiss: () => void;
    };
};
export default function SnackbarComponent({ open, message, actionLabel, showClose, onAction, onDismiss, className, id, }: {
    open: any;
    message: any;
    actionLabel: any;
    showClose?: boolean | undefined;
    onAction: any;
    onDismiss: any;
    className: any;
    id: any;
}): import("react/jsx-runtime").JSX.Element | null;
//# sourceMappingURL=SnackbarComponent.d.ts.map