import { ReactNode } from "react";
export interface PageHeaderComponentProps {
    title: string | ReactNode;
    subtitle?: string | ReactNode;
    onBack?: () => void;
    centerContent?: ReactNode;
    children?: ReactNode;
    sticky?: boolean;
    className?: string;
}
/**
 * PageHeaderComponent — Unified page header with optional back navigation.
 *
 * Merges the prism-client (sticky, blur, back arrow) and portal (simple flex)
 * variants. The `sticky` prop controls whether the header sticks to the top.
 */
export default function PageHeaderComponent({ title, subtitle, onBack, centerContent, children, sticky, className, }: PageHeaderComponentProps): import("react/jsx-runtime").JSX.Element;
//# sourceMappingURL=PageHeaderComponent.d.ts.map