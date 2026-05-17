/**
 * IconButtonComponent — A small icon-only action button.
 *
 * @param {React.ReactNode} icon — The icon element (e.g. <Copy size={14} />)
 * @param {Function} onClick — Click handler
 * @param {string} [tooltip] — Native title tooltip
 * @param {"default"|"destructive"} [variant="default"] — Button variant
 * @param {boolean} [active=false] — Active/pressed state
 * @param {boolean} [hoverReveal=false] — Hidden until parent :hover
 * @param {boolean} [disabled=false] — Disabled state
 * @param {string} [className] — Additional class
 */
export default function IconButtonComponent({ icon, onClick, tooltip, variant, active, hoverReveal, disabled, className, ...rest }: {
    [x: string]: any;
    icon: any;
    onClick: any;
    tooltip: any;
    variant?: string | undefined;
    active?: boolean | undefined;
    hoverReveal?: boolean | undefined;
    disabled?: boolean | undefined;
    className: any;
}): import("react/jsx-runtime").JSX.Element;
//# sourceMappingURL=IconButtonComponent.d.ts.map