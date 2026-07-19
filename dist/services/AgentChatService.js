// ─────────────────────────────────────────────────────────────
// AgentChatService — SSE streaming client for prism-service's
// /agent and /chat endpoints, plus optional localStorage message
// persistence. This is the transport layer behind the
// AgentChatWindowComponent / useAgentChat hook.
//
// Prism streams `data: {...}\n\n` SSE frames over a fetch body
// (not EventSource). Event types come from the shared taxonomy
// (SERVER_SENT_EVENT_TYPES); identity is carried via the
// x-project / x-username headers (IDENTITY_HEADERS).
// ─────────────────────────────────────────────────────────────
import { IDENTITY_HEADERS, SERVER_SENT_EVENT_TYPES, } from "@rodrigo-barraza/utilities-library/taxonomy";
import { AGENT_CHAT_DEFAULTS, AGENT_CHAT_ROLES, AGENT_TOOL_CALL_STATUS, } from "../constants/agentChat.js";
export default class AgentChatService {
    config;
    constructor(config) {
        this.config = config;
    }
    get headers() {
        return {
            "Content-Type": "application/json",
            [IDENTITY_HEADERS.project]: this.config.project,
            [IDENTITY_HEADERS.username]: this.config.username || AGENT_CHAT_DEFAULTS.USERNAME,
        };
    }
    /** Check whether prism-service is reachable. */
    async checkHealth() {
        try {
            const response = await fetch(`${this.config.serviceUrl}/health`);
            return response.ok;
        }
        catch {
            return false;
        }
    }
    /**
     * Build the OpenAI-format message array for a request: optional
     * system prompt, a trailing window of history, then the new user
     * message.
     */
    buildRequestMessages(history, userText) {
        const requestMessages = [];
        if (this.config.systemPrompt) {
            requestMessages.push({
                role: AGENT_CHAT_ROLES.SYSTEM,
                content: this.config.systemPrompt,
            });
        }
        const windowSize = this.config.historyWindow ?? AGENT_CHAT_DEFAULTS.HISTORY_WINDOW;
        for (const message of history.slice(-windowSize)) {
            if (!message.content || message.role === AGENT_CHAT_ROLES.SYSTEM)
                continue;
            if (message.error)
                continue;
            requestMessages.push({ role: message.role, content: message.content });
        }
        requestMessages.push({ role: AGENT_CHAT_ROLES.USER, content: userText });
        return requestMessages;
    }
    /**
     * Stream one exchange. Returns an abort function.
     */
    streamMessage(history, userText, callbacks) {
        const controller = new AbortController();
        const endpoint = this.config.endpoint || AGENT_CHAT_DEFAULTS.ENDPOINT;
        const url = `${this.config.serviceUrl}${endpoint}`;
        const body = {
            messages: this.buildRequestMessages(history, userText),
            stream: true,
            functionCallingEnabled: this.config.functionCallingEnabled ?? false,
            agenticLoopEnabled: this.config.agenticLoopEnabled ?? false,
            autoApprove: this.config.autoApprove ?? true,
            skipConversation: this.config.skipConversation ?? true,
            ...(this.config.provider && { provider: this.config.provider }),
            ...(this.config.model && { model: this.config.model }),
            ...(this.config.agent && { agent: this.config.agent }),
            ...this.config.extraBody,
        };
        const run = async () => {
            const response = await fetch(url, {
                method: "POST",
                headers: this.headers,
                body: JSON.stringify(body),
                signal: controller.signal,
            });
            if (!response.ok || !response.body) {
                const errorBody = await response.text().catch(() => "");
                throw new Error(`Agent stream failed: ${response.status} — ${errorBody}`);
            }
            const reader = response.body.getReader();
            const decoder = new TextDecoder();
            let buffer = "";
            let fullContent = "";
            let fullThinking = "";
            let doneEmitted = false;
            const emitDone = (info) => {
                if (doneEmitted)
                    return;
                doneEmitted = true;
                callbacks.onDone?.(info, fullContent);
            };
            while (true) {
                const { done, value } = await reader.read();
                if (done)
                    break;
                buffer += decoder.decode(value, { stream: true });
                const lines = buffer.split("\n");
                buffer = lines.pop() || "";
                for (const line of lines) {
                    if (!line.startsWith("data: "))
                        continue;
                    const payload = line.slice(6);
                    if (payload === "[DONE]") {
                        emitDone({});
                        return;
                    }
                    let event;
                    try {
                        event = JSON.parse(payload);
                    }
                    catch {
                        continue; // Non-JSON SSE line — skip
                    }
                    switch (event.type) {
                        case SERVER_SENT_EVENT_TYPES.CHUNK:
                        case SERVER_SENT_EVENT_TYPES.TEXT: {
                            const token = event.content || "";
                            if (!token)
                                break;
                            fullContent += token;
                            callbacks.onChunk?.(token, fullContent);
                            break;
                        }
                        case SERVER_SENT_EVENT_TYPES.THINKING: {
                            const token = event.content || "";
                            if (!token)
                                break;
                            fullThinking += token;
                            callbacks.onThinking?.(token, fullThinking);
                            break;
                        }
                        case SERVER_SENT_EVENT_TYPES.TOOL_CALL: {
                            callbacks.onToolEvent?.({
                                id: event.id || event.name || "tool-call",
                                name: event.name || "",
                                status: event.status === "error"
                                    ? AGENT_TOOL_CALL_STATUS.ERROR
                                    : AGENT_TOOL_CALL_STATUS.COMPLETE,
                            });
                            break;
                        }
                        case SERVER_SENT_EVENT_TYPES.TOOL_EXECUTION: {
                            callbacks.onToolEvent?.({
                                id: event.tool?.id || event.tool?.name || "tool",
                                name: event.tool?.name || "",
                                label: event.toolLabel,
                                emoji: event.toolEmoji,
                                status: AGENT_TOOL_CALL_STATUS.RUNNING,
                            });
                            break;
                        }
                        case SERVER_SENT_EVENT_TYPES.TOOL_OUTPUT: {
                            callbacks.onToolEvent?.({
                                id: event.tool?.id || event.tool?.name || "tool",
                                name: event.tool?.name || "",
                                label: event.toolLabel,
                                emoji: event.toolEmoji,
                                status: AGENT_TOOL_CALL_STATUS.COMPLETE,
                                durationMs: typeof event.durationMs === "number"
                                    ? event.durationMs
                                    : undefined,
                            });
                            break;
                        }
                        case SERVER_SENT_EVENT_TYPES.IMAGE: {
                            if (event.data && event.mimeType) {
                                callbacks.onImage?.(`data:${event.mimeType};base64,${event.data}`);
                            }
                            else if (event.minioRef && this.config.resolveFileUrl) {
                                callbacks.onImage?.(this.config.resolveFileUrl(event.minioRef));
                            }
                            break;
                        }
                        case SERVER_SENT_EVENT_TYPES.ERROR: {
                            throw new Error(event.message || event.content || "Agent error");
                        }
                        case SERVER_SENT_EVENT_TYPES.DONE: {
                            if (event.fullContent)
                                fullContent = event.fullContent;
                            emitDone({
                                conversationId: event.conversationId,
                                usage: event.usage,
                                estimatedCost: event.estimatedCost,
                                totalTime: event.totalTime,
                            });
                            return;
                        }
                        default:
                            // Sub-agent, status, usage, plan events etc. — not rendered
                            // by the lean chat window.
                            break;
                    }
                }
            }
            // Stream ended without an explicit done frame
            emitDone({});
        };
        run().catch((error) => {
            if (error instanceof Error && error.name === "AbortError")
                return;
            callbacks.onError?.(error instanceof Error ? error : new Error(String(error)));
        });
        return () => controller.abort();
    }
    // ── localStorage persistence ─────────────────────────────────
    getPersistedMessages() {
        const key = this.config.persistKey;
        if (!key || typeof window === "undefined")
            return [];
        try {
            const raw = window.localStorage.getItem(key);
            if (!raw)
                return [];
            const parsed = JSON.parse(raw);
            return Array.isArray(parsed) ? parsed : [];
        }
        catch {
            return [];
        }
    }
    persistMessages(messages) {
        const key = this.config.persistKey;
        if (!key || typeof window === "undefined")
            return;
        try {
            const trimmed = messages
                .slice(-AGENT_CHAT_DEFAULTS.PERSISTED_MESSAGE_CAP)
                .map(({ streaming: _streaming, ...message }) => message);
            window.localStorage.setItem(key, JSON.stringify(trimmed));
        }
        catch {
            // Storage full or unavailable — persistence is best-effort.
        }
    }
    clearPersistedMessages() {
        const key = this.config.persistKey;
        if (!key || typeof window === "undefined")
            return;
        try {
            window.localStorage.removeItem(key);
        }
        catch {
            // ignore
        }
    }
}
//# sourceMappingURL=AgentChatService.js.map