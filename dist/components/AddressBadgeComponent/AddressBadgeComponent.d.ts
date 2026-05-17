/**
 * AddressBadgeComponent — Semantic badge for a network socket address (IP:port).
 *
 * Strips the protocol prefix and displays the raw address in monospace.
 * Optionally renders as a clickable link.
 *
 * @param {string} address — Full URL or raw address (e.g. "http://192.168.86.2:3000")
 * @param {boolean} [link=false] — Render as an anchor tag
 * @param {string} [className] — Additional CSS class
 */
export default function AddressBadgeComponent({ address, link, className, ...rest }: {
    [x: string]: any;
    address: any;
    link?: boolean | undefined;
    className: any;
}): import("react/jsx-runtime").JSX.Element | null;
//# sourceMappingURL=AddressBadgeComponent.d.ts.map