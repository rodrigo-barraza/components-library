"use client";

// ─────────────────────────────────────────────────────────────
// useAgentChat — Orchestrator hook for the agent chat window.
// Owns the message list state, streams exchanges through
// AgentChatService, and handles greeting/persistence/offline
// fallback behavior.
// ─────────────────────────────────────────────────────────────

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { generateUUID } from "@rodrigo-barraza/utilities-library";
import AgentChatService, {
  type AgentChatServiceConfig,
} from "../services/AgentChatService.js";
import {
  AGENT_CHAT_ROLES,
  AGENT_TOOL_CALL_STATUS,
  type AgentChatMessage,
  type AgentToolCallSummary,
} from "../constants/agentChat.js";

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

const DEFAULT_ERROR_MESSAGE =
  "Something went wrong while generating a response. Please try again.";

function pickRandom<T>(items: T[]): T {
  return items[Math.floor(Math.random() * items.length)];
}

export default function useAgentChat(
  options: UseAgentChatOptions,
): UseAgentChatResult {
  const {
    greeting,
    offlineFallbacks,
    simulatedDelayMs,
    onError,
    ...serviceConfig
  } = options;

  // Recreate the service only when connection-identity fields change —
  // callbacks/extraBody are read from the latest config via ref.
  const serviceKey = `${serviceConfig.serviceUrl}|${serviceConfig.project}|${serviceConfig.username || ""}|${serviceConfig.endpoint || ""}|${serviceConfig.persistKey || ""}`;
  const configRef = useRef(serviceConfig);
  configRef.current = serviceConfig;
  const service = useMemo(
    () => new AgentChatService(configRef.current),
    // eslint-disable-next-line react-hooks/exhaustive-deps -- serviceKey encodes the identity fields
    [serviceKey],
  );

  const [messages, setMessages] = useState<AgentChatMessage[]>([]);
  const [isStreaming, setIsStreaming] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [hasGreeted, setHasGreeted] = useState(false);
  const abortRef = useRef<(() => void) | null>(null);
  const greetingTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const onErrorRef = useRef(onError);
  onErrorRef.current = onError;

  // ── Health check ───────────────────────────────────────────
  useEffect(() => {
    let cancelled = false;
    service.checkHealth().then((ok) => {
      if (!cancelled) setIsConnected(ok);
    });
    return () => {
      cancelled = true;
    };
  }, [service]);

  // ── Restore persisted messages ─────────────────────────────
  useEffect(() => {
    const persisted = service
      .getPersistedMessages()
      .filter((message) => message.role !== AGENT_CHAT_ROLES.SYSTEM);
    if (persisted.length > 0) {
      setMessages(persisted);
      setHasGreeted(true);
    }
  }, [service]);

  // ── Persist on change ──────────────────────────────────────
  useEffect(() => {
    if (messages.length === 0) return;
    service.persistMessages(messages);
  }, [service, messages]);

  // ── Initial greeting ───────────────────────────────────────
  useEffect(() => {
    if (hasGreeted || !greeting || messages.length > 0) return;
    setHasGreeted(true);
    setIsStreaming(true);
    const [minDelay, maxDelay] = simulatedDelayMs || [800, 1400];
    greetingTimerRef.current = setTimeout(
      () => {
        const content = Array.isArray(greeting)
          ? pickRandom(greeting)
          : greeting;
        setMessages([
          {
            id: generateUUID(),
            role: AGENT_CHAT_ROLES.ASSISTANT,
            content,
            createdAt: new Date().toISOString(),
          },
        ]);
        setIsStreaming(false);
      },
      minDelay + Math.random() * Math.max(0, maxDelay - minDelay),
    );
    return () => {
      if (greetingTimerRef.current) clearTimeout(greetingTimerRef.current);
    };
  }, [hasGreeted, greeting, messages.length, simulatedDelayMs]);

  const updateMessage = useCallback(
    (id: string, patch: Partial<AgentChatMessage>) => {
      setMessages((previous) =>
        previous.map((message) =>
          message.id === id ? { ...message, ...patch } : message,
        ),
      );
    },
    [],
  );

  const upsertToolCall = useCallback(
    (id: string, toolCall: AgentToolCallSummary) => {
      setMessages((previous) =>
        previous.map((message) => {
          if (message.id !== id) return message;
          const existing = message.toolCalls || [];
          const index = existing.findIndex((tc) => tc.id === toolCall.id);
          const nextToolCalls =
            index === -1
              ? [...existing, toolCall]
              : existing.map((tc, tcIndex) =>
                  tcIndex === index ? { ...tc, ...toolCall } : tc,
                );
          return { ...message, toolCalls: nextToolCalls };
        }),
      );
    },
    [],
  );

  const send = useCallback(
    (text: string) => {
      const trimmed = text.trim();
      if (!trimmed || isStreaming) return;

      const userMessage: AgentChatMessage = {
        id: generateUUID(),
        role: AGENT_CHAT_ROLES.USER,
        content: trimmed,
        createdAt: new Date().toISOString(),
      };
      const assistantId = generateUUID();
      const assistantPlaceholder: AgentChatMessage = {
        id: assistantId,
        role: AGENT_CHAT_ROLES.ASSISTANT,
        content: "",
        streaming: true,
        createdAt: new Date().toISOString(),
      };

      const history = messages;
      setMessages((previous) => [...previous, userMessage, assistantPlaceholder]);
      setIsStreaming(true);

      const failWithFallback = (error?: Error) => {
        if (error) onErrorRef.current?.(error);
        if (offlineFallbacks && offlineFallbacks.length > 0) {
          updateMessage(assistantId, {
            content: pickRandom(offlineFallbacks),
            streaming: false,
          });
        } else {
          updateMessage(assistantId, {
            content: error?.message || DEFAULT_ERROR_MESSAGE,
            streaming: false,
            error: true,
          });
        }
        setIsStreaming(false);
      };

      // Offline mode — no backend, simulate a canned response.
      if (!isConnected && offlineFallbacks && offlineFallbacks.length > 0) {
        const delay = 800 + Math.random() * 1500;
        const timer = setTimeout(() => failWithFallback(), delay);
        abortRef.current = () => clearTimeout(timer);
        return;
      }

      abortRef.current = service.streamMessage(history, trimmed, {
        onChunk: (_token, fullContent) => {
          updateMessage(assistantId, { content: fullContent });
        },
        onThinking: (_token, fullThinking) => {
          updateMessage(assistantId, { thinking: fullThinking });
        },
        onToolEvent: (toolCall) => {
          upsertToolCall(assistantId, toolCall);
        },
        onImage: (url) => {
          setMessages((previous) =>
            previous.map((message) =>
              message.id === assistantId
                ? { ...message, images: [...(message.images || []), url] }
                : message,
            ),
          );
        },
        onDone: (_info, fullContent) => {
          updateMessage(assistantId, {
            content: fullContent,
            streaming: false,
          });
          setIsStreaming(false);
        },
        onError: (error) => {
          failWithFallback(error);
        },
      });
    },
    [
      messages,
      isStreaming,
      isConnected,
      offlineFallbacks,
      service,
      updateMessage,
      upsertToolCall,
    ],
  );

  const stop = useCallback(() => {
    abortRef.current?.();
    abortRef.current = null;
    setMessages((previous) =>
      previous.map((message) => {
        if (!message.streaming) return message;
        const { streaming: _streaming, ...rest } = message;
        // Mark running tool calls as complete so pills stop spinning.
        const toolCalls = rest.toolCalls?.map((toolCall) =>
          toolCall.status === AGENT_TOOL_CALL_STATUS.RUNNING
            ? { ...toolCall, status: AGENT_TOOL_CALL_STATUS.COMPLETE }
            : toolCall,
        );
        return { ...rest, ...(toolCalls && { toolCalls }) };
      }),
    );
    setIsStreaming(false);
  }, []);

  const reset = useCallback(() => {
    abortRef.current?.();
    abortRef.current = null;
    service.clearPersistedMessages();
    setMessages([]);
    setIsStreaming(false);
    setHasGreeted(false);
  }, [service]);

  // ── Cleanup on unmount ─────────────────────────────────────
  useEffect(() => {
    return () => {
      abortRef.current?.();
    };
  }, []);

  return { messages, isStreaming, isConnected, send, stop, reset, service };
}
