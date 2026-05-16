"use client";

import { createContext, useContext, useState, useEffect, useRef, type ReactNode } from "react";
import ChatService from "../services/ChatService.ts";
import { CHAT_DEFAULTS, type ChatWidgetConfig } from "../constants/chat.ts";

export interface ChatContextValue {
  service: ChatService | null;
  config: ChatWidgetConfig | null;
  configLoading: boolean;
  position: string;
  theme: string;
  greeting: string;
  operatorName: string;
  operatorAvatar: string | null;
  accentColor: string;
  aiEnabled: boolean;
}

/**
 * ChatContext — Global configuration for the chat widget.
 *
 * Wrap your app with `<ChatProvider>` to enable the chat widget.
 *
 * @example
 *   import { ChatProvider, ChatComponent } from "@rodrigo-barraza/components-library";
 *
 *   <ChatProvider
 *     serviceUrl="https://api.example.com"
 *     widgetId="wgt_abc123"
 *   >
 *     <App />
 *     <ChatComponent />
 *   </ChatProvider>
 */
const ChatContext = createContext<ChatContextValue>({
  service: null,
  config: null,
  configLoading: true,
  position: CHAT_DEFAULTS.POSITION,
  theme: CHAT_DEFAULTS.THEME,
  greeting: CHAT_DEFAULTS.GREETING,
  operatorName: CHAT_DEFAULTS.OPERATOR_NAME,
  operatorAvatar: null,
  accentColor: CHAT_DEFAULTS.ACCENT_COLOR,
  aiEnabled: false,
});

export interface ChatProviderProps {
  /** Base URL of messages-service */
  serviceUrl: string;
  /** Widget identifier from messages-client */
  widgetId: string;
  /** "bottom-right" | "bottom-left" */
  position?: string;
  /** "dark" | "light" | "auto" */
  theme?: string;
  /** Welcome message */
  greeting?: string;
  /** Operator display name */
  operatorName?: string;
  /** Operator avatar URL */
  operatorAvatar?: string | null;
  /** Primary accent color */
  accentColor?: string;
  children: ReactNode;
}

export function ChatProvider({
  serviceUrl,
  widgetId,
  position = CHAT_DEFAULTS.POSITION,
  theme = CHAT_DEFAULTS.THEME,
  greeting = CHAT_DEFAULTS.GREETING,
  operatorName = CHAT_DEFAULTS.OPERATOR_NAME,
  operatorAvatar = null,
  accentColor = CHAT_DEFAULTS.ACCENT_COLOR,
  children,
}: ChatProviderProps) {
  const serviceRef = useRef<ChatService | null>(null);
  const [config, setConfig] = useState<ChatWidgetConfig | null>(null);
  const [configLoading, setConfigLoading] = useState(true);

  // Initialize service singleton
  if (!serviceRef.current) {
    serviceRef.current = new ChatService({ serviceUrl, widgetId });
  }

  // Fetch remote widget config on mount
  useEffect(() => {
    let cancelled = false;
    serviceRef.current!
      .fetchWidgetConfig()
      .then((remote) => {
        if (!cancelled) setConfig(remote);
      })
      .catch((err: unknown) => {
        const message = err instanceof Error ? err.message : "Unknown error";
        console.warn("[Chat] Failed to fetch widget config:", message);
      })
      .finally(() => {
        if (!cancelled) setConfigLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [serviceUrl, widgetId]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      serviceRef.current?.destroy();
    };
  }, []);

  // Merge remote config over local defaults (remote wins if present)
  const merged: ChatContextValue = {
    service: serviceRef.current,
    config,
    configLoading,
    position: config?.position || position,
    theme: config?.theme || theme,
    greeting: config?.greeting || greeting,
    operatorName: config?.operatorName || operatorName,
    operatorAvatar: config?.operatorAvatar || operatorAvatar,
    accentColor: config?.accentColor || accentColor,
    aiEnabled: config?.aiEnabled ?? false,
  };

  return (
    <ChatContext.Provider value={merged}>{children}</ChatContext.Provider>
  );
}

/**
 * Hook to access chat configuration and service instance.
 */
export function useChat(): ChatContextValue {
  return useContext(ChatContext);
}
