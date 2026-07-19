import { type ReactNode } from "react";
import { type AgentChatMessage, type AgentChatRole } from "../../constants/agentChat.js";
export interface AgentChatMessageListComponentProps {
    messages: AgentChatMessage[];
    /** Render an avatar for a message role. Defaults to User/Bot icons. */
    renderAvatar?: (role: AgentChatRole) => ReactNode;
    /** Role label above user messages. Default "User". */
    userLabel?: string;
    /** Role label above assistant messages. Default "Assistant". */
    assistantLabel?: string;
    /** Shown when there are no messages. */
    emptyState?: ReactNode;
    /** Render thinking pills. Default true. */
    showThinking?: boolean;
    /** Render tool-call summary pills. Default true. */
    showToolCalls?: boolean;
    className?: string;
}
export default function AgentChatMessageListComponent({ messages, renderAvatar, userLabel, assistantLabel, emptyState, showThinking, showToolCalls, className, }: AgentChatMessageListComponentProps): import("react").JSX.Element;
//# sourceMappingURL=AgentChatMessageListComponent.d.ts.map