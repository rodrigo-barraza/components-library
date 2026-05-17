"use client";
import { jsx as _jsx } from "react/jsx-runtime";
import { createContext, useContext, useState, useEffect, useRef } from "react";
import ChatService from "../services/ChatService.js";
import { CHAT_DEFAULTS } from "../constants/chat.js";
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
const ChatContext = createContext({
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
export function ChatProvider({ serviceUrl, widgetId, position = CHAT_DEFAULTS.POSITION, theme = CHAT_DEFAULTS.THEME, greeting = CHAT_DEFAULTS.GREETING, operatorName = CHAT_DEFAULTS.OPERATOR_NAME, operatorAvatar = null, accentColor = CHAT_DEFAULTS.ACCENT_COLOR, children, }) {
    const serviceRef = useRef(null);
    const [config, setConfig] = useState(null);
    const [configLoading, setConfigLoading] = useState(true);
    // Initialize service singleton
    if (!serviceRef.current) {
        serviceRef.current = new ChatService({ serviceUrl, widgetId });
    }
    // Fetch remote widget config on mount
    useEffect(() => {
        let cancelled = false;
        serviceRef.current
            .fetchWidgetConfig()
            .then((remote) => {
            if (!cancelled)
                setConfig(remote);
        })
            .catch((err) => {
            const message = err instanceof Error ? err.message : "Unknown error";
            console.warn("[Chat] Failed to fetch widget config:", message);
        })
            .finally(() => {
            if (!cancelled)
                setConfigLoading(false);
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
    const merged = {
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
    return (_jsx(ChatContext.Provider, { value: merged, children: children }));
}
/**
 * Hook to access chat configuration and service instance.
 */
export function useChat() {
    return useContext(ChatContext);
}
//# sourceMappingURL=ChatProvider.js.map