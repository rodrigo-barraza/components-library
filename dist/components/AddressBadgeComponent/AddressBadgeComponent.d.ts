/**
 * AddressBadgeComponent — Semantic badge for a network socket address (IP:port).
 *
 * Strips the protocol prefix and displays the raw address in monospace.
 * Optionally renders as a clickable link.
 */
interface AddressBadgeProps {
    address: string;
    link?: boolean;
    className?: string;
    [key: string]: unknown;
}
export default function AddressBadgeComponent({ address, link, className, ...rest }: AddressBadgeProps): import("react/jsx-runtime").JSX.Element | null;
export {};
//# sourceMappingURL=AddressBadgeComponent.d.ts.map