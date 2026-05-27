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
 * PageHeaderComponent — When used inside a PageLayoutComponent, pushes
 * page identity (title, subtitle, back) up to LayoutHeaderComponent
 * via context, and renders only the action children inline.
 *
 * When used standalone (no context provider), falls back to rendering
 * the classic pageHeader bar with title/subtitle/back inline.
 */
export default function PageHeaderComponent({ title, subtitle, onBack, centerContent, children, sticky, className, }: PageHeaderComponentProps): import("react/jsx-runtime").JSX.Element | null;
//# sourceMappingURL=PageHeaderComponent.d.ts.map