"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import useAgentChat from "../../hooks/useAgentChat.js";
import AgentChatMessageListComponent from "../AgentChatMessageListComponent/AgentChatMessageListComponent.js";
import AgentChatInputComponent from "../AgentChatInputComponent/AgentChatInputComponent.js";
import styles from "./AgentChatWindowComponent.module.css";
export default function AgentChatWindowComponent({ header, footer, emptyState, renderAvatar, userLabel, assistantLabel, inputPlaceholder, showThinking, showToolCalls, autoFocus, className, ...chatOptions }) {
    const { messages, isStreaming, send, stop } = useAgentChat(chatOptions);
    return (_jsxs("div", { className: `agent-chat-window-component ${styles['window']} ${className || ""}`, children: [header, _jsx(AgentChatMessageListComponent, { messages: messages, renderAvatar: renderAvatar, userLabel: userLabel, assistantLabel: assistantLabel, emptyState: emptyState, showThinking: showThinking, showToolCalls: showToolCalls }), _jsxs("div", { className: styles['input-area'], children: [_jsx(AgentChatInputComponent, { onSend: send, onStop: stop, isStreaming: isStreaming, placeholder: inputPlaceholder, autoFocus: autoFocus }), footer] })] }));
}
//# sourceMappingURL=AgentChatWindowComponent.js.map