"use client";

// ─────────────────────────────────────────────────────────────
// AgentChatInputComponent — Message input for the agent chat
// window: auto-expanding textarea, Enter to send / Shift+Enter
// for a newline, and a send button that becomes a stop button
// while a response is streaming.
// ─────────────────────────────────────────────────────────────

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type ChangeEvent,
  type KeyboardEvent,
} from "react";
import { SendHorizontal, Square } from "lucide-react";
import { AGENT_CHAT_DEFAULTS } from "../../constants/agentChat.js";
import styles from "./AgentChatInputComponent.module.css";

export interface AgentChatInputComponentProps {
  onSend: (content: string) => void;
  /** When provided, the send button becomes a stop button while streaming. */
  onStop?: () => void;
  isStreaming?: boolean;
  disabled?: boolean;
  placeholder?: string;
  maxLength?: number;
  autoFocus?: boolean;
  className?: string;
}

export default function AgentChatInputComponent({
  onSend,
  onStop,
  isStreaming = false,
  disabled = false,
  placeholder = "Type a message…",
  maxLength = AGENT_CHAT_DEFAULTS.MAX_MESSAGE_LENGTH,
  autoFocus = false,
  className,
}: AgentChatInputComponentProps) {
  const [value, setValue] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const autoResize = useCallback(() => {
    const element = textareaRef.current;
    if (!element) return;
    element.style.height = "auto";
    element.style.height = `${Math.min(element.scrollHeight, 144)}px`;
  }, []);

  useEffect(() => {
    autoResize();
  }, [value, autoResize]);

  const handleChange = useCallback(
    (event: ChangeEvent<HTMLTextAreaElement>) => {
      const text = event.target.value;
      if (text.length <= maxLength) {
        setValue(text);
      }
    },
    [maxLength],
  );

  const handleSubmit = useCallback(() => {
    const trimmed = value.trim();
    if (!trimmed || isStreaming || disabled) return;
    onSend(trimmed);
    setValue("");
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
  }, [value, isStreaming, disabled, onSend]);

  const handleKeyDown = useCallback(
    (event: KeyboardEvent<HTMLTextAreaElement>) => {
      if (event.key === "Enter" && !event.shiftKey) {
        event.preventDefault();
        handleSubmit();
      }
    },
    [handleSubmit],
  );

  const showStop = isStreaming && Boolean(onStop);
  const canSend = value.trim().length > 0 && !isStreaming && !disabled;
  const isNearLimit = value.length > maxLength * 0.9;

  return (
    <div className={`agent-chat-input-component ${styles['input-bar']} ${className || ""}`}>
      <div className={styles['input-container']}>
        <textarea
          ref={textareaRef}
          className={styles['textarea']}
          value={value}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          rows={1}
          disabled={disabled}
          maxLength={maxLength}
          autoFocus={autoFocus}
          aria-label="Message input"
        />
        {showStop ? (
          <button
            type="button"
            className={`${styles['action-button']} ${styles['stop-button']}`}
            onClick={onStop}
            aria-label="Stop generating"
          >
            <Square size={14} fill="currentColor" />
          </button>
        ) : (
          <button
            type="button"
            className={`${styles['action-button']} ${canSend ? styles['send-active'] : ""}`}
            onClick={handleSubmit}
            disabled={!canSend}
            aria-label="Send message"
          >
            <SendHorizontal size={16} />
          </button>
        )}
      </div>
      {isNearLimit && (
        <span
          className={`${styles['char-count']} ${value.length >= maxLength ? styles['char-count-over'] : ""}`}
        >
          {value.length}/{maxLength}
        </span>
      )}
    </div>
  );
}
