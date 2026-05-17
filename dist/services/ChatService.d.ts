import { type ChatMessage, type ChatWidgetConfig, type AgentStreamCallbacks } from "../constants/chat.js";
export interface ChatServiceOptions {
    /** Base URL of messages-service */
    serviceUrl: string;
    /** Widget identifier */
    widgetId: string;
}
declare class ChatService {
    serviceUrl: string;
    widgetId: string;
    conversationId: string | null;
    visitorId: string | null;
    config: ChatWidgetConfig | null;
    private _abortController;
    constructor({ serviceUrl, widgetId }: ChatServiceOptions);
    private _restoreSession;
    private _persistSession;
    /**
     * Get persisted messages from localStorage.
     */
    getPersistedMessages(): ChatMessage[];
    /**
     * Persist messages to localStorage.
     */
    persistMessages(messages: ChatMessage[]): void;
    /**
     * Clear all persisted session data.
     */
    clearSession(): void;
    private _fetch;
    /**
     * Fetch widget configuration from messages-service.
     */
    fetchWidgetConfig(): Promise<ChatWidgetConfig>;
    /**
     * Register or identify a returning visitor.
     */
    identifyVisitor(metadata?: Record<string, unknown>): Promise<Record<string, unknown>>;
    /**
     * Create a new conversation.
     */
    createConversation(): Promise<Record<string, unknown>>;
    /**
     * Fetch message history for the current conversation.
     */
    fetchMessages({ limit, before }?: {
        limit?: number;
        before?: string;
    }): Promise<{
        messages: ChatMessage[];
        hasMore: boolean;
    }>;
    /**
     * Send a visitor message (standard mode — human operator will respond).
     */
    sendMessage(content: string): Promise<Record<string, unknown>>;
    /**
     * Send a message and stream the AI agent's response via SSE.
     *
     * @returns abort — Call to cancel the stream
     */
    sendAgentMessage(content: string, { onToken, onComplete, onError, onThinking }: AgentStreamCallbacks): () => void;
    /**
     * POST to the agent SSE endpoint for the current conversation.
     */
    private _postAgentStream;
    /**
     * Consume an SSE response stream from the agent endpoint.
     */
    private _consumeAgentStream;
    /**
     * Abort any in-flight SSE stream.
     */
    private _abortStream;
    /**
     * Ensure a conversation exists (create if needed, restore if persisted).
     */
    ensureConversation(): Promise<string>;
    /**
     * Destroy the service instance — clean up streams.
     */
    destroy(): void;
}
export default ChatService;
//# sourceMappingURL=ChatService.d.ts.map