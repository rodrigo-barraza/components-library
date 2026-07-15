export interface DiscordRoleColor {
    primary: string;
    secondary?: string;
    tertiary?: string;
}
export interface DiscordBadge {
    id: string;
    label: string;
}
export interface DiscordRoleTag {
    name: string;
    color?: string;
    iconUrl?: string;
}
export interface DiscordAuthor {
    id: string;
    displayName: string;
    avatarUrl?: string;
    isBot?: boolean;
    roleColor?: string;
    roleColors?: DiscordRoleColor;
    badges?: (string | DiscordBadge)[];
    roleTags?: DiscordRoleTag[];
}
export interface DiscordAttachment {
    id?: string;
    url: string;
    proxyURL?: string;
    contentType?: string;
    name?: string;
    size?: number;
    width?: number;
    height?: number;
    duration?: number;
    waveform?: string;
    spoiler?: boolean;
}
export interface DiscordSticker {
    id: string;
    name?: string;
    format?: number;
    url?: string;
}
export interface DiscordEmbedAuthor {
    name: string;
    url?: string;
    iconURL?: string;
    proxyIconURL?: string;
}
export interface DiscordEmbedFooter {
    text: string;
    iconURL?: string;
    proxyIconURL?: string;
}
export interface DiscordEmbedField {
    name: string;
    value: string;
    inline?: boolean;
}
export interface DiscordEmbedMediaItem {
    url: string;
    proxyURL?: string;
    width?: number;
    height?: number;
}
export interface DiscordEmbed {
    url?: string;
    title?: string;
    description?: string;
    color?: number;
    provider?: {
        name: string;
        url?: string;
    };
    author?: DiscordEmbedAuthor;
    footer?: DiscordEmbedFooter;
    fields?: DiscordEmbedField[];
    timestamp?: string | number;
    image?: DiscordEmbedMediaItem;
    thumbnail?: DiscordEmbedMediaItem;
    video?: DiscordEmbedMediaItem;
}
export interface DiscordEmoji {
    id?: string;
    name: string;
    animated?: boolean;
}
export interface DiscordReaction {
    emoji: DiscordEmoji;
    count: number;
    me?: boolean;
    userIds?: string[];
}
export interface DiscordMessage {
    id: string;
    content: string;
    cleanContent?: string;
    createdAtISO: string;
    replyTo?: string;
    attachments?: DiscordAttachment[];
    stickers?: DiscordSticker[];
    embeds?: DiscordEmbed[];
    reactions?: DiscordReaction[];
    author: DiscordAuthor;
    guildName?: string;
    guildIcon?: string;
    guildBanner?: string;
    guildSplash?: string;
    guildId?: string;
    channelId?: string;
    channelName?: string;
}
export interface DiscordChannel {
    id: string;
    name: string;
    topic?: string;
    parentName?: string;
    position?: number;
}
export interface DiscordServer {
    id?: string;
    name?: string;
    iconUrl?: string;
}
export interface DiscordMember {
    id: string;
    displayName: string;
    avatarUrl?: string;
    isBot?: boolean;
    status?: "online" | "idle" | "dnd" | string;
    roleColor?: string;
    roleColors?: DiscordRoleColor;
    badges?: (string | DiscordBadge)[];
    roleTags?: DiscordRoleTag[];
    activity?: string;
}
export interface DiscordMemberRole {
    id: string;
    name: string;
    members: DiscordMember[];
}
export interface DiscordMembersData {
    roles?: DiscordMemberRole[];
    bots?: DiscordMember[];
    totalOnline?: number;
    totalMembers?: number;
}
type EmojiMap = Map<string, {
    animated: boolean;
    id: string;
    name: string;
}>;
interface MarkdownContext {
    emojiMap: EmojiMap;
    jumbo?: boolean;
}
declare function formatDiscordTimestamp(unixSeconds: number, style?: string): string;
declare function parseInline(text: string, ctx: MarkdownContext, keyBase: string): React.ReactNode[];
declare function renderMarkdown(text: string, ctx: MarkdownContext): React.ReactNode[];
declare function isEmojiOnly(text: string, emojiMap: EmojiMap): boolean;
declare function formatContent(content: string | undefined, cleanContent: string | undefined): import("react").JSX.Element | null;
declare function fitMediaDimensions(width?: number, height?: number): {
    width: number;
    height: number;
};
declare function isImageAttachment(attachment: DiscordAttachment): boolean;
declare function isVideoAttachment(attachment: DiscordAttachment): boolean;
declare function isAudioAttachment(attachment: DiscordAttachment): boolean;
declare function isVoiceMessage(attachment: DiscordAttachment): boolean;
declare function isSpoilerAttachment(attachment: DiscordAttachment): boolean;
declare function formatFileSize(bytes?: number | null): string;
declare function stickerUrl(sticker: DiscordSticker): string | null;
export declare const __internal: {
    formatContent: typeof formatContent;
    renderMarkdown: typeof renderMarkdown;
    parseInline: typeof parseInline;
    isEmojiOnly: typeof isEmojiOnly;
    formatDiscordTimestamp: typeof formatDiscordTimestamp;
    formatFileSize: typeof formatFileSize;
    isImageAttachment: typeof isImageAttachment;
    isVideoAttachment: typeof isVideoAttachment;
    isAudioAttachment: typeof isAudioAttachment;
    isVoiceMessage: typeof isVoiceMessage;
    isSpoilerAttachment: typeof isSpoilerAttachment;
    stickerUrl: typeof stickerUrl;
    fitMediaDimensions: typeof fitMediaDimensions;
};
export interface DiscordChatComponentProps {
    messageCount?: number;
    joinMode?: boolean;
    inviteUrl?: string;
    onJoinHoverChange?: (hovered: boolean) => void;
    channelIds?: string[];
    channelsUrl?: string;
    streamUrl?: string;
    membersUrl?: string;
    tenorOembedUrl?: string;
    reactUrl?: string;
    emojisUrl?: string;
    serverIconUrl?: string;
    serverBannerUrl?: string;
    servers?: DiscordServer[];
}
export default function DiscordChatComponent({ messageCount, joinMode, inviteUrl, onJoinHoverChange, channelIds, channelsUrl, streamUrl, membersUrl, tenorOembedUrl, reactUrl, emojisUrl, serverIconUrl, serverBannerUrl: serverBannerUrlProp, servers, }: DiscordChatComponentProps): import("react").JSX.Element;
export {};
//# sourceMappingURL=DiscordChatComponent.d.ts.map