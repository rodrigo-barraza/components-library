// ─────────────────────────────────────────────────────────────
// Agent Chat Constants — Roles, message/tool-call shapes, and
// defaults for the prism-service-backed agent chat window.
// ─────────────────────────────────────────────────────────────

/**
 * Message author roles, matching prism-service's OpenAI-style
 * message format.
 */
export const AGENT_CHAT_ROLES = {
  USER: "user",
  ASSISTANT: "assistant",
  SYSTEM: "system",
} as const;

export type AgentChatRole =
  (typeof AGENT_CHAT_ROLES)[keyof typeof AGENT_CHAT_ROLES];

/**
 * Lifecycle states of a tool call surfaced during streaming.
 */
export const AGENT_TOOL_CALL_STATUS = {
  RUNNING: "running",
  COMPLETE: "complete",
  ERROR: "error",
} as const;

export type AgentToolCallStatus =
  (typeof AGENT_TOOL_CALL_STATUS)[keyof typeof AGENT_TOOL_CALL_STATUS];

/**
 * A compact summary of a tool call for "chat mode" rendering —
 * enough to draw a labelled pill, not the full result payload.
 * The server sends display-ready `label` and `emoji` alongside
 * tool events, so no client-side tool metadata is needed.
 */
export interface AgentToolCallSummary {
  id: string;
  name: string;
  label?: string;
  emoji?: string;
  status: AgentToolCallStatus;
  durationMs?: number;
}

/**
 * A single message in the agent chat window.
 */
export interface AgentChatMessage {
  id: string;
  role: AgentChatRole;
  content: string;
  /** Accumulated reasoning/thinking content, if the model emitted any. */
  thinking?: string;
  /** Tool calls surfaced while this message streamed. */
  toolCalls?: AgentToolCallSummary[];
  /** Inline image URLs (data: or resolved file URLs) attached to the message. */
  images?: string[];
  /** True while this message is still being streamed. */
  streaming?: boolean;
  /** True if the stream for this message failed. */
  error?: boolean;
  createdAt?: string;
}

/**
 * Metadata delivered with the stream's `done` event.
 */
export interface AgentChatDoneInfo {
  conversationId?: string;
  usage?: unknown;
  estimatedCost?: number;
  totalTime?: number;
}

export const AGENT_CHAT_DEFAULTS = {
  USERNAME: "visitor",
  ENDPOINT: "/agent",
  MAX_MESSAGE_LENGTH: 4000,
  HISTORY_WINDOW: 20,
  PERSISTED_MESSAGE_CAP: 200,
} as const;
