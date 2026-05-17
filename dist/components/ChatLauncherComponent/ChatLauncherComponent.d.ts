export interface ChatLauncherComponentProps {
    /** Whether the chat panel is open */
    isOpen: boolean;
    /** Number of unread messages */
    unreadCount?: number;
    /** Toggle callback */
    onClick: () => void;
}
/**
 * ChatLauncherComponent — Floating Action Button (FAB).
 *
 * Renders as a circular button with a chat icon that morphs to a
 * close icon when the panel is open. Includes an unread badge with
 * pulse animation.
 */
export default function ChatLauncherComponent({ isOpen, unreadCount, onClick, }: ChatLauncherComponentProps): import("react/jsx-runtime").JSX.Element;
//# sourceMappingURL=ChatLauncherComponent.d.ts.map