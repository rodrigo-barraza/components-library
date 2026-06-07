"use client";

import { useRef, useEffect, useLayoutEffect, useCallback } from "react";
import ChatMessageComponent from "../ChatMessageComponent/ChatMessageComponent.js";
import ChatInputComponent from "../ChatInputComponent/ChatInputComponent.js";
import type { ChatMessage } from "../../constants/chat.js";
import styles from "./ChatPanelComponent.module.css";

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
export default function ChatPanelComponent({
  isOpen,
  messages,
  isTyping,
  operatorName,
  operatorAvatar,
  onClose,
  onSend,
}: ChatPanelComponentProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const shouldSnap = useRef(true);

  // ── Auto-scroll to bottom on new messages ──────────────────
  const scrollToBottom = useCallback((instant = false) => {
    const element = scrollRef.current;
    if (!element) return;
    element.scrollTo({
      top: element.scrollHeight,
      behavior: instant ? "instant" : "smooth",
    });
  }, []);

  // Snap to bottom after DOM updates
  useLayoutEffect(() => {
    if (shouldSnap.current && messages.length > 0 && isOpen) {
      scrollToBottom(messages.length <= 1);
      // Catch late layout shifts from async content
      const scrollTimer = setTimeout(() => scrollToBottom(true), 150);
      return () => clearTimeout(scrollTimer);
    }
  }, [messages, isOpen, scrollToBottom]);

  // Track scroll position — only auto-scroll if user is near bottom
  useEffect(() => {
    const element = scrollRef.current;
    if (!element) return;

    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = element;
      shouldSnap.current = scrollHeight - scrollTop - clientHeight < 80;
    };

    element.addEventListener("scroll", handleScroll, { passive: true });
    return () => element.removeEventListener("scroll", handleScroll);
  }, []);

  // Snap when panel opens
  useEffect(() => {
    if (isOpen) {
      shouldSnap.current = true;
      // Delay to let animation settle
      const scrollTimer = setTimeout(() => scrollToBottom(true), 350);
      return () => clearTimeout(scrollTimer);
    }
  }, [isOpen, scrollToBottom]);

  return (
    <div
      className={`chat-panel-component ${styles['panel']} ${isOpen ? styles['panel-open'] : styles['panel-closed']}`}
      id="chat-panel"
    >
      {/* ── Header ─────────────────────────────────────────── */}
      <div className={styles['header']}>
        <div className={styles['header-info']}>
          {operatorAvatar ? (
            <img
              src={operatorAvatar}
              alt={operatorName}
              className={styles['header-avatar']}
              loading="lazy"
            />
          ) : (
            <div className={styles['header-avatar-fallback']}>
              {(operatorName || "S")[0].toUpperCase()}
            </div>
          )}
          <div className={styles['header-text']}>
            <span className={styles['header-name']}>{operatorName}</span>
            <span className={styles['header-status']}>
              <span className={styles['status-dot']} />
              Online
            </span>
          </div>
        </div>
        <button
          className={styles['close-button']}
          onClick={onClose}
          aria-label="Close chat"
          id="chat-close-button"
        >
          <svg
            viewBox="0 0 24 24"
            width="18"
            height="18"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      </div>

      {/* ── Messages Area ──────────────────────────────────── */}
      <div className={styles['messages-area']} ref={scrollRef}>
        {messages.map((message, i) => (
          <ChatMessageComponent
            key={message.id}
            message={message}
            isFirst={i === 0}
            previousRole={i > 0 ? messages[i - 1].role : null}
          />
        ))}

        {/* ── Typing Indicator ───────────────────────────── */}
        {isTyping && (
          <div className={styles['typing-indicator']}>
            <div className={styles['typing-dots']}>
              <span className={styles['typing-dot']} />
              <span className={styles['typing-dot']} />
              <span className={styles['typing-dot']} />
            </div>
          </div>
        )}
      </div>

      {/* ── Input Bar ──────────────────────────────────────── */}
      <ChatInputComponent onSend={onSend} isTyping={isTyping} />

      {/* ── Footer ─────────────────────────────────────────── */}
      <div className={styles['footer']}>
        <span className={styles['footer-text']}>
          Powered by <span className={styles['footer-brand']}>Chat</span>
        </span>
      </div>
    </div>
  );
}
