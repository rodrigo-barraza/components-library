/**
 * CloseButtonComponent — An X-icon dismiss button for modals, drawers, and panels.
 *
 * @param {Function} onClick — Click handler (typically onClose)
 * @param {number} [size=18] — Icon size
 * @param {"default"|"dark"} [variant="default"] — default for modal headers, dark for overlay viewers
 * @param {string} [className] — Additional class
 */
interface CloseButtonProps {
    onClick: (e?: React.MouseEvent) => void;
    size?: number;
    variant?: string;
    className?: string;
}
export default function CloseButtonComponent({ onClick, size, variant, className, }: CloseButtonProps): import("react/jsx-runtime").JSX.Element;
export {};
//# sourceMappingURL=CloseButtonComponent.d.ts.map