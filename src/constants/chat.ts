// ─────────────────────────────────────────────────────────────
// Chat Constants — Widget states, events, defaults, message roles
// ─────────────────────────────────────────────────────────────

/**
 * Widget lifecycle states.
 */
export const CHAT_STATES = {
  IDLE: "idle",
  OPEN: "open",
  MINIMIZED: "minimized",
  CONNECTING: "connecting",
  ERROR: "error",
} as const;

export type ChatState = (typeof CHAT_STATES)[keyof typeof CHAT_STATES];

/**
 * Internal event types for widget state changes.
 */
export const CHAT_EVENTS = {
  MESSAGE_RECEIVED: "message:received",
  MESSAGE_SENT: "message:sent",
  CONNECTION_OPEN: "connection:open",
  CONNECTION_CLOSED: "connection:closed",
  AGENT_TYPING: "agent:typing",
  WIDGET_OPENED: "widget:opened",
  WIDGET_CLOSED: "widget:closed",
} as const;

export type ChatEvent = (typeof CHAT_EVENTS)[keyof typeof CHAT_EVENTS];

/**
 * Default configuration values.
 */
export const CHAT_DEFAULTS = {
  POSITION: "bottom-right",
  THEME: "dark",
  GREETING: "Hey! 👋 How can we help you today?",
  OPERATOR_NAME: "Support",
  ACCENT_COLOR: "#6366f1",
  MAX_MESSAGE_LENGTH: 2000,
  PANEL_WIDTH: 400,
  PANEL_MAX_HEIGHT: 600,
  MOBILE_BREAKPOINT: 480,
  STORAGE_KEY_CONVERSATION: "chat_conversation_id",
  STORAGE_KEY_VISITOR: "chat_visitor_id",
  STORAGE_KEY_MESSAGES: "chat_messages",
} as const;

/**
 * Message author roles.
 */
export const MESSAGE_ROLES = {
  VISITOR: "visitor",
  OPERATOR: "operator",
  AGENT: "agent",
  SYSTEM: "system",
} as const;

export type MessageRole = (typeof MESSAGE_ROLES)[keyof typeof MESSAGE_ROLES];

/**
 * A single chat message in the widget.
 */
export interface ChatMessage {
  id: string;
  role: MessageRole;
  content: string;
  createdAt?: string;
  streaming?: boolean;
  error?: boolean;
}

/**
 * Remote widget configuration from messages-service.
 */
export interface ChatWidgetConfig {
  position?: string;
  theme?: string;
  greeting?: string;
  operatorName?: string;
  operatorAvatar?: string;
  accentColor?: string;
  aiEnabled?: boolean;
  [key: string]: unknown;
}

/**
 * Callbacks for agent SSE streaming.
 */
export interface AgentStreamCallbacks {
  onToken: (token: string, fullContent: string) => void;
  onComplete: (finalContent: string) => void;
  onError: (error: Error) => void;
  onThinking?: (content: string) => void;
}
