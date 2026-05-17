/**
 * DeviceBadgeComponent — Semantic badge for the host device running a service.
 *
 * Displays the device name with an icon passed via the `icons` prop
 * to remain icon-library-agnostic.
 *
 * @param {string} device — Device name (e.g. "Synology NAS", "Raspberry Pi")
 * @param {{ Server: React.ComponentType }} [icons] — Icon components
 * @param {string} [className] — Additional CSS class
 */
export default function DeviceBadgeComponent({ device, icons, className, ...rest }: {
    [x: string]: any;
    device: any;
    icons: any;
    className: any;
}): import("react/jsx-runtime").JSX.Element | null;
//# sourceMappingURL=DeviceBadgeComponent.d.ts.map