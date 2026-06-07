import { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import styles from "./LayoutHeaderComponent.module.css";
export interface LayoutHeaderToggleButtonProps {
    isVisible: boolean;
    onToggle: () => void;
    visibleIcon: ReactNode;
    hiddenIcon: ReactNode;
    label?: string;
}
export interface LayoutHeaderComponentProps {
    title?: string | ReactNode;
    titleIcon?: LucideIcon;
    titleBadge?: ReactNode;
    onBack?: () => void;
    leadingToggle?: LayoutHeaderToggleButtonProps;
    trailingToggle?: LayoutHeaderToggleButtonProps;
    centerContent?: ReactNode;
    metaContent?: ReactNode;
    controls?: ReactNode;
    isMobile?: boolean;
    className?: string;
    children?: ReactNode;
}
declare const LayoutHeaderComponent: import("react").ForwardRefExoticComponent<LayoutHeaderComponentProps & import("react").RefAttributes<HTMLElement>>;
export default LayoutHeaderComponent;
export { styles as layoutHeaderStyles };
//# sourceMappingURL=LayoutHeaderComponent.d.ts.map