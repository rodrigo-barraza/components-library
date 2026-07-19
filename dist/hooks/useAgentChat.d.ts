import AgentChatService, { type AgentChatServiceConfig } from "../services/AgentChatService.js";
import { type AgentChatMessage } from "../constants/agentChat.js";
export interface UseAgentChatOptions extends AgentChatServiceConfig {
    /**
     * Initial assistant message shown when the chat is empty.
     * Pass an array to pick one at random.
     */
    greeting?: string | string[];
    /**
     * Canned responses used when the service is unreachable or a
     * stream fails. When omitted, failures render an error message.
     */
    offlineFallbacks?: string[];
    /** Delay range (ms) before a greeting/offline fallback appears. */
    simulatedDelayMs?: [number, number];
    onError?: (error: Error) => void;
}
export interface UseAgentChatResult {
    messages: AgentChatMessage[];
    /** True while an assistant response is streaming (or simulated). */
    isStreaming: boolean;
    /** True when prism-service answered the health check. */
    isConnected: boolean;
    send: (text: string) => void;
    /** Abort the in-flight stream, keeping partial content. */
    stop: () => void;
    /** Clear messages (and persistence) and re-greet. */
    reset: () => void;
    service: AgentChatService;
}
export default function useAgentChat(options: UseAgentChatOptions): UseAgentChatResult;
//# sourceMappingURL=useAgentChat.d.ts.map