// @ts-nocheck
"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useCallback, useEffect, useRef } from "react";
import { adjustBrightness } from "@rodrigo-barraza/utilities-library";
import { useChat } from "../ChatProvider.js";
import ChatLauncherComponent from "../ChatLauncherComponent/ChatLauncherComponent.js";
import ChatPanelComponent from "../ChatPanelComponent/ChatPanelComponent.js";
import { MESSAGE_ROLES } from "../../constants/chat.js";
import styles from "./ChatComponent.module.css";
/**
 * ChatComponent — Main widget orchestrator.
 *
 * Renders the floating action button (launcher) and the chat panel.
 * Manages conversation state, message sending, and AI agent streaming.
 *
 * Must be used inside a `<ChatProvider>`.
 */
export default function ChatComponent({ className = "" }) {
    const { service, position, greeting, operatorName, operatorAvatar, accentColor, aiEnabled, } = useChat();
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([]);
    const [isTyping, setIsTyping] = useState(false);
    const [unreadCount, setUnreadCount] = useState(0);
    const streamingRef = useRef("");
    const abortRef = useRef(null);
    // ── Restore persisted messages on mount ────────────────────
    useEffect(() => {
        if (!service)
            return;
        const persisted = service.getPersistedMessages();
        if (persisted.length > 0) {
            setMessages(persisted);
        }
    }, [service]);
    // ── Persist messages on change ─────────────────────────────
    useEffect(() => {
        if (!service || messages.length === 0)
            return;
        service.persistMessages(messages);
    }, [service, messages]);
    // ── Clear unread when panel opens ──────────────────────────
    useEffect(() => {
        if (isOpen)
            setUnreadCount(0);
    }, [isOpen]);
    // ── Inject greeting as system message ──────────────────────
    useEffect(() => {
        if (messages.length === 0 && greeting) {
            setMessages([
                {
                    id: "greeting",
                    role: MESSAGE_ROLES.SYSTEM,
                    content: greeting,
                    createdAt: new Date().toISOString(),
                },
            ]);
        }
    }, [greeting, messages.length]);
    // ── Toggle panel ───────────────────────────────────────────
    const handleToggle = useCallback(() => {
        setIsOpen((prev) => !prev);
    }, []);
    const handleClose = useCallback(() => {
        setIsOpen(false);
    }, []);
    // ── Send message ───────────────────────────────────────────
    const handleSend = useCallback(async (content) => {
        if (!content.trim() || !service)
            return;
        const visitorMessage = {
            id: `msg_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
            role: MESSAGE_ROLES.VISITOR,
            content: content.trim(),
            createdAt: new Date().toISOString(),
        };
        setMessages((prev) => [...prev, visitorMessage]);
        if (aiEnabled) {
            // ── AI Agent mode — stream response ──────────────────
            setIsTyping(true);
            streamingRef.current = "";
            const agentMessageId = `msg_agent_${Date.now()}`;
            // Inject an empty agent message that we'll stream into
            setMessages((prev) => [
                ...prev,
                {
                    id: agentMessageId,
                    role: MESSAGE_ROLES.AGENT,
                    content: "",
                    streaming: true,
                    createdAt: new Date().toISOString(),
                },
            ]);
            const abort = service.sendAgentMessage(content.trim(), {
                onToken: (_token, fullContent) => {
                    streamingRef.current = fullContent;
                    setMessages((prev) => prev.map((m) => m.id === agentMessageId ? { ...m, content: fullContent } : m));
                },
                onComplete: (finalContent) => {
                    setIsTyping(false);
                    streamingRef.current = "";
                    setMessages((prev) => prev.map((m) => m.id === agentMessageId
                        ? { ...m, content: finalContent, streaming: false }
                        : m));
                    if (!isOpen)
                        setUnreadCount((c) => c + 1);
                },
                onError: (err) => {
                    setIsTyping(false);
                    console.error("[Chat] Agent error:", err.message);
                    setMessages((prev) => prev.map((m) => m.id === agentMessageId
                        ? {
                            ...m,
                            content: "Sorry, I'm having trouble responding right now. Please try again.",
                            streaming: false,
                            error: true,
                        }
                        : m));
                },
                onThinking: () => {
                    // Could display a "thinking" indicator — future enhancement
                },
            });
            abortRef.current = abort;
        }
        else {
            // ── Standard mode — send to service, operator responds ─
            try {
                await service.sendMessage(content.trim());
            }
            catch (error) {
                const message = error instanceof Error ? error.message : "Unknown error";
                console.error("[Chat] Send error:", message);
                setMessages((prev) => [
                    ...prev,
                    {
                        id: `msg_err_${Date.now()}`,
                        role: MESSAGE_ROLES.SYSTEM,
                        content: "Message failed to send. Please try again.",
                        createdAt: new Date().toISOString(),
                        error: true,
                    },
                ]);
            }
        }
    }, [service, aiEnabled, isOpen]);
    // ── Cleanup on unmount ─────────────────────────────────────
    useEffect(() => {
        return () => {
            if (abortRef.current)
                abortRef.current();
        };
    }, []);
    // ── CSS custom properties for theming ──────────────────────
    const style = {
        "--chat-accent": accentColor,
        "--chat-accent-hover": adjustBrightness(accentColor, -15),
        "--chat-accent-subtle": `${accentColor}1a`,
        "--chat-accent-glow": `0 0 24px ${accentColor}40`,
    };
    return (_jsxs("div", { className: `${styles.container} ${styles[position] || ""} ${className}`, style: style, id: "chat-widget", children: [_jsx(ChatPanelComponent, { isOpen: isOpen, messages: messages, isTyping: isTyping, operatorName: operatorName, operatorAvatar: operatorAvatar, onClose: handleClose, onSend: handleSend }), _jsx(ChatLauncherComponent, { isOpen: isOpen, unreadCount: unreadCount, onClick: handleToggle })] }));
}
//# sourceMappingURL=ChatComponent.js.map