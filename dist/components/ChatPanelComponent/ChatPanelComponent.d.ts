import type { ChatMessage } from "../../constants/chat.js";
export interface ChatPanelComponentProps {
    /** Panel visibility */
    isOpen: boolean;
    /** Message objects */
    messages: ChatMessage[];
    /** Agent typing indicator */
    isTyping: boolean;
    /** Display name for operator/agent */
    operatorName: string;
    /** Operator avatar URL */
    operatorAvatar?: string | null;
    /** Close panel callback */
    onClose: () => void;
    /** Send message callback */
    onSend: (content: string) => void;
}
/**
 * ChatPanelComponent — The chat panel UI.
 *
 * Contains a header (operator info + close), scrollable message list
 * with auto-scroll, typing indicator, and the message input bar.
 */
export default function ChatPanelComponent({ isOpen, messages, isTyping, operatorName, operatorAvatar, onClose, onSend, }: ChatPanelComponentProps): import("react/jsx-runtime").JSX.Element;
//# sourceMappingURL=ChatPanelComponent.d.ts.map