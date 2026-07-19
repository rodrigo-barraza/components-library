import { type ReactNode } from "react";
import { type AgentChatMessage, type AgentChatRole } from "../../constants/agentChat.js";
export interface AgentChatMessageListComponentProps {
    messages: AgentChatMessage[];
    /** Render an avatar for a message role. Return null to hide avatars. */
    renderAvatar?: (role: AgentChatRole) => ReactNode;
    /** Shown when there are no messages. */
    emptyState?: ReactNode;
    /** Render collapsible thinking sections. Default true. */
    showThinking?: boolean;
    /** Render tool-call summary pills. Default true. */
    showToolCalls?: boolean;
    className?: string;
}
export default function AgentChatMessageListComponent({ messages, renderAvatar, emptyState, showThinking, showToolCalls, className, }: AgentChatMessageListComponentProps): import("react").JSX.Element;
//# sourceMappingURL=AgentChatMessageListComponent.d.ts.map