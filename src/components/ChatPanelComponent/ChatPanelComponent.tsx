// @ts-nocheck
"use client";

import { useRef, useEffect, useLayoutEffect, useCallback } from "react";
import ChatMessageComponent from "../ChatMessageComponent/ChatMessageComponent.tsx";
import ChatInputComponent from "../ChatInputComponent/ChatInputComponent.tsx";
import type { ChatMessage } from "../../constants/chat.ts";
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
    const el = scrollRef.current;
    if (!el) return;
    el.scrollTo({
      top: el.scrollHeight,
      behavior: instant ? "instant" : "smooth",
    });
  }, []);

  // Snap to bottom after DOM updates
  useLayoutEffect(() => {
    if (shouldSnap.current && messages.length > 0 && isOpen) {
      scrollToBottom(messages.length <= 1);
      // Catch late layout shifts from async content
      const t = setTimeout(() => scrollToBottom(true), 150);
      return () => clearTimeout(t);
    }
  }, [messages, isOpen, scrollToBottom]);

  // Track scroll position — only auto-scroll if user is near bottom
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = el;
      shouldSnap.current = scrollHeight - scrollTop - clientHeight < 80;
    };

    el.addEventListener("scroll", handleScroll, { passive: true });
    return () => el.removeEventListener("scroll", handleScroll);
  }, []);

  // Snap when panel opens
  useEffect(() => {
    if (isOpen) {
      shouldSnap.current = true;
      // Delay to let animation settle
      const t = setTimeout(() => scrollToBottom(true), 350);
      return () => clearTimeout(t);
    }
  }, [isOpen, scrollToBottom]);

  return (
    <div
      className={`${styles.panel} ${isOpen ? styles.panelOpen : styles.panelClosed}`}
      id="chat-panel"
    >
      {/* ── Header ─────────────────────────────────────────── */}
      <div className={styles.header}>
        <div className={styles.headerInfo}>
          {operatorAvatar ? (
            <img
              src={operatorAvatar}
              alt={operatorName}
              className={styles.headerAvatar}
              loading="lazy"
            />
          ) : (
            <div className={styles.headerAvatarFallback}>
              {(operatorName || "S")[0].toUpperCase()}
            </div>
          )}
          <div className={styles.headerText}>
            <span className={styles.headerName}>{operatorName}</span>
            <span className={styles.headerStatus}>
              <span className={styles.statusDot} />
              Online
            </span>
          </div>
        </div>
        <button
          className={styles.closeButton}
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
      <div className={styles.messagesArea} ref={scrollRef}>
        {messages.map((msg, i) => (
          <ChatMessageComponent
            key={msg.id}
            message={msg}
            isFirst={i === 0}
            previousRole={i > 0 ? messages[i - 1].role : null}
          />
        ))}

        {/* ── Typing Indicator ───────────────────────────── */}
        {isTyping && (
          <div className={styles.typingIndicator}>
            <div className={styles.typingDots}>
              <span className={styles.typingDot} />
              <span className={styles.typingDot} />
              <span className={styles.typingDot} />
            </div>
          </div>
        )}
      </div>

      {/* ── Input Bar ──────────────────────────────────────── */}
      <ChatInputComponent onSend={onSend} isTyping={isTyping} />

      {/* ── Footer ─────────────────────────────────────────── */}
      <div className={styles.footer}>
        <span className={styles.footerText}>
          Powered by <span className={styles.footerBrand}>Chat</span>
        </span>
      </div>
    </div>
  );
}
