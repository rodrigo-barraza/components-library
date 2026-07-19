"use client";

// ─────────────────────────────────────────────────────────────
// AgentChatMessageListComponent — Lean "chat mode" message list
// for the agent chat window, styled after prism-client's /chat:
// left-aligned avatar rows with role labels, full-width markdown
// content (no bubbles), thinking/tool summary pills, and the
// scramble streaming cursor.
// ─────────────────────────────────────────────────────────────

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { AlertCircle, Bot, Check, ChevronDown, Loader2, User } from "lucide-react";
import MarkdownContentComponent from "../MarkdownContentComponent/MarkdownContentComponent.js";
import StreamingCursorComponent from "../StreamingCursorComponent/StreamingCursorComponent.js";
import { splitStreamingTail } from "../../utils/streamingText.js";
import {
  AGENT_CHAT_ROLES,
  AGENT_TOOL_CALL_STATUS,
  type AgentChatMessage,
  type AgentChatRole,
  type AgentToolCallSummary,
} from "../../constants/agentChat.js";
import styles from "./AgentChatMessageListComponent.module.css";

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

function ToolCallPill({ toolCall }: { toolCall: AgentToolCallSummary }) {
  const isRunning = toolCall.status === AGENT_TOOL_CALL_STATUS.RUNNING;
  const isError = toolCall.status === AGENT_TOOL_CALL_STATUS.ERROR;
  const label = toolCall.label || toolCall.name;
  return (
    <span
      className={`${styles['tool-pill']} ${isRunning ? styles['pill-active'] : ""} ${isError ? styles['tool-pill-error'] : ""}`}
      title={toolCall.name}
    >
      {isRunning ? (
        <Loader2 size={12} className={styles['tool-pill-spinner']} />
      ) : isError ? (
        <AlertCircle size={12} />
      ) : toolCall.emoji ? (
        <span className={styles['pill-emoji']}>{toolCall.emoji}</span>
      ) : (
        <Check size={12} />
      )}
      <span className={styles['pill-label']}>{label}</span>
      {typeof toolCall.durationMs === "number" && !isRunning && (
        <span className={styles['tool-pill-duration']}>
          {(toolCall.durationMs / 1000).toFixed(1)}s
        </span>
      )}
    </span>
  );
}

function ThinkingPill({
  thinking,
  streaming,
}: {
  thinking: string;
  streaming?: boolean;
}) {
  const [expanded, setExpanded] = useState(false);
  return (
    <div className={styles['thinking-block']}>
      <button
        type="button"
        className={`${styles['thinking-pill']} ${streaming ? styles['pill-active'] : ""}`}
        onClick={() => setExpanded((previous) => !previous)}
        aria-expanded={expanded}
      >
        <span className={styles['pill-emoji']}>🧠</span>
        <span className={styles['pill-label']}>
          {streaming ? "Thinking…" : "Thought"}
        </span>
        <ChevronDown
          size={13}
          className={`${styles['thinking-chevron']} ${expanded ? styles['thinking-chevron-open'] : ""}`}
        />
      </button>
      {expanded && (
        <div className={styles['thinking-content']}>{thinking}</div>
      )}
    </div>
  );
}

export default function AgentChatMessageListComponent({
  messages,
  renderAvatar,
  userLabel = "User",
  assistantLabel = "Assistant",
  emptyState,
  showThinking = true,
  showToolCalls = true,
  className,
}: AgentChatMessageListComponentProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const shouldAutoScroll = useRef(true);

  const scrollToBottom = useCallback((instant = false) => {
    const element = scrollContainerRef.current;
    if (!element) return;
    element.scrollTo({
      top: element.scrollHeight,
      behavior: instant ? "instant" : "smooth",
    });
  }, []);

  // Track whether the user has scrolled away from the bottom
  useEffect(() => {
    const element = scrollContainerRef.current;
    if (!element) return;
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

  const formatTime = (iso?: string) => {
    if (!iso) return null;
    const date = new Date(iso);
    if (Number.isNaN(date.getTime())) return null;
    return date.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
  };

  return (
    <div
      ref={scrollContainerRef}
      className={`agent-chat-message-list-component ${styles['message-list']} ${className || ""}`}
    >
      {messages.length === 0 && emptyState}
      {messages.map((message) => {
        if (message.role === AGENT_CHAT_ROLES.SYSTEM) return null;
        const isUser = message.role === AGENT_CHAT_ROLES.USER;
        const avatar = renderAvatar ? (
          renderAvatar(message.role)
        ) : isUser ? (
          <User size={16} />
        ) : (
          <Bot size={16} />
        );
        const isPending =
          message.streaming &&
          !message.content &&
          !message.thinking &&
          !(message.toolCalls && message.toolCalls.length > 0);
        const { body, token } = message.streaming
          ? splitStreamingTail(message.content)
          : { body: message.content, token: "" };
        const timestamp = formatTime(message.createdAt);

        return (
          <div
            key={message.id}
            className={`${styles['message-row']} ${isUser ? styles['user-node'] : styles['assistant-node']}`}
          >
            {avatar != null && <div className={styles['avatar']}>{avatar}</div>}
            <div className={styles['content']}>
              <div className={styles['message-header']}>
                <span className={styles['role-label']}>
                  {isUser ? userLabel : assistantLabel}
                  {timestamp && (
                    <span className={styles['message-timestamp']}>
                      {timestamp}
                    </span>
                  )}
                </span>
              </div>
              {!isUser && showThinking && message.thinking && (
                <ThinkingPill
                  thinking={message.thinking}
                  streaming={message.streaming}
                />
              )}
              {!isUser &&
                showToolCalls &&
                message.toolCalls &&
                message.toolCalls.length > 0 && (
                  <div className={styles['tool-pill-row']}>
                    {message.toolCalls.map((toolCall) => (
                      <ToolCallPill key={toolCall.id} toolCall={toolCall} />
                    ))}
                  </div>
                )}
              {isUser ? (
                <p className={styles['user-text']}>{message.content}</p>
              ) : isPending ? (
                <StreamingCursorComponent active standalone />
              ) : (
                <div
                  className={`${styles['message-body']} ${message.error ? styles['message-body-error'] : ""}`}
                >
                  <MarkdownContentComponent content={body}>
                    <StreamingCursorComponent
                      active={message.streaming}
                      token={token}
                    />
                  </MarkdownContentComponent>
                </div>
              )}
              {message.images && message.images.length > 0 && (
                <div className={styles['image-row']}>
                  {message.images.map((imageUrl, imageIndex) => (
                    <img
                      key={imageIndex}
                      src={imageUrl}
                      alt="Generated"
                      className={styles['message-image']}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
