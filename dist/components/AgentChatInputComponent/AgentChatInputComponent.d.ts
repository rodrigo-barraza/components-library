export interface AgentChatInputComponentProps {
    onSend: (content: string) => void;
    /** When provided, the send button becomes a stop button while streaming. */
    onStop?: () => void;
    isStreaming?: boolean;
    disabled?: boolean;
    placeholder?: string;
    maxLength?: number;
    autoFocus?: boolean;
    className?: string;
}
export default function AgentChatInputComponent({ onSend, onStop, isStreaming, disabled, placeholder, maxLength, autoFocus, className, }: AgentChatInputComponentProps): import("react").JSX.Element;
//# sourceMappingURL=AgentChatInputComponent.d.ts.map