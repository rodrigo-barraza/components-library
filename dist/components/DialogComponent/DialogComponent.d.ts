import { ReactNode } from "react";
export interface DialogComponentProps {
    open: boolean;
    onClose: () => void;
    icon?: ReactNode;
    headline?: string | ReactNode;
    onConfirm?: () => void;
    confirmLabel?: string;
    cancelLabel?: string;
    hideCancel?: boolean;
    confirmVariant?: "default" | "destructive" | string;
    confirmDisabled?: boolean;
    fullscreen?: boolean;
    dismissible?: boolean;
    className?: string;
    id?: string;
    children?: ReactNode;
}
/**
 * DialogComponent — M3 AlertDialog
 *
 * A focused, interruptive prompt that requires user acknowledgment.
 * Implements the Material Design 3 dialog pattern with proper
 * scrim, focus trapping, Escape dismissal, and accessible markup.
 *
 * @see https://m3.material.io/components/dialogs
 *
 * Anatomy: [scrim] → [container] → [icon?] → [headline?] → [body] → [actions]
 */
export default function DialogComponent({ open, onClose, icon, headline, onConfirm, confirmLabel, cancelLabel, hideCancel, confirmVariant, confirmDisabled, fullscreen, dismissible, className, id, children, }: DialogComponentProps): import("react").JSX.Element | null;
//# sourceMappingURL=DialogComponent.d.ts.map