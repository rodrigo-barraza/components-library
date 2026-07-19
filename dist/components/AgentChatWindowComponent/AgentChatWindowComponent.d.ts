import { type ReactNode } from "react";
import { type UseAgentChatOptions } from "../../hooks/useAgentChat.js";
import { type AgentChatRole } from "../../constants/agentChat.js";
export interface AgentChatWindowComponentProps extends UseAgentChatOptions {
    /** Rendered above the message list (title bar, status, …). */
    header?: ReactNode;
    /** Rendered below the input (disclaimers, hints, …). */
    footer?: ReactNode;
    /** Shown inside the list while there are no messages. */
    emptyState?: ReactNode;
    renderAvatar?: (role: AgentChatRole) => ReactNode;
    inputPlaceholder?: string;
    showThinking?: boolean;
    showToolCalls?: boolean;
    autoFocus?: boolean;
    className?: string;
}
export default function AgentChatWindowComponent({ header, footer, emptyState, renderAvatar, inputPlaceholder, showThinking, showToolCalls, autoFocus, className, ...chatOptions }: AgentChatWindowComponentProps): import("react").JSX.Element;
//# sourceMappingURL=AgentChatWindowComponent.d.ts.map