import { ReactNode } from "react";
export interface EmptyStateComponentProps {
    icon?: ReactNode;
    title?: string | ReactNode;
    subtitle?: string | ReactNode;
    children?: ReactNode;
    className?: string;
}
/**
 * EmptyStateComponent — A centered "no data" placeholder with icon, title, and subtitle.
 */
export default function EmptyStateComponent({ icon, title, subtitle, children, className, }: EmptyStateComponentProps): import("react/jsx-runtime").JSX.Element;
//# sourceMappingURL=EmptyStateComponent.d.ts.map