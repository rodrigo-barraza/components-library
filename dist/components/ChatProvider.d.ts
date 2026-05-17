import { type ReactNode } from "react";
import ChatService from "../services/ChatService.js";
import { type ChatWidgetConfig } from "../constants/chat.js";
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
export declare function ChatProvider({ serviceUrl, widgetId, position, theme, greeting, operatorName, operatorAvatar, accentColor, children, }: ChatProviderProps): import("react/jsx-runtime").JSX.Element;
/**
 * Hook to access chat configuration and service instance.
 */
export declare function useChat(): ChatContextValue;
//# sourceMappingURL=ChatProvider.d.ts.map