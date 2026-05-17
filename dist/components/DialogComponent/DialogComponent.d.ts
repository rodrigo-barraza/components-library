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
 *
 * @param {Object}   props
 * @param {boolean}  props.open                — Controls dialog visibility
 * @param {Function} props.onClose             — Called when dismissed (scrim click / Escape)
 * @param {React.ReactNode}  [props.icon]      — Optional hero icon (centered above headline)
 * @param {string}           [props.headline]  — Dialog headline / title
 * @param {Function}         [props.onConfirm] — Confirm action handler
 * @param {string}           [props.confirmLabel="OK"]    — Confirm button label
 * @param {string}           [props.cancelLabel="Cancel"] — Cancel button label
 * @param {boolean}          [props.hideCancel=false]      — Omit cancel button (acknowledgment dialogs)
 * @param {"default"|"destructive"} [props.confirmVariant="default"] — Visual emphasis
 * @param {boolean}          [props.confirmDisabled=false] — Disable confirm action
 * @param {boolean}          [props.fullscreen=false]      — Mobile fullscreen mode
 * @param {boolean}          [props.dismissible=true]      — Allow scrim/Escape dismissal
 * @param {string}           [props.className]             — Additional container class
 * @param {string}           [props.id]                    — Unique dialog ID for ARIA
 * @param {React.ReactNode}  props.children    — Supporting text / body content
 */
export default function DialogComponent({ open, onClose, icon, headline, onConfirm, confirmLabel, cancelLabel, hideCancel, confirmVariant, confirmDisabled, fullscreen, dismissible, className, id, children, }: {
    open: any;
    onClose: any;
    icon: any;
    headline: any;
    onConfirm: any;
    confirmLabel?: string | undefined;
    cancelLabel?: string | undefined;
    hideCancel?: boolean | undefined;
    confirmVariant?: string | undefined;
    confirmDisabled?: boolean | undefined;
    fullscreen?: boolean | undefined;
    dismissible?: boolean | undefined;
    className: any;
    id: any;
    children: any;
}): import("react/jsx-runtime").JSX.Element | null;
//# sourceMappingURL=DialogComponent.d.ts.map