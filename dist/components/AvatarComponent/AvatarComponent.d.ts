import { ElementType, ComponentPropsWithoutRef, ReactNode } from "react";
export interface AvatarComponentProps extends ComponentPropsWithoutRef<"div"> {
    src?: string;
    alt?: string;
    name?: string;
    icon?: ElementType;
    size?: "xs" | "sm" | "md" | "lg" | "xl";
    status?: "online" | "offline" | "busy" | "away";
}
/**
 * AvatarComponent — M3-inspired avatar with image, initials, or icon fallback.
 *
 * Supports five sizes and an optional online/offline/busy/away status dot.
 * Compound sub-component `AvatarComponent.Group` stacks avatars with
 * overlapping borders and a "+N" overflow indicator.
 */
declare function AvatarComponent({ src, alt, name, icon: Icon, size, status, className, style, ...rest }: AvatarComponentProps): import("react/jsx-runtime").JSX.Element;
declare namespace AvatarComponent {
    var Group: typeof AvatarGroup;
}
export default AvatarComponent;
export interface AvatarGroupProps {
    max?: number;
    size?: "xs" | "sm" | "md" | "lg" | "xl";
    className?: string;
    children?: ReactNode;
}
/**
 * AvatarComponent.Group — stacks avatars with overlapping layout.
 */
declare function AvatarGroup({ max, size, className, children }: AvatarGroupProps): import("react/jsx-runtime").JSX.Element;
//# sourceMappingURL=AvatarComponent.d.ts.map