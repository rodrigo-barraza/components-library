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
    width?: number;
    height?: number;
    duration?: number;
    waveform?: string;
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
//# sourceMappingURL=DiscordChatComponent.d.ts.map