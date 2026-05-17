// ─────────────────────────────────────────────────────────────
// ChatService — HTTP + SSE client for messages-service
// ─────────────────────────────────────────────────────────────
// Handles widget config fetching, conversation lifecycle,
// message sending, AI agent SSE streaming, and localStorage
// persistence for returning visitors.
// ─────────────────────────────────────────────────────────────
import { CHAT_DEFAULTS, MESSAGE_ROLES, } from "../constants/chat.js";
import { generateUUID } from "@rodrigo-barraza/utilities-library";
/**
 * Safe localStorage wrapper — never throws in restricted contexts.
 */
const storage = {
    get(key) {
        try {
            return localStorage.getItem(key);
        }
        catch {
            return null;
        }
    },
    set(key, value) {
        try {
            localStorage.setItem(key, value);
        }
        catch {
            // Storage full or restricted — silently ignore
        }
    },
    remove(key) {
        try {
            localStorage.removeItem(key);
        }
        catch {
            // Silently ignore
        }
    },
};
class ChatService {
    serviceUrl;
    widgetId;
    conversationId;
    visitorId;
    config;
    _abortController;
    constructor({ serviceUrl, widgetId }) {
        this.serviceUrl = serviceUrl.replace(/\/$/, "");
        this.widgetId = widgetId;
        this.conversationId = null;
        this.visitorId = null;
        this.config = null;
        this._abortController = null;
        // Restore persisted visitor/conversation IDs
        this._restoreSession();
    }
    // ── Session Persistence ──────────────────────────────────────
    _restoreSession() {
        this.visitorId = storage.get(CHAT_DEFAULTS.STORAGE_KEY_VISITOR) || null;
        this.conversationId =
            storage.get(CHAT_DEFAULTS.STORAGE_KEY_CONVERSATION) || null;
    }
    _persistSession() {
        if (this.visitorId) {
            storage.set(CHAT_DEFAULTS.STORAGE_KEY_VISITOR, this.visitorId);
        }
        if (this.conversationId) {
            storage.set(CHAT_DEFAULTS.STORAGE_KEY_CONVERSATION, this.conversationId);
        }
    }
    /**
     * Get persisted messages from localStorage.
     */
    getPersistedMessages() {
        try {
            const raw = storage.get(CHAT_DEFAULTS.STORAGE_KEY_MESSAGES);
            return raw ? JSON.parse(raw) : [];
        }
        catch {
            return [];
        }
    }
    /**
     * Persist messages to localStorage.
     */
    persistMessages(messages) {
        try {
            // Keep only the last 100 messages to avoid storage bloat
            const trimmed = messages.slice(-100);
            storage.set(CHAT_DEFAULTS.STORAGE_KEY_MESSAGES, JSON.stringify(trimmed));
        }
        catch {
            // Silently ignore
        }
    }
    /**
     * Clear all persisted session data.
     */
    clearSession() {
        this.conversationId = null;
        this.visitorId = null;
        storage.remove(CHAT_DEFAULTS.STORAGE_KEY_CONVERSATION);
        storage.remove(CHAT_DEFAULTS.STORAGE_KEY_VISITOR);
        storage.remove(CHAT_DEFAULTS.STORAGE_KEY_MESSAGES);
    }
    // ── HTTP Helpers ─────────────────────────────────────────────
    async _fetch(path, options = {}) {
        const url = `${this.serviceUrl}${path}`;
        const headers = {
            "Content-Type": "application/json",
            ...(this.visitorId && { "x-visitor-id": this.visitorId }),
            ...options.headers,
        };
        const res = await fetch(url, {
            ...options,
            headers,
        });
        if (!res.ok) {
            // ── Auto-recover from stale conversation ────────────────
            if (res.status === 404 && path.includes("/conversations/") && this.conversationId) {
                this.clearSession();
                await this.createConversation();
                // Rebuild the path with the new conversationId
                const newPath = path.replace(/\/conversations\/[^/]+/, `/conversations/${this.conversationId}`);
                const newUrl = `${this.serviceUrl}${newPath}`;
                const retryRes = await fetch(newUrl, { ...options, headers });
                if (!retryRes.ok) {
                    const body = await retryRes.text().catch(() => "");
                    throw new Error(`ChatService: ${retryRes.status} ${retryRes.statusText} — ${body}`);
                }
                return retryRes.json();
            }
            const body = await res.text().catch(() => "");
            throw new Error(`ChatService: ${res.status} ${res.statusText} — ${body}`);
        }
        return res.json();
    }
    // ── Widget Config ────────────────────────────────────────────
    /**
     * Fetch widget configuration from messages-service.
     */
    async fetchWidgetConfig() {
        const config = await this._fetch(`/chat/widgets/${this.widgetId}/config`);
        this.config = config;
        return config;
    }
    // ── Visitor Registration ─────────────────────────────────────
    /**
     * Register or identify a returning visitor.
     */
    async identifyVisitor(metadata = {}) {
        const data = await this._fetch("/chat/visitors", {
            method: "POST",
            body: JSON.stringify({
                widgetId: this.widgetId,
                visitorId: this.visitorId,
                ...metadata,
            }),
        });
        this.visitorId = data.visitorId;
        this._persistSession();
        return data;
    }
    // ── Conversations ────────────────────────────────────────────
    /**
     * Create a new conversation.
     */
    async createConversation() {
        const data = await this._fetch("/chat/conversations", {
            method: "POST",
            body: JSON.stringify({
                widgetId: this.widgetId,
                visitorId: this.visitorId,
            }),
        });
        this.conversationId = data.conversationId;
        this._persistSession();
        return data;
    }
    /**
     * Fetch message history for the current conversation.
     */
    async fetchMessages({ limit = 50, before } = {}) {
        if (!this.conversationId)
            return { messages: [], hasMore: false };
        const params = new URLSearchParams({ limit: String(limit) });
        if (before)
            params.set("before", before);
        return this._fetch(`/chat/conversations/${this.conversationId}/messages?${params}`);
    }
    // ── Sending Messages ─────────────────────────────────────────
    /**
     * Send a visitor message (standard mode — human operator will respond).
     */
    async sendMessage(content) {
        if (!this.conversationId) {
            await this.createConversation();
        }
        return this._fetch(`/chat/conversations/${this.conversationId}/messages`, {
            method: "POST",
            body: JSON.stringify({
                content,
                role: MESSAGE_ROLES.VISITOR,
            }),
        });
    }
    // ── AI Agent SSE Streaming ───────────────────────────────────
    /**
     * Send a message and stream the AI agent's response via SSE.
     *
     * @returns abort — Call to cancel the stream
     */
    sendAgentMessage(content, { onToken, onComplete, onError, onThinking }) {
        // Abort any in-flight stream
        this._abortStream();
        const controller = new AbortController();
        this._abortController = controller;
        const run = async () => {
            // Ensure conversation exists
            if (!this.conversationId) {
                await this.createConversation();
            }
            const res = await this._postAgentStream(content, controller.signal);
            // ── Auto-retry on stale conversation ──────────────────────
            if (res.status === 404) {
                this.clearSession();
                await this.createConversation();
                const retryRes = await this._postAgentStream(content, controller.signal);
                if (!retryRes.ok) {
                    const body = await retryRes.text().catch(() => "");
                    throw new Error(`Agent stream failed: ${retryRes.status} — ${body}`);
                }
                return this._consumeAgentStream(retryRes, { onToken, onComplete, onThinking });
            }
            if (!res.ok) {
                const body = await res.text().catch(() => "");
                throw new Error(`Agent stream failed: ${res.status} — ${body}`);
            }
            return this._consumeAgentStream(res, { onToken, onComplete, onThinking });
        };
        run().catch((err) => {
            if (err instanceof Error && err.name === "AbortError")
                return;
            onError?.(err instanceof Error ? err : new Error(String(err)));
        });
        return () => this._abortStream();
    }
    /**
     * POST to the agent SSE endpoint for the current conversation.
     */
    async _postAgentStream(content, signal) {
        const url = `${this.serviceUrl}/chat/conversations/${this.conversationId}/agent`;
        return fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                ...(this.visitorId && { "x-visitor-id": this.visitorId }),
            },
            body: JSON.stringify({
                content,
                role: MESSAGE_ROLES.VISITOR,
            }),
            signal,
        });
    }
    /**
     * Consume an SSE response stream from the agent endpoint.
     */
    async _consumeAgentStream(res, { onToken, onComplete, onThinking }) {
        const reader = res.body.getReader();
        const decoder = new TextDecoder();
        let buffer = "";
        let fullResponse = "";
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
                    onComplete?.(fullResponse);
                    return;
                }
                try {
                    const event = JSON.parse(payload);
                    if (event.type === "token" || event.type === "text") {
                        const token = event.content || event.token || "";
                        fullResponse += token;
                        onToken?.(token, fullResponse);
                    }
                    else if (event.type === "thinking") {
                        onThinking?.(event.content || "");
                    }
                    else if (event.type === "error") {
                        throw new Error(event.message || "Agent error");
                    }
                    else if (event.type === "done" || event.type === "complete") {
                        fullResponse = event.content || event.fullContent || fullResponse;
                        onComplete?.(fullResponse);
                        return;
                    }
                }
                catch (parseErr) {
                    if (parseErr instanceof Error && parseErr.message?.includes("Agent"))
                        throw parseErr;
                    // Non-JSON SSE line — skip
                }
            }
        }
        // Stream ended without explicit [DONE]
        if (fullResponse) {
            onComplete?.(fullResponse);
        }
    }
    /**
     * Abort any in-flight SSE stream.
     */
    _abortStream() {
        if (this._abortController) {
            this._abortController.abort();
            this._abortController = null;
        }
    }
    // ── Ensure Conversation ──────────────────────────────────────
    /**
     * Ensure a conversation exists (create if needed, restore if persisted).
     */
    async ensureConversation() {
        if (this.conversationId)
            return this.conversationId;
        // Ensure visitor is registered
        if (!this.visitorId) {
            this.visitorId = generateUUID();
            this._persistSession();
        }
        await this.createConversation();
        return this.conversationId;
    }
    /**
     * Destroy the service instance — clean up streams.
     */
    destroy() {
        this._abortStream();
    }
}
export default ChatService;
//# sourceMappingURL=ChatService.js.map