import { ReactNode, ComponentPropsWithoutRef, MouseEvent } from "react";
export interface IconButtonComponentProps extends ComponentPropsWithoutRef<"button"> {
    icon: ReactNode;
    onClick?: (event: MouseEvent<HTMLButtonElement>) => void;
    tooltip?: string;
    variant?: "default" | "destructive";
    active?: boolean;
    hoverReveal?: boolean;
}
/**
 * IconButtonComponent — A small icon-only action button.
 */
export default function IconButtonComponent({ icon, onClick, tooltip, variant, active, hoverReveal, disabled, className, ...rest }: IconButtonComponentProps): import("react").JSX.Element;
//# sourceMappingURL=IconButtonComponent.d.ts.map