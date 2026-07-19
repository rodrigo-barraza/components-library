/**
 * Message author roles, matching prism-service's OpenAI-style
 * message format.
 */
export declare const AGENT_CHAT_ROLES: {
    readonly USER: "user";
    readonly ASSISTANT: "assistant";
    readonly SYSTEM: "system";
};
export type AgentChatRole = (typeof AGENT_CHAT_ROLES)[keyof typeof AGENT_CHAT_ROLES];
/**
 * Lifecycle states of a tool call surfaced during streaming.
 */
export declare const AGENT_TOOL_CALL_STATUS: {
    readonly RUNNING: "running";
    readonly COMPLETE: "complete";
    readonly ERROR: "error";
};
export type AgentToolCallStatus = (typeof AGENT_TOOL_CALL_STATUS)[keyof typeof AGENT_TOOL_CALL_STATUS];
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
export declare const AGENT_CHAT_DEFAULTS: {
    readonly USERNAME: "visitor";
    readonly ENDPOINT: "/agent";
    readonly MAX_MESSAGE_LENGTH: 4000;
    readonly HISTORY_WINDOW: 20;
    readonly PERSISTED_MESSAGE_CAP: 200;
};
//# sourceMappingURL=agentChat.d.ts.map