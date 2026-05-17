/**
 * ModalComponent — Structured modal dialog with header, body, and footer.
 *
 * Renders a full-screen overlay with a centered panel. Supports Escape
 * and click-outside dismissal, React Portal mounting, body scroll lock,
 * focus trapping with focus restoration, and four size presets.
 *
 * @param {string|React.ReactNode} title — Header title
 * @param {Function} onClose — Called when X / overlay / Escape dismisses
 * @param {React.ReactNode} [footer] — Sticky footer content (action buttons)
 * @param {"sm"|"md"|"lg"|"xl"} [size="md"] — Panel width preset
 * @param {"default"|"dark"} [variant="default"] — Overlay darkness
 * @param {string} [className] — Additional class on the panel
 * @param {string} [id] — Unique ID for ARIA labelling
 * @param {React.ReactNode} children — Body content
 */
export default function ModalComponent({ title, onClose, footer, size, variant, className, id, children, }: {
    title: any;
    onClose: any;
    footer: any;
    size?: string | undefined;
    variant?: string | undefined;
    className: any;
    id: any;
    children: any;
}): import("react/jsx-runtime").JSX.Element;
//# sourceMappingURL=ModalComponent.d.ts.map