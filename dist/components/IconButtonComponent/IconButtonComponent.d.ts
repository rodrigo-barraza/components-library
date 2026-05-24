import { ReactNode, ComponentPropsWithoutRef, MouseEvent } from "react";
export interface IconButtonComponentProps extends ComponentPropsWithoutRef<"button"> {
    icon: ReactNode;
    onClick?: (e: MouseEvent<HTMLButtonElement>) => void;
    tooltip?: string;
    variant?: "default" | "destructive";
    active?: boolean;
    hoverReveal?: boolean;
}
/**
 * IconButtonComponent — A small icon-only action button.
 */
export default function IconButtonComponent({ icon, onClick, tooltip, variant, active, hoverReveal, disabled, className, ...rest }: IconButtonComponentProps): import("react/jsx-runtime").JSX.Element;
//# sourceMappingURL=IconButtonComponent.d.ts.map