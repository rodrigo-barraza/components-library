"use client";

// ─────────────────────────────────────────────────────────────
// AgentChatWindowComponent — Batteries-included agent chat
// window: message list + input wired to prism-service streaming
// via useAgentChat. This is the embeddable "chat mode" surface
// for any client; compose useAgentChat + the subcomponents
// directly if you need a custom layout.
//
// @example
//   <AgentChatWindowComponent
//     serviceUrl="https://prism.example.com"
//     project="my-project"
//     provider="google"
//     model="gemini-2.5-flash"
//     systemPrompt="You are a helpful assistant."
//     greeting="Hi! How can I help?"
//     persistKey="my-project:chat"
//   />
// ─────────────────────────────────────────────────────────────

import { type ReactNode } from "react";
import useAgentChat, {
  type UseAgentChatOptions,
} from "../../hooks/useAgentChat.js";
import AgentChatMessageListComponent from "../AgentChatMessageListComponent/AgentChatMessageListComponent.js";
import AgentChatInputComponent from "../AgentChatInputComponent/AgentChatInputComponent.js";
import { type AgentChatRole } from "../../constants/agentChat.js";
import styles from "./AgentChatWindowComponent.module.css";

export interface AgentChatWindowComponentProps extends UseAgentChatOptions {
  /** Rendered above the message list (title bar, status, …). */
  header?: ReactNode;
  /** Rendered below the input (disclaimers, hints, …). */
  footer?: ReactNode;
  /** Shown inside the list while there are no messages. */
  emptyState?: ReactNode;
  renderAvatar?: (role: AgentChatRole) => ReactNode;
  /** Role label above user messages. Default "User". */
  userLabel?: string;
  /** Role label above assistant messages. Default "Assistant". */
  assistantLabel?: string;
  inputPlaceholder?: string;
  showThinking?: boolean;
  showToolCalls?: boolean;
  autoFocus?: boolean;
  className?: string;
}

export default function AgentChatWindowComponent({
  header,
  footer,
  emptyState,
  renderAvatar,
  userLabel,
  assistantLabel,
  inputPlaceholder,
  showThinking,
  showToolCalls,
  autoFocus,
  className,
  ...chatOptions
}: AgentChatWindowComponentProps) {
  const { messages, isStreaming, send, stop } = useAgentChat(chatOptions);

  return (
    <div className={`agent-chat-window-component ${styles['window']} ${className || ""}`}>
      {header}
      <AgentChatMessageListComponent
        messages={messages}
        renderAvatar={renderAvatar}
        userLabel={userLabel}
        assistantLabel={assistantLabel}
        emptyState={emptyState}
        showThinking={showThinking}
        showToolCalls={showToolCalls}
      />
      <div className={styles['input-area']}>
        <AgentChatInputComponent
          onSend={send}
          onStop={stop}
          isStreaming={isStreaming}
          placeholder={inputPlaceholder}
          autoFocus={autoFocus}
        />
        {footer}
      </div>
    </div>
  );
}
