/**
 * MobileHeaderComponent — Compact top bar for mobile viewports.
 *
 * Renders a sticky header with hamburger menu button, brand label,
 * and an optional trailing actions slot. Only visible on mobile
 * (controlled via CSS media query at the consumer level or the
 * `visible` prop).
 *
 * @param {string}   [brandLabel]    — App name displayed in the header
 * @param {string|React.ReactNode} [brandIcon] — Brand icon (URL string or ReactNode)
 * @param {Function} onMenuClick     — Handler for hamburger button tap
 * @param {React.ReactNode} [children] — Trailing actions (e.g. refresh button)
 * @param {string}   [className]     — Additional class on the root element
 */
interface MobileHeaderProps {
    brandLabel?: string;
    brandIcon?: any;
    onMenuClick: () => void;
    children?: React.ReactNode;
    className?: string;
}
export default function MobileHeaderComponent({ brandLabel, brandIcon, onMenuClick, children, className, }: MobileHeaderProps): import("react/jsx-runtime").JSX.Element;
export {};
//# sourceMappingURL=MobileHeaderComponent.d.ts.map