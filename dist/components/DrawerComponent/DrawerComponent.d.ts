import { ReactNode } from "react";
export interface DrawerItem {
    label: ReactNode;
    value: ReactNode;
    mono?: boolean;
}
export interface DrawerSection {
    title: string;
    items: DrawerItem[];
}
export interface DrawerComponentProps {
    open: boolean;
    onClose: () => void;
    title?: ReactNode;
    anchor?: "left" | "right";
    width?: number | string;
    scrim?: boolean;
    dismissible?: boolean;
    headerActions?: ReactNode;
    sections?: DrawerSection[];
    children?: ReactNode;
    className?: string;
    id?: string;
    contentKey?: string | number | null;
}
/**
 * DrawerComponent — M3 Side Sheet / slide-in drawer panel.
 *
 * A reusable panel that slides in from either side of the viewport.
 * Supports click-outside dismiss, Escape key, optional scrim overlay,
 * structured sections with label/value grids, and arbitrary children.
 */
export default function DrawerComponent({ open, onClose, title, anchor, width, scrim, dismissible, headerActions, sections, children, className, id, contentKey, }: DrawerComponentProps): import("react").JSX.Element | null;
//# sourceMappingURL=DrawerComponent.d.ts.map