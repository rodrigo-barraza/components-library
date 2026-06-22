/**
 * MobileHeaderComponent — Compact top bar for mobile viewports.
 *
 * Renders a sticky header with hamburger menu button, brand label,
 * and an optional trailing actions slot. Only visible on mobile
 * (controlled via CSS media query at the consumer level or the
 * `visible` prop).
 */
interface MobileHeaderProps {
    brandLabel?: string;
    brandIcon?: React.ReactNode;
    onMenuClick: () => void;
    children?: React.ReactNode;
    className?: string;
}
export default function MobileHeaderComponent({ brandLabel, brandIcon, onMenuClick, children, className, }: MobileHeaderProps): import("react").JSX.Element;
export {};
//# sourceMappingURL=MobileHeaderComponent.d.ts.map