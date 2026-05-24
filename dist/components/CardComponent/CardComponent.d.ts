import { type ReactNode, type MouseEvent } from "react";
interface CardComponentProps extends React.HTMLAttributes<HTMLDivElement> {
    variant?: "elevated" | "filled" | "outlined";
    interactive?: boolean;
    draggable?: boolean;
    fullWidth?: boolean;
}
interface CardHeaderProps {
    icon?: React.ComponentType<{
        size: number;
        className?: string;
    }>;
    title?: string;
    subtitle?: string;
    children?: ReactNode;
    className?: string;
}
interface CardMediaProps {
    src?: string;
    alt?: string;
    height?: number | string;
    aspectRatio?: string;
    position?: "top" | "bottom";
    className?: string;
    children?: ReactNode;
}
interface CardBodyProps {
    children?: ReactNode;
    className?: string;
}
interface CardFooterProps {
    children?: ReactNode;
    className?: string;
}
interface CardActionAreaProps extends React.HTMLAttributes<HTMLElement> {
    onClick?: (e: MouseEvent<HTMLButtonElement>) => void;
    href?: string;
}
/**
 * CardComponent — M3-inspired compound card with elevated / filled / outlined variants.
 *
 * Material Design 3 defines three card types:
 *   • elevated  — surface-tint + shadow elevation (default)
 *   • filled   — highest surface container color, no outline
 *   • outlined — thin outline border, no elevation
 *
 * Compound sub-components:
 *   CardComponent.Header      — top bar with icon, title, subtitle, trailing actions
 *   CardComponent.Media       — full-bleed media slot (images, video, illustration)
 *   CardComponent.Body        — main content area with padding
 *   CardComponent.Footer      — bottom bar (e.g. action buttons)
 *   CardComponent.ActionArea  — makes the card (or a region) clickable with ripple
 */
declare function CardComponent({ variant, interactive, draggable: isDraggable, fullWidth, className, style, children, ...rest }: CardComponentProps): import("react/jsx-runtime").JSX.Element;
declare namespace CardComponent {
    var Header: typeof CardHeader;
    var Media: typeof CardMedia;
    var Body: typeof CardBody;
    var Footer: typeof CardFooter;
    var ActionArea: import("react").ForwardRefExoticComponent<CardActionAreaProps & import("react").RefAttributes<HTMLAnchorElement | HTMLButtonElement>>;
}
export default CardComponent;
declare function CardHeader({ icon: Icon, title, subtitle, children, className }: CardHeaderProps): import("react/jsx-runtime").JSX.Element;
/**
 * CardMedia — M3 media slot for full-bleed images, video, or illustrations.
 */
declare function CardMedia({ src, alt, height, aspectRatio, position, className, children, }: CardMediaProps): import("react/jsx-runtime").JSX.Element;
declare function CardBody({ children, className }: CardBodyProps): import("react/jsx-runtime").JSX.Element;
declare function CardFooter({ children, className }: CardFooterProps): import("react/jsx-runtime").JSX.Element;
//# sourceMappingURL=CardComponent.d.ts.map