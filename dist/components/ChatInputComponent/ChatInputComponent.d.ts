export interface ChatInputComponentProps {
    /** Called with message content string */
    onSend: (content: string) => void;
    /** Agent is generating a response */
    isTyping?: boolean;
}
/**
 * ChatInputComponent — Message input with auto-expanding textarea.
 *
 * - Send on Enter, newline on Shift+Enter
 * - Auto-expands up to 4 lines
 * - Disabled during AI generation
 * - Character limit indicator
 */
export default function ChatInputComponent({ onSend, isTyping }: ChatInputComponentProps): import("react/jsx-runtime").JSX.Element;
//# sourceMappingURL=ChatInputComponent.d.ts.map