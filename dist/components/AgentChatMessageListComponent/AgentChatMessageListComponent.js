"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
// ─────────────────────────────────────────────────────────────
// AgentChatMessageListComponent — Lean "chat mode" message list
// for the agent chat window, styled after prism-client's /chat:
// left-aligned avatar rows with role labels, full-width markdown
// content (no bubbles), thinking/tool summary pills, and the
// scramble streaming cursor.
// ─────────────────────────────────────────────────────────────
import { useCallback, useEffect, useRef, useState, } from "react";
import { AlertCircle, Bot, Check, ChevronDown, Loader2, User } from "lucide-react";
import MarkdownContentComponent from "../MarkdownContentComponent/MarkdownContentComponent.js";
import StreamingCursorComponent from "../StreamingCursorComponent/StreamingCursorComponent.js";
import { splitStreamingTail } from "../../utils/streamingText.js";
import { AGENT_CHAT_ROLES, AGENT_TOOL_CALL_STATUS, } from "../../constants/agentChat.js";
import styles from "./AgentChatMessageListComponent.module.css";
function ToolCallPill({ toolCall }) {
    const isRunning = toolCall.status === AGENT_TOOL_CALL_STATUS.RUNNING;
    const isError = toolCall.status === AGENT_TOOL_CALL_STATUS.ERROR;
    const label = toolCall.label || toolCall.name;
    return (_jsxs("span", { className: `${styles['tool-pill']} ${isRunning ? styles['pill-active'] : ""} ${isError ? styles['tool-pill-error'] : ""}`, title: toolCall.name, children: [isRunning ? (_jsx(Loader2, { size: 12, className: styles['tool-pill-spinner'] })) : isError ? (_jsx(AlertCircle, { size: 12 })) : toolCall.emoji ? (_jsx("span", { className: styles['pill-emoji'], children: toolCall.emoji })) : (_jsx(Check, { size: 12 })), _jsx("span", { className: styles['pill-label'], children: label }), typeof toolCall.durationMs === "number" && !isRunning && (_jsxs("span", { className: styles['tool-pill-duration'], children: [(toolCall.durationMs / 1000).toFixed(1), "s"] }))] }));
}
function ThinkingPill({ thinking, streaming, }) {
    const [expanded, setExpanded] = useState(false);
    return (_jsxs("div", { className: styles['thinking-block'], children: [_jsxs("button", { type: "button", className: `${styles['thinking-pill']} ${streaming ? styles['pill-active'] : ""}`, onClick: () => setExpanded((previous) => !previous), "aria-expanded": expanded, children: [_jsx("span", { className: styles['pill-emoji'], children: "\uD83E\uDDE0" }), _jsx("span", { className: styles['pill-label'], children: streaming ? "Thinking…" : "Thought" }), _jsx(ChevronDown, { size: 13, className: `${styles['thinking-chevron']} ${expanded ? styles['thinking-chevron-open'] : ""}` })] }), expanded && (_jsx("div", { className: styles['thinking-content'], children: thinking }))] }));
}
export default function AgentChatMessageListComponent({ messages, renderAvatar, userLabel = "User", assistantLabel = "Assistant", emptyState, showThinking = true, showToolCalls = true, className, }) {
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
    const formatTime = (iso) => {
        if (!iso)
            return null;
        const date = new Date(iso);
        if (Number.isNaN(date.getTime()))
            return null;
        return date.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
    };
    return (_jsxs("div", { ref: scrollContainerRef, className: `agent-chat-message-list-component ${styles['message-list']} ${className || ""}`, children: [messages.length === 0 && emptyState, messages.map((message) => {
                if (message.role === AGENT_CHAT_ROLES.SYSTEM)
                    return null;
                const isUser = message.role === AGENT_CHAT_ROLES.USER;
                const avatar = renderAvatar ? (renderAvatar(message.role)) : isUser ? (_jsx(User, { size: 16 })) : (_jsx(Bot, { size: 16 }));
                const isPending = message.streaming &&
                    !message.content &&
                    !message.thinking &&
                    !(message.toolCalls && message.toolCalls.length > 0);
                const { body, token } = message.streaming
                    ? splitStreamingTail(message.content)
                    : { body: message.content, token: "" };
                const timestamp = formatTime(message.createdAt);
                return (_jsxs("div", { className: `${styles['message-row']} ${isUser ? styles['user-node'] : styles['assistant-node']}`, children: [avatar != null && _jsx("div", { className: styles['avatar'], children: avatar }), _jsxs("div", { className: styles['content'], children: [_jsx("div", { className: styles['message-header'], children: _jsxs("span", { className: styles['role-label'], children: [isUser ? userLabel : assistantLabel, timestamp && (_jsx("span", { className: styles['message-timestamp'], children: timestamp }))] }) }), !isUser && showThinking && message.thinking && (_jsx(ThinkingPill, { thinking: message.thinking, streaming: message.streaming })), !isUser &&
                                    showToolCalls &&
                                    message.toolCalls &&
                                    message.toolCalls.length > 0 && (_jsx("div", { className: styles['tool-pill-row'], children: message.toolCalls.map((toolCall) => (_jsx(ToolCallPill, { toolCall: toolCall }, toolCall.id))) })), isUser ? (_jsx("p", { className: styles['user-text'], children: message.content })) : isPending ? (_jsx(StreamingCursorComponent, { active: true, standalone: true })) : (_jsx("div", { className: `${styles['message-body']} ${message.error ? styles['message-body-error'] : ""}`, children: _jsx(MarkdownContentComponent, { content: body, children: _jsx(StreamingCursorComponent, { active: message.streaming, token: token }) }) })), message.images && message.images.length > 0 && (_jsx("div", { className: styles['image-row'], children: message.images.map((imageUrl, imageIndex) => (_jsx("img", { src: imageUrl, alt: "Generated", className: styles['message-image'] }, imageIndex))) }))] })] }, message.id));
            })] }));
}
//# sourceMappingURL=AgentChatMessageListComponent.js.map