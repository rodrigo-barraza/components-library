/**
 * ToolCardComponent — Reusable card for displaying a tool schema.
 *
 * Renders an emoji + tool name header, domain badge, truncated description,
 * and an optional footer slot for badges (agents, labels, param counts).
 */
export interface ToolCardComponentProps {
    name: string;
    description: string;
    emoji?: string | null;
    domain?: string;
    onClick?: () => void;
    children?: React.ReactNode;
    className?: string;
}
export default function ToolCardComponent({ name, description, emoji, domain, onClick, children, className, }: ToolCardComponentProps): import("react").JSX.Element;
//# sourceMappingURL=ToolCardComponent.d.ts.map