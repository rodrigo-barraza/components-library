/**
 * Widget lifecycle states.
 */
export declare const CHAT_STATES: {
    readonly IDLE: "idle";
    readonly OPEN: "open";
    readonly MINIMIZED: "minimized";
    readonly CONNECTING: "connecting";
    readonly ERROR: "error";
};
export type ChatState = (typeof CHAT_STATES)[keyof typeof CHAT_STATES];
/**
 * Internal event types for widget state changes.
 */
export declare const CHAT_EVENTS: {
    readonly MESSAGE_RECEIVED: "message:received";
    readonly MESSAGE_SENT: "message:sent";
    readonly CONNECTION_OPEN: "connection:open";
    readonly CONNECTION_CLOSED: "connection:closed";
    readonly AGENT_TYPING: "agent:typing";
    readonly WIDGET_OPENED: "widget:opened";
    readonly WIDGET_CLOSED: "widget:closed";
};
export type ChatEvent = (typeof CHAT_EVENTS)[keyof typeof CHAT_EVENTS];
/**
 * Default configuration values.
 */
export declare const CHAT_DEFAULTS: {
    readonly POSITION: "bottom-right";
    readonly THEME: "dark";
    readonly GREETING: "Hey! 👋 How can we help you today?";
    readonly OPERATOR_NAME: "Support";
    readonly ACCENT_COLOR: "#6366f1";
    readonly MAX_MESSAGE_LENGTH: 2000;
    readonly PANEL_WIDTH: 400;
    readonly PANEL_MAX_HEIGHT: 600;
    readonly MOBILE_BREAKPOINT: 480;
    readonly STORAGE_KEY_CONVERSATION: "chat_conversation_id";
    readonly STORAGE_KEY_VISITOR: "chat_visitor_id";
    readonly STORAGE_KEY_MESSAGES: "chat_messages";
};
/**
 * Message author roles.
 */
export declare const MESSAGE_ROLES: {
    readonly VISITOR: "visitor";
    readonly OPERATOR: "operator";
    readonly AGENT: "agent";
    readonly SYSTEM: "system";
};
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
//# sourceMappingURL=chat.d.ts.map