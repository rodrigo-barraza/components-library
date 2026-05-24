import { ElementType, ComponentPropsWithoutRef, MouseEvent } from "react";
export interface BreadcrumbItem {
    label: string;
    href?: string;
    icon?: ElementType;
    onClick?: (e: MouseEvent<HTMLAnchorElement | HTMLButtonElement>) => void;
}
export interface BreadcrumbComponentProps extends ComponentPropsWithoutRef<"nav"> {
    items?: BreadcrumbItem[];
    separator?: "chevron" | "slash" | "dot";
}
/**
 * BreadcrumbComponent — Navigation breadcrumb trail.
 *
 * Renders a horizontal chain of path segments separated by
 * a chevron divider. The last item is styled as the current page
 * (non-interactive, bold). Supports icon prefixes per segment.
 */
export default function BreadcrumbComponent({ items, separator, className, ...rest }: BreadcrumbComponentProps): import("react/jsx-runtime").JSX.Element | null;
//# sourceMappingURL=BreadcrumbComponent.d.ts.map