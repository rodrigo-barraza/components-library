import { ReactNode } from "react";
export interface ModalComponentProps {
    title: string | ReactNode;
    onClose: () => void;
    footer?: ReactNode;
    size?: "sm" | "md" | "lg" | "xl" | string;
    variant?: "default" | "dark" | string;
    className?: string;
    id?: string;
    children?: ReactNode;
}
/**
 * ModalComponent — Structured modal dialog with header, body, and footer.
 *
 * Renders a full-screen overlay with a centered panel. Supports Escape
 * and click-outside dismissal, React Portal mounting, body scroll lock,
 * focus trapping with focus restoration, and four size presets.
 */
export default function ModalComponent({ title, onClose, footer, size, variant, className, id, children, }: ModalComponentProps): import("react/jsx-runtime").JSX.Element;
//# sourceMappingURL=ModalComponent.d.ts.map