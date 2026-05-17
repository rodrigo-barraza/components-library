import { type ChatMessage } from "../../constants/chat.js";
export interface ChatMessageComponentProps {
    /** The message object to render */
    message: ChatMessage;
    /** Whether this is the first message in the list */
    isFirst?: boolean;
    /** Role of the previous message for grouping */
    previousRole?: string | null;
}
/**
 * ChatMessageComponent — Individual message bubble.
 */
export default function ChatMessageComponent({ message, isFirst, previousRole, }: ChatMessageComponentProps): import("react/jsx-runtime").JSX.Element;
//# sourceMappingURL=ChatMessageComponent.d.ts.map