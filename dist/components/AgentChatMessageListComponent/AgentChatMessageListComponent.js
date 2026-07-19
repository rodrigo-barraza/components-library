"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
// ─────────────────────────────────────────────────────────────
// AgentChatMessageListComponent — Lean "chat mode" message list
// for the agent chat window: markdown assistant bubbles, plain
// user bubbles, collapsible thinking, tool-call summary pills,
// inline images, and a streaming cursor.
// ─────────────────────────────────────────────────────────────
import { useCallback, useEffect, useRef, useState, } from "react";
import { AlertCircle, Brain, Check, ChevronDown, Loader2 } from "lucide-react";
import MarkdownContentComponent from "../MarkdownContentComponent/MarkdownContentComponent.js";
import StreamingCursorComponent from "../StreamingCursorComponent/StreamingCursorComponent.js";
import { splitStreamingTail } from "../../utils/streamingText.js";
import { AGENT_CHAT_ROLES, AGENT_TOOL_CALL_STATUS, } from "../../constants/agentChat.js";
import styles from "./AgentChatMessageListComponent.module.css";
function ToolCallPill({ toolCall }) {
    const isRunning = toolCall.status === AGENT_TOOL_CALL_STATUS.RUNNING;
    const isError = toolCall.status === AGENT_TOOL_CALL_STATUS.ERROR;
    const label = toolCall.label || toolCall.name;
    return (_jsxs("span", { className: `${styles['tool-pill']} ${isRunning ? styles['tool-pill-running'] : ""} ${isError ? styles['tool-pill-error'] : ""}`, title: toolCall.name, children: [isRunning ? (_jsx(Loader2, { size: 11, className: styles['tool-pill-spinner'] })) : isError ? (_jsx(AlertCircle, { size: 11 })) : toolCall.emoji ? (_jsx("span", { className: styles['tool-pill-emoji'], children: toolCall.emoji })) : (_jsx(Check, { size: 11 })), _jsx("span", { className: styles['tool-pill-label'], children: label }), typeof toolCall.durationMs === "number" && !isRunning && (_jsxs("span", { className: styles['tool-pill-duration'], children: [(toolCall.durationMs / 1000).toFixed(1), "s"] }))] }));
}
function ThinkingBlock({ thinking, streaming, }) {
    const [expanded, setExpanded] = useState(false);
    return (_jsxs("div", { className: styles['thinking-block'], children: [_jsxs("button", { type: "button", className: styles['thinking-toggle'], onClick: () => setExpanded((previous) => !previous), "aria-expanded": expanded, children: [_jsx(Brain, { size: 12 }), _jsx("span", { children: streaming && !expanded ? "Thinking…" : "Thinking" }), _jsx(ChevronDown, { size: 12, className: `${styles['thinking-chevron']} ${expanded ? styles['thinking-chevron-open'] : ""}` })] }), expanded && (_jsx("div", { className: styles['thinking-content'], children: thinking }))] }));
}
function TypingIndicator() {
    return (_jsxs("span", { className: styles['typing-indicator'], "aria-label": "Assistant is typing", children: [_jsx("span", { className: styles['typing-dot'] }), _jsx("span", { className: styles['typing-dot'] }), _jsx("span", { className: styles['typing-dot'] })] }));
}
export default function AgentChatMessageListComponent({ messages, renderAvatar, emptyState, showThinking = true, showToolCalls = true, className, }) {
    const scrollContainerRef = useRef(null);
    const shouldAutoScroll = useRef(true);
    const scrollToBottom = useCallback((instant = false) => {
        const element = scrollContainerRef.current;
        if (!element)
            return;
        element.scrollTo({
            top: element.scrollHeight,
            behavior: instant ? "instant" : "smooth",
        });
    }, []);
    // Track whether the user has scrolled away from the bottom
    useEffect(() => {
        const element = scrollContainerRef.current;
        if (!element)
            return;
        const handleScroll = () => {
            const { scrollTop, scrollHeight, clientHeight } = element;
            shouldAutoScroll.current = scrollHeight - scrollTop - clientHeight < 80;
        };
        element.addEventListener("scroll", handleScroll, { passive: true });
        return () => element.removeEventListener("scroll", handleScroll);
    }, []);
    // Follow new content while pinned to the bottom
    useEffect(() => {
        if (shouldAutoScroll.current && messages.length > 0) {
            scrollToBottom(messages.length <= 1);
        }
    }, [messages, scrollToBottom]);
    return (_jsxs("div", { ref: scrollContainerRef, className: `agent-chat-message-list-component ${styles['message-list']} ${className || ""}`, children: [messages.length === 0 && emptyState, messages.map((message) => {
                if (message.role === AGENT_CHAT_ROLES.SYSTEM)
                    return null;
                const isUser = message.role === AGENT_CHAT_ROLES.USER;
                const avatar = renderAvatar?.(message.role);
                const isPending = message.streaming &&
                    !message.content &&
                    !message.thinking &&
                    !(message.toolCalls && message.toolCalls.length > 0);
                const { body, token } = message.streaming
                    ? splitStreamingTail(message.content)
                    : { body: message.content, token: "" };
                return (_jsxs("div", { className: `${styles['message-row']} ${isUser ? styles['message-row-user'] : styles['message-row-assistant']}`, children: [avatar != null && (_jsx("div", { className: styles['message-avatar'], children: avatar })), _jsxs("div", { className: `${styles['message-bubble']} ${isUser ? styles['bubble-user'] : styles['bubble-assistant']} ${message.error ? styles['bubble-error'] : ""}`, children: [!isUser && showThinking && message.thinking && (_jsx(ThinkingBlock, { thinking: message.thinking, streaming: message.streaming })), !isUser &&
                                    showToolCalls &&
                                    message.toolCalls &&
                                    message.toolCalls.length > 0 && (_jsx("div", { className: styles['tool-pill-row'], children: message.toolCalls.map((toolCall) => (_jsx(ToolCallPill, { toolCall: toolCall }, toolCall.id))) })), isUser ? (_jsx("p", { className: styles['user-text'], children: message.content })) : isPending ? (_jsx(TypingIndicator, {})) : (_jsx(MarkdownContentComponent, { content: body, children: _jsx(StreamingCursorComponent, { active: message.streaming, token: token }) })), message.images && message.images.length > 0 && (_jsx("div", { className: styles['image-row'], children: message.images.map((imageUrl, imageIndex) => (_jsx("img", { src: imageUrl, alt: "Generated", className: styles['message-image'] }, imageIndex))) }))] })] }, message.id));
            })] }));
}
//# sourceMappingURL=AgentChatMessageListComponent.js.map