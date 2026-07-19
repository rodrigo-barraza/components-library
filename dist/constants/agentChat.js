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
};
/**
 * Lifecycle states of a tool call surfaced during streaming.
 */
export const AGENT_TOOL_CALL_STATUS = {
    RUNNING: "running",
    COMPLETE: "complete",
    ERROR: "error",
};
export const AGENT_CHAT_DEFAULTS = {
    USERNAME: "visitor",
    ENDPOINT: "/agent",
    MAX_MESSAGE_LENGTH: 4000,
    HISTORY_WINDOW: 20,
    PERSISTED_MESSAGE_CAP: 200,
};
//# sourceMappingURL=agentChat.js.map