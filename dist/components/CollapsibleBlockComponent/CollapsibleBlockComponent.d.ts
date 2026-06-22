import { ReactNode } from "react";
export interface CollapsibleBlockComponentProps {
    icon?: ReactNode;
    label: string | ReactNode;
    badge?: ReactNode;
    defaultCollapsed?: boolean;
    open?: boolean;
    onToggle?: (open: boolean) => void;
    headerActions?: ReactNode;
    className?: string;
    children?: ReactNode;
}
/**
 * CollapsibleBlockComponent — A disclosure widget with chevron toggle.
 *
 * Wraps any content behind a clickable header with an icon, label,
 * and optional badge. Supports both controlled and uncontrolled modes.
 */
export default function CollapsibleBlockComponent({ icon, label, badge, defaultCollapsed, open: controlledOpen, onToggle, headerActions, className, children, }: CollapsibleBlockComponentProps): import("react").JSX.Element;
//# sourceMappingURL=CollapsibleBlockComponent.d.ts.map