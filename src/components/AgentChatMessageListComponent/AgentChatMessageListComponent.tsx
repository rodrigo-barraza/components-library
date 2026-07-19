"use client";

// ─────────────────────────────────────────────────────────────
// AgentChatMessageListComponent — Lean "chat mode" message list
// for the agent chat window: markdown assistant bubbles, plain
// user bubbles, collapsible thinking, tool-call summary pills,
// inline images, and a streaming cursor.
// ─────────────────────────────────────────────────────────────

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { AlertCircle, Brain, Check, ChevronDown, Loader2 } from "lucide-react";
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

function ToolCallPill({ toolCall }: { toolCall: AgentToolCallSummary }) {
  const isRunning = toolCall.status === AGENT_TOOL_CALL_STATUS.RUNNING;
  const isError = toolCall.status === AGENT_TOOL_CALL_STATUS.ERROR;
  const label = toolCall.label || toolCall.name;
  return (
    <span
      className={`${styles['tool-pill']} ${isRunning ? styles['tool-pill-running'] : ""} ${isError ? styles['tool-pill-error'] : ""}`}
      title={toolCall.name}
    >
      {isRunning ? (
        <Loader2 size={11} className={styles['tool-pill-spinner']} />
      ) : isError ? (
        <AlertCircle size={11} />
      ) : toolCall.emoji ? (
        <span className={styles['tool-pill-emoji']}>{toolCall.emoji}</span>
      ) : (
        <Check size={11} />
      )}
      <span className={styles['tool-pill-label']}>{label}</span>
      {typeof toolCall.durationMs === "number" && !isRunning && (
        <span className={styles['tool-pill-duration']}>
          {(toolCall.durationMs / 1000).toFixed(1)}s
        </span>
      )}
    </span>
  );
}

function ThinkingBlock({
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
        className={styles['thinking-toggle']}
        onClick={() => setExpanded((previous) => !previous)}
        aria-expanded={expanded}
      >
        <Brain size={12} />
        <span>{streaming && !expanded ? "Thinking…" : "Thinking"}</span>
        <ChevronDown
          size={12}
          className={`${styles['thinking-chevron']} ${expanded ? styles['thinking-chevron-open'] : ""}`}
        />
      </button>
      {expanded && (
        <div className={styles['thinking-content']}>{thinking}</div>
      )}
    </div>
  );
}

function TypingIndicator() {
  return (
    <span className={styles['typing-indicator']} aria-label="Assistant is typing">
      <span className={styles['typing-dot']} />
      <span className={styles['typing-dot']} />
      <span className={styles['typing-dot']} />
    </span>
  );
}

export default function AgentChatMessageListComponent({
  messages,
  renderAvatar,
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

  return (
    <div
      ref={scrollContainerRef}
      className={`agent-chat-message-list-component ${styles['message-list']} ${className || ""}`}
    >
      {messages.length === 0 && emptyState}
      {messages.map((message) => {
        if (message.role === AGENT_CHAT_ROLES.SYSTEM) return null;
        const isUser = message.role === AGENT_CHAT_ROLES.USER;
        const avatar = renderAvatar?.(message.role);
        const isPending =
          message.streaming &&
          !message.content &&
          !message.thinking &&
          !(message.toolCalls && message.toolCalls.length > 0);
        const { body, token } = message.streaming
          ? splitStreamingTail(message.content)
          : { body: message.content, token: "" };

        return (
          <div
            key={message.id}
            className={`${styles['message-row']} ${isUser ? styles['message-row-user'] : styles['message-row-assistant']}`}
          >
            {avatar != null && (
              <div className={styles['message-avatar']}>{avatar}</div>
            )}
            <div
              className={`${styles['message-bubble']} ${isUser ? styles['bubble-user'] : styles['bubble-assistant']} ${message.error ? styles['bubble-error'] : ""}`}
            >
              {!isUser && showThinking && message.thinking && (
                <ThinkingBlock
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
                <TypingIndicator />
              ) : (
                <MarkdownContentComponent content={body}>
                  <StreamingCursorComponent
                    active={message.streaming}
                    token={token}
                  />
                </MarkdownContentComponent>
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
