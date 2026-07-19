import { type AgentChatDoneInfo, type AgentChatMessage, type AgentToolCallSummary } from "../constants/agentChat.js";
export interface AgentChatServiceConfig {
    /** Base URL of prism-service, e.g. "https://prism.example.com". */
    serviceUrl: string;
    /** Project identity header (x-project) — routes cost accounting and tooling. */
    project: string;
    /** Username identity header (x-username). Defaults to "visitor". */
    username?: string;
    /** Endpoint path. Defaults to "/agent" (agentic loop capable). Use "/chat" for plain generation. */
    endpoint?: string;
    /** Named agent persona for /agent. Omit for server-default routing. */
    agent?: string;
    provider?: string;
    model?: string;
    /** Prepended as a system message on every request. */
    systemPrompt?: string;
    functionCallingEnabled?: boolean;
    agenticLoopEnabled?: boolean;
    /** Auto-approve tool executions server-side (no approval UI in the lean window). Default true. */
    autoApprove?: boolean;
    /** Skip server-side conversation persistence. Default true for embedded chats. */
    skipConversation?: boolean;
    /** How many trailing messages of history to send. Default 20. */
    historyWindow?: number;
    /** localStorage key for message persistence. Omit/null to disable. */
    persistKey?: string | null;
    /** Resolve a server file reference (e.g. minio ref) to a fetchable URL. */
    resolveFileUrl?: (ref: string) => string;
    /** Extra fields merged into the request body (escape hatch). */
    extraBody?: Record<string, unknown>;
}
export interface AgentChatStreamCallbacks {
    onChunk?: (token: string, fullContent: string) => void;
    onThinking?: (token: string, fullThinking: string) => void;
    /** Fired on tool lifecycle events — upsert by `id`. */
    onToolEvent?: (toolCall: AgentToolCallSummary) => void;
    /** Fired with a renderable image URL (data: URL or resolved file URL). */
    onImage?: (url: string) => void;
    onDone?: (info: AgentChatDoneInfo, fullContent: string) => void;
    onError?: (error: Error) => void;
}
export default class AgentChatService {
    readonly config: AgentChatServiceConfig;
    constructor(config: AgentChatServiceConfig);
    private get headers();
    /** Check whether prism-service is reachable. */
    checkHealth(): Promise<boolean>;
    /**
     * Build the OpenAI-format message array for a request: optional
     * system prompt, a trailing window of history, then the new user
     * message.
     */
    buildRequestMessages(history: AgentChatMessage[], userText: string): Array<{
        role: string;
        content: string;
    }>;
    /**
     * Stream one exchange. Returns an abort function.
     */
    streamMessage(history: AgentChatMessage[], userText: string, callbacks: AgentChatStreamCallbacks): () => void;
    getPersistedMessages(): AgentChatMessage[];
    persistMessages(messages: AgentChatMessage[]): void;
    clearPersistedMessages(): void;
}
//# sourceMappingURL=AgentChatService.d.ts.map