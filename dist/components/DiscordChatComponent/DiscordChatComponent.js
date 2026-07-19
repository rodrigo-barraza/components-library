"use client";
import { Fragment as _Fragment, jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect, useLayoutEffect, useRef, useCallback } from "react";
import { DISCORD_STICKER_FORMAT, clamp, discordBannerUrl, discordEmojiUrl, discordGuildIconUrl, discordSplashUrl, discordStickerUrl, formatMediaTimestamp, } from "@rodrigo-barraza/utilities-library";
import styles from "./DiscordChatComponent.module.css";
// ── Discord role colors (fallback when no role color from API) ───
const ROLE_COLORS = [
    "#e91e63", "#9c27b0", "#3f51b5", "#2196f3", "#009688",
    "#4caf50", "#ff9800", "#e74c3c", "#1abc9c", "#e67e22",
    "#f1c40f", "#2ecc71", "#3498db", "#9b59b6",
];
function getFallbackColor(userId) {
    let hash = 0;
    for (let i = 0; i < userId.length; i++) {
        hash = (hash * 31 + userId.charCodeAt(i)) | 0;
    }
    return ROLE_COLORS[Math.abs(hash) % ROLE_COLORS.length];
}
// ── Role Color Style Resolver ────────────────────────────────────
// Returns an inline style object for name color. If the author has
// Discord's Enhanced Role Styles (gradient or holographic), this
// produces a CSS `background-clip: text` gradient. Otherwise, it
// returns a simple `color` property.
function resolveRoleColorStyle(author) {
    const roleColors = author.roleColors;
    if (roleColors?.secondary) {
        // Build gradient stops: primary → secondary, optionally tertiary
        const stops = [roleColors.primary, roleColors.secondary];
        if (roleColors.tertiary)
            stops.push(roleColors.tertiary);
        return {
            background: `linear-gradient(90deg, ${stops.join(", ")})`,
            backgroundClip: "text",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            color: "transparent",
            // Underline decoration color must be explicit — color: transparent
            // would make text-decoration invisible without this.
            textDecorationColor: roleColors.primary,
        };
    }
    // Flat color (solid or fallback)
    return { color: author.roleColor || getFallbackColor(author.id) };
}
const AVATAR_COLORS = [
    "#5865f2", "#57f287", "#fee75c", "#eb459e", "#ed4245",
    "#3ba55d", "#faa61a", "#99aab5",
];
function getAvatarColor(userId) {
    let hash = 0;
    for (let i = 0; i < userId.length; i++) {
        hash = (hash * 37 + userId.charCodeAt(i)) | 0;
    }
    return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
}
// ── Discord Profile Badge Icons ──────────────────────────────
// SVG path data for each badge identifier. These are compact
// versions of Discord's official badge icons, rendered inline
// as 18×18 SVGs next to the username.
const BADGE_ICONS = {
    staff: {
        color: "#5865f2",
        label: "Discord Staff",
        path: "M10.56 1.1c-.46-.46-1.2-.46-1.66 0L7.71 2.29 5.81 1.66c-.57-.19-1.2.08-1.45.63L3.72 4H2.1c-.61 0-1.1.49-1.1 1.1v1.62L.37 7.36c-.55.25-.82.88-.63 1.45l.63 1.9-1.19 1.19c-.46.46-.46 1.2 0 1.66l1.19 1.19-.63 1.9c-.19.57.08 1.2.63 1.45L1 17.74v1.16c0 .61.49 1.1 1.1 1.1h1.62l.64 1.63c.25.55.88.82 1.45.63l1.9-.63 1.19 1.19c.46.46 1.2.46 1.66 0l1.19-1.19 1.9.63c.57.19 1.2-.08 1.45-.63l.64-1.63H17.9c.61 0 1.1-.49 1.1-1.1v-1.16l.63-.64c.55-.25.82-.88.63-1.45l-.63-1.9 1.19-1.19c.46-.46.46-1.2 0-1.66L19.63 9.26l.63-1.9c.19-.57-.08-1.2-.63-1.45L18 5.27V4.11c0-.61-.49-1.1-1.1-1.1h-1.62l-.64-1.63c-.25-.55-.88-.82-1.45-.63l-1.9.63L10.56 1.1zM8.03 9.47l1.72 1.31 3.5-4.5 1.5 1.17-4.5 5.78-2.97-2.28.75-.48z",
    },
    partner: {
        color: "#5865f2",
        label: "Partnered Server Owner",
        path: "M10.56 1.1c-.46-.46-1.2-.46-1.66 0L7.71 2.29 5.81 1.66c-.57-.19-1.2.08-1.45.63L3.72 4H2.1c-.61 0-1.1.49-1.1 1.1v1.62L.37 7.36c-.55.25-.82.88-.63 1.45l.63 1.9-1.19 1.19c-.46.46-.46 1.2 0 1.66l1.19 1.19-.63 1.9c-.19.57.08 1.2.63 1.45L1 17.74v1.16c0 .61.49 1.1 1.1 1.1h1.62l.64 1.63c.25.55.88.82 1.45.63l1.9-.63 1.19 1.19c.46.46 1.2.46 1.66 0l1.19-1.19 1.9.63c.57.19 1.2-.08 1.45-.63l.64-1.63H17.9c.61 0 1.1-.49 1.1-1.1v-1.16l.63-.64c.55-.25.82-.88.63-1.45l-.63-1.9 1.19-1.19c.46-.46.46-1.2 0-1.66L19.63 9.26l.63-1.9c.19-.57-.08-1.2-.63-1.45L18 5.27V4.11c0-.61-.49-1.1-1.1-1.1h-1.62l-.64-1.63c-.25-.55-.88-.82-1.45-.63l-1.9.63L10.56 1.1zM8.03 9.47l1.72 1.31 3.5-4.5 1.5 1.17-4.5 5.78-2.97-2.28.75-.48z",
    },
    hypesquad: {
        color: "#f47b67",
        label: "HypeSquad Events",
        path: "M2 5l8-4 8 4-8 12L2 5z",
    },
    hypesquad_bravery: {
        color: "#9c84ef",
        label: "HypeSquad Bravery",
        path: "M5.01 3L10 1l4.99 2L10 19 5.01 3zM10 7.5L7.5 4H12.5L10 7.5z",
    },
    hypesquad_brilliance: {
        color: "#f47b67",
        label: "HypeSquad Brilliance",
        path: "M10 1l3 5.5L10 19 7 6.5 10 1zM10 7a3 3 0 1 0 0 6 3 3 0 0 0 0-6z",
    },
    hypesquad_balance: {
        color: "#45ddc0",
        label: "HypeSquad Balance",
        path: "M10 1l8 5v8l-8 5-8-5V6l8-5zm0 3L5 7v6l5 3 5-3V7l-5-3z",
    },
    bug_hunter_1: {
        color: "#49ad5a",
        label: "Bug Hunter Level 1",
        path: "M7 2a4 4 0 0 1 6 0l1.5 2H17v3h-1l-1 8H5L4 7H3V4h2.5L7 2zm3 4a2 2 0 1 0 0 4 2 2 0 0 0 0-4z",
    },
    bug_hunter_2: {
        color: "#f0b132",
        label: "Bug Hunter Level 2",
        path: "M7 2a4 4 0 0 1 6 0l1.5 2H17v3h-1l-1 8H5L4 7H3V4h2.5L7 2zm3 4a2 2 0 1 0 0 4 2 2 0 0 0 0-4zM6 16l4 3 4-3H6z",
    },
    early_supporter: {
        color: "#7289da",
        label: "Early Supporter",
        path: "M10 1.5l2.5 4.5h5L13 10l2 7-5-3.5L5 17l2-7-4.5-4h5L10 1.5z",
    },
    verified_developer: {
        color: "#5865f2",
        label: "Early Verified Bot Developer",
        path: "M7.5 3L10 1l2.5 2h3v3L18 8.5 15.5 11v3h-3L10 16.5 7.5 14h-3v-3L2 8.5 4.5 6V3h3zM7 8l2 2 4-4 1.5 1.5L9 13 5.5 9.5 7 8z",
    },
    certified_moderator: {
        color: "#5865f2",
        label: "Moderator Programs Alumni",
        path: "M3 4.5V6l7 7 7-7V4.5L10 10 3 4.5zM3 11v1.5l7 7 7-7V11l-7 5.5L3 11z",
    },
    active_developer: {
        color: "#23a559",
        label: "Active Developer",
        path: "M6.5 2L2 6.5V14l4.5 4.5H14l4.5-4.5V6.5L14 2H6.5zM8 7h4v2H8V7zm0 4h4v2H8v-2z",
    },
};
// ── User Profile Badges ──────────────────────────────────────
// Renders a row of small SVG badge icons next to the username,
// matching Discord's native badge display behavior.
function UserBadges({ badges }) {
    if (!badges?.length)
        return null;
    return (_jsx("span", { className: styles['user-badges'], children: badges.map((badge) => {
            // badge can be a string ID or { id, label } object
            const id = typeof badge === "string" ? badge : badge.id;
            const icon = BADGE_ICONS[id];
            if (!icon)
                return null;
            return (_jsx("span", { className: styles['badge-icon'], title: icon.label, children: _jsx("svg", { viewBox: "0 0 20 20", fill: icon.color, width: "18", height: "18", children: _jsx("path", { d: icon.path }) }) }, id));
        }) }));
}
// ── Role Tags ────────────────────────────────────────────────
// Renders colored role pill badges next to the username — matching
// Discord's native role tag display to the right of the name.
function RoleTags({ roleTags }) {
    if (!roleTags?.length)
        return null;
    return (_jsx("span", { className: styles['role-tags'], children: roleTags.map((tag) => (_jsxs("span", { className: styles['role-tag'], style: {
                "--role-color": tag.color || "#99aab5",
            }, title: tag.name, children: [tag.iconUrl && (_jsx("img", { src: tag.iconUrl, alt: "", className: styles['role-tag-icon'], width: 14, height: 14, loading: "lazy", draggable: false })), _jsx("span", { className: styles['role-tag-name'], children: tag.name })] }, tag.name))) }));
}
// ── Tenor URL detection ──────────────────────────────────────────
const TENOR_URL_RE = /https?:\/\/tenor\.com\/view\/[\w-]+/g;
// Non-global copy for single-URL tests — a global regex is stateful
// (lastIndex persists between .test() calls), so never use it there.
const TENOR_URL_TEST_RE = /https?:\/\/tenor\.com\/view\/[\w-]+/;
function extractTenorUrls(content) {
    return (content || "").match(TENOR_URL_RE) || [];
}
// ── Discord Custom Emoji ─────────────────────────────────────────
const CUSTOM_EMOJI_RE = /<(a?):(\w+):(\d+)>/g;
function emojiUrl(id, animated) {
    return discordEmojiUrl(id, animated);
}
// Click-to-reveal inline spoiler (||text||), Discord-style.
function TextSpoiler({ children }) {
    const [revealed, setRevealed] = useState(false);
    return (_jsx("span", { className: revealed ? styles['spoiler-text-revealed'] : styles['spoiler-text'], onClick: revealed ? undefined : () => setRevealed(true), title: revealed ? undefined : "Spoiler — click to reveal", children: children }));
}
// <t:unixSeconds:style> — Discord timestamp tokens
function formatDiscordTimestamp(unixSeconds, style = "f") {
    const date = new Date(unixSeconds * 1000);
    if (isNaN(date.getTime()))
        return "";
    const time = date.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true });
    switch (style) {
        case "t": return time;
        case "T": return date.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", second: "2-digit", hour12: true });
        case "d": return date.toLocaleDateString("en-US", { month: "2-digit", day: "2-digit", year: "numeric" });
        case "D": return date.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
        case "F": return `${date.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" })} ${time}`;
        case "R": {
            const diffSeconds = Math.round((date.getTime() - Date.now()) / 1000);
            const absSeconds = Math.abs(diffSeconds);
            const units = [
                [31536000, "year"], [2592000, "month"], [86400, "day"],
                [3600, "hour"], [60, "minute"], [1, "second"],
            ];
            for (const [unitSeconds, label] of units) {
                if (absSeconds >= unitSeconds || unitSeconds === 1) {
                    const count = Math.max(1, Math.floor(absSeconds / unitSeconds));
                    const unitLabel = count === 1 ? label : `${label}s`;
                    return diffSeconds < 0 ? `${count} ${unitLabel} ago` : `in ${count} ${unitLabel}`;
                }
            }
            return "now";
        }
        default:
            return `${date.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })} ${time}`;
    }
}
// Ordered by priority — when two patterns match at the same index,
// the earlier entry wins. All regexes must be non-global.
const INLINE_PATTERNS = [
    // `inline code` — no nested formatting inside
    {
        re: /`([^`\n]+)`/,
        render: (match, _ctx, key) => _jsx("code", { className: styles['inline-code'], children: match[1] }, key),
    },
    // ||spoiler||
    {
        re: /\|\|([\s\S]+?)\|\|/,
        render: (match, _ctx, key, parse) => _jsx(TextSpoiler, { children: parse(match[1], key) }, key),
    },
    // ***bold italic***
    {
        re: /\*\*\*([\s\S]+?)\*\*\*/,
        render: (match, _ctx, key, parse) => _jsx("strong", { children: _jsx("em", { children: parse(match[1], key) }) }, key),
    },
    // **bold**
    {
        re: /\*\*([\s\S]+?)\*\*/,
        render: (match, _ctx, key, parse) => _jsx("strong", { children: parse(match[1], key) }, key),
    },
    // __underline__
    {
        re: /__([\s\S]+?)__/,
        render: (match, _ctx, key, parse) => _jsx("u", { children: parse(match[1], key) }, key),
    },
    // ~~strikethrough~~
    {
        re: /~~([\s\S]+?)~~/,
        render: (match, _ctx, key, parse) => _jsx("s", { children: parse(match[1], key) }, key),
    },
    // *italic*
    {
        re: /\*([^*\n]+)\*/,
        render: (match, _ctx, key, parse) => _jsx("em", { children: parse(match[1], key) }, key),
    },
    // _italic_ — match[1] is the preceding non-word char (or start)
    {
        re: /(^|[^\w_])_([^_\n]+)_(?![\w_])/,
        render: (match, _ctx, key, parse) => (_jsxs("span", { children: [match[1], _jsx("em", { children: parse(match[2], key) })] }, key)),
    },
    // [label](url) masked links
    {
        re: /\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/,
        render: (match, _ctx, key, parse) => (_jsx("a", { href: match[2], target: "_blank", rel: "noopener noreferrer", children: parse(match[1], key) }, key)),
    },
    // <a:name:id> raw custom emoji tokens
    {
        re: /<(a?):(\w+):(\d+)>/,
        render: (match, ctx, key) => (_jsx("img", { src: emojiUrl(match[3], match[1] === "a"), alt: `:${match[2]}:`, title: `:${match[2]}:`, className: ctx.jumbo ? `${styles['custom-emoji']} ${styles['custom-emoji-jumbo']}` : styles['custom-emoji'], draggable: false, loading: "lazy" }, key)),
    },
    // <t:unix:style> timestamps
    {
        re: /<t:(-?\d+)(?::([tTdDfFR]))?>/,
        render: (match, _ctx, key) => (_jsx("span", { className: styles['md-timestamp'], children: formatDiscordTimestamp(Number(match[1]), match[2] || "f") }, key)),
    },
    // Raw mention tokens (usually already resolved in cleanContent)
    {
        re: /<(@[!&]?|#)\d+>/,
        render: (match, _ctx, key) => (_jsx("span", { className: styles['mention'], children: match[1] === "#" ? "#channel" : match[1] === "@&" ? "@role" : "@user" }, key)),
    },
    // Bare URLs
    {
        re: /https?:\/\/[^\s<]+/,
        render: (match, _ctx, key) => {
            const url = match[0];
            if (TENOR_URL_TEST_RE.test(url))
                return null; // rendered by TenorEmbeds
            const display = url.length > 50 ? url.substring(0, 47) + "..." : url;
            return _jsx("a", { href: url, target: "_blank", rel: "noopener noreferrer", children: display }, key);
        },
    },
    // :name: custom emoji resolved via the raw-content emoji map
    {
        re: /:(\w+):/,
        render: (match, ctx, key) => {
            const emoji = ctx.emojiMap.get(match[1]);
            if (!emoji)
                return match[0];
            return (_jsx("img", { src: emojiUrl(emoji.id, emoji.animated), alt: `:${emoji.name}:`, title: `:${emoji.name}:`, className: ctx.jumbo ? `${styles['custom-emoji']} ${styles['custom-emoji-jumbo']}` : styles['custom-emoji'], draggable: false, loading: "lazy" }, key));
        },
    },
    // @mentions (cleanContent form)
    {
        re: /@[\w.]+/,
        render: (match, _ctx, key) => _jsx("span", { className: styles['mention'], children: match[0] }, key),
    },
];
// Scan for the earliest-matching inline pattern, emit preceding text
// verbatim, render the match (recursing for nestable styles), repeat.
function parseInline(text, ctx, keyBase) {
    const nodes = [];
    let remaining = text;
    let keyIndex = 0;
    let guard = 0;
    while (remaining.length > 0 && guard++ < 2000) {
        let best = null;
        for (const { re, render } of INLINE_PATTERNS) {
            const match = re.exec(remaining);
            if (!match)
                continue;
            if (!best || match.index < best.index) {
                best = { index: match.index, match, render };
                if (best.index === 0)
                    break; // earlier patterns already had their shot
            }
        }
        if (!best) {
            nodes.push(remaining);
            break;
        }
        if (best.index > 0)
            nodes.push(remaining.slice(0, best.index));
        const parse = (inner, innerKeyBase) => parseInline(inner, ctx, `${innerKeyBase}-i`);
        const rendered = best.render(best.match, ctx, `${keyBase}-${keyIndex++}`, parse);
        if (rendered !== null)
            nodes.push(rendered);
        remaining = remaining.slice(best.index + best.match[0].length);
    }
    return nodes;
}
// Line-level constructs: headers, subtext, block quotes, list items.
// Plain lines are joined with "\n" (message text is white-space:
// pre-wrap) so hard line breaks survive.
function renderBlockLines(segment, ctx, keyBase) {
    const lines = segment.split("\n");
    const nodes = [];
    let inlineRun = [];
    let quoteRun = [];
    let restIsQuote = false;
    const flushInline = () => {
        if (inlineRun.length) {
            nodes.push(...inlineRun);
            inlineRun = [];
        }
    };
    const flushQuote = (key) => {
        if (!quoteRun.length)
            return;
        nodes.push(_jsx("blockquote", { className: styles['block-quote'], children: parseInline(quoteRun.join("\n"), ctx, `${key}-q`) }, key));
        quoteRun = [];
    };
    for (let lineIndex = 0; lineIndex < lines.length; lineIndex++) {
        const line = lines[lineIndex];
        const key = `${keyBase}-l${lineIndex}`;
        if (restIsQuote) {
            quoteRun.push(line);
            continue;
        }
        const multiQuoteMatch = /^>>> ?([\s\S]*)$/.exec(line);
        if (multiQuoteMatch) {
            flushInline();
            restIsQuote = true;
            quoteRun.push(multiQuoteMatch[1]);
            continue;
        }
        const quoteMatch = /^> ?(.*)$/.exec(line);
        if (quoteMatch) {
            flushInline();
            quoteRun.push(quoteMatch[1]);
            continue;
        }
        flushQuote(`${key}-fq`);
        const headerMatch = /^(#{1,3}) (.+)$/.exec(line);
        if (headerMatch) {
            flushInline();
            const level = headerMatch[1].length;
            nodes.push(_jsx("div", { className: styles[`md-h${level}`], children: parseInline(headerMatch[2], ctx, key) }, key));
            continue;
        }
        const subtextMatch = /^-# (.+)$/.exec(line);
        if (subtextMatch) {
            flushInline();
            nodes.push(_jsx("div", { className: styles['md-subtext'], children: parseInline(subtextMatch[1], ctx, key) }, key));
            continue;
        }
        const listMatch = /^(\s*)[-*] (.+)$/.exec(line);
        if (listMatch) {
            flushInline();
            const depth = Math.min(Math.floor(listMatch[1].length / 2), 3);
            nodes.push(_jsxs("div", { className: styles['md-list-item'], style: depth ? { marginLeft: depth * 16 } : undefined, children: [_jsx("span", { className: styles['md-list-bullet'], children: "\u2022" }), _jsx("span", { children: parseInline(listMatch[2], ctx, key) })] }, key));
            continue;
        }
        if (inlineRun.length)
            inlineRun.push("\n");
        inlineRun.push(...parseInline(line, ctx, key));
    }
    flushQuote(`${keyBase}-fq-end`);
    flushInline();
    return nodes;
}
// Top level: extract ```fenced code blocks``` first, everything else
// goes through line-level + inline parsing.
const CODE_FENCE_RE = /```(?:([\w+-]+)\n)?([\s\S]*?)```/g;
function renderMarkdown(text, ctx) {
    const nodes = [];
    let lastIndex = 0;
    let blockIndex = 0;
    CODE_FENCE_RE.lastIndex = 0;
    let fenceMatch;
    while ((fenceMatch = CODE_FENCE_RE.exec(text)) !== null) {
        if (fenceMatch.index > lastIndex) {
            const before = text.slice(lastIndex, fenceMatch.index).replace(/\n$/, "");
            if (before)
                nodes.push(...renderBlockLines(before, ctx, `b${blockIndex++}`));
        }
        const code = (fenceMatch[2] || "").replace(/^\n/, "").replace(/\n$/, "");
        nodes.push(_jsx("pre", { className: styles['code-block'], children: _jsx("code", { children: code }) }, `code-${blockIndex++}`));
        lastIndex = fenceMatch.index + fenceMatch[0].length;
    }
    let tail = text.slice(lastIndex);
    if (lastIndex > 0)
        tail = tail.replace(/^\n/, "");
    if (tail)
        nodes.push(...renderBlockLines(tail, ctx, `b${blockIndex++}`));
    return nodes;
}
// Emoji-only messages render jumbo (48px), like Discord — capped at 30.
function isEmojiOnly(text, emojiMap) {
    const trimmed = text.trim();
    if (!trimmed)
        return false;
    let count = 0;
    let rest = trimmed.replace(/<a?:\w+:\d+>/g, () => { count++; return ""; });
    rest = rest.replace(/:(\w+):/g, (full, name) => {
        if (emojiMap.has(name)) {
            count++;
            return "";
        }
        return full;
    });
    rest = rest.replace(/\p{Extended_Pictographic}/gu, () => { count++; return ""; });
    rest = rest.replace(/[\u{1F3FB}-\u{1F3FF}\u{1F1E6}-\u{1F1FF}\u200d\ufe0f\u20e3]/gu, "");
    return rest.trim().length === 0 && count > 0 && count <= 30;
}
// ── Format Discord message content ───────────────────────────────
function formatContent(content, cleanContent) {
    const text = cleanContent || content || "";
    const rawContent = content || "";
    if (!text)
        return null;
    // Map emoji names → ids from the raw content so cleanContent's
    // ":name:" forms resolve to CDN images.
    const emojiMap = new Map();
    let emojiMatch;
    CUSTOM_EMOJI_RE.lastIndex = 0;
    while ((emojiMatch = CUSTOM_EMOJI_RE.exec(rawContent)) !== null) {
        const [, animated, name, id] = emojiMatch;
        emojiMap.set(name, { animated: animated === "a", id, name });
    }
    const jumbo = isEmojiOnly(text, emojiMap);
    return (_jsx("span", { className: jumbo ? styles['message-jumbo'] : undefined, children: renderMarkdown(text, { emojiMap, jumbo }) }));
}
// ── Timestamps ───────────────────────────────────────────────────
function formatTimestamp(isoString) {
    const date = new Date(isoString);
    const now = new Date();
    const isToday = date.toDateString() === now.toDateString();
    const yesterday = new Date(now);
    yesterday.setDate(yesterday.getDate() - 1);
    const isYesterday = date.toDateString() === yesterday.toDateString();
    const time = date.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true });
    if (isToday)
        return `Today at ${time}`;
    if (isYesterday)
        return `Yesterday at ${time}`;
    return `${date.toLocaleDateString("en-US", { month: "2-digit", day: "2-digit", year: "numeric" })} ${time}`;
}
function formatShortTime(isoString) {
    return new Date(isoString).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true });
}
function formatDateSeparator(isoString) {
    return new Date(isoString).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
}
// ── Message grouping ─────────────────────────────────────────────
function shouldGroup(current, previous) {
    if (!previous)
        return false;
    // Replies always break grouping (matches real Discord behavior)
    if (current.replyTo)
        return false;
    if (current.author.id !== previous.author.id)
        return false;
    const diff = new Date(previous.createdAtISO).getTime() - new Date(current.createdAtISO).getTime();
    return Math.abs(diff) < 7 * 60 * 1000;
}
// Check if day changed
function isDifferentDay(messageA, messageB) {
    if (!messageA || !messageB)
        return true;
    return new Date(messageA.createdAtISO).toDateString() !== new Date(messageB.createdAtISO).toDateString();
}
// ── Tenor GIF Embed ──────────────────────────────────────────────
function TenorEmbed({ url, tenorOembedUrl }) {
    const [gifUrl, setGifUrl] = useState(null);
    const [error, setError] = useState(false);
    useEffect(() => {
        let cancelled = false;
        fetch(`${tenorOembedUrl}?url=${encodeURIComponent(url)}`)
            .then((response) => response.ok ? response.json() : Promise.reject())
            .then((data) => { if (!cancelled && data.gifUrl)
            setGifUrl(data.gifUrl); })
            .catch(() => { if (!cancelled)
            setError(true); });
        return () => { cancelled = true; };
    }, [url, tenorOembedUrl]);
    if (error)
        return null;
    if (!gifUrl)
        return _jsx("div", { className: styles['tenor-placeholder'], children: _jsx("div", { className: styles['tenor-spinner'] }) });
    return (_jsx("a", { href: url, target: "_blank", rel: "noopener noreferrer", className: styles['attachment-link'], children: _jsx("img", { src: gifUrl, alt: "Tenor GIF", className: styles['tenor-gif'], loading: "lazy" }) }));
}
function TenorEmbeds({ content, tenorOembedUrl }) {
    const urls = extractTenorUrls(content || "");
    if (!urls.length)
        return null;
    return _jsx("div", { className: styles['attachments'], children: urls.map((url, i) => _jsx(TenorEmbed, { url: url, tenorOembedUrl: tenorOembedUrl }, i)) });
}
// ── Image sizing ─────────────────────────────────────────────────
// Scale intrinsic dimensions down to fit the chat's max media box
// while preserving aspect ratio.
const MEDIA_MAX_WIDTH = 400;
const MEDIA_MAX_HEIGHT = 300;
function fitMediaDimensions(width, height) {
    let imageWidth = width || MEDIA_MAX_WIDTH;
    let imageHeight = height || MEDIA_MAX_HEIGHT;
    if (imageWidth > MEDIA_MAX_WIDTH) {
        imageHeight = Math.round(imageHeight * (MEDIA_MAX_WIDTH / imageWidth));
        imageWidth = MEDIA_MAX_WIDTH;
    }
    if (imageHeight > MEDIA_MAX_HEIGHT) {
        imageWidth = Math.round(imageWidth * (MEDIA_MAX_HEIGHT / imageHeight));
        imageHeight = MEDIA_MAX_HEIGHT;
    }
    return { width: imageWidth, height: imageHeight };
}
// ── Attachment classification ────────────────────────────────────
// Discord renders attachments by kind: images inline, videos with an
// inline player, voice messages with a waveform player, audio files
// as a file card with a player, and everything else as a file card.
const IMAGE_EXT_RE = /\.(png|jpe?g|gif|webp|avif)$/i;
const VIDEO_EXT_RE = /\.(mp4|webm|mov|m4v)$/i;
const AUDIO_EXT_RE = /\.(ogg|mp3|wav|m4a|flac|aac|opus)$/i;
function hasMediaUrl(attachment) {
    return Boolean(attachment.url || attachment.proxyURL);
}
function isImageAttachment(attachment) {
    if (attachment.contentType)
        return attachment.contentType.startsWith("image/");
    return IMAGE_EXT_RE.test(attachment.name || "");
}
function isVideoAttachment(attachment) {
    if (attachment.contentType)
        return attachment.contentType.startsWith("video/");
    return VIDEO_EXT_RE.test(attachment.name || "");
}
function isAudioAttachment(attachment) {
    if (attachment.contentType)
        return attachment.contentType.startsWith("audio/");
    return AUDIO_EXT_RE.test(attachment.name || "");
}
// Voice messages carry a waveform; a bare `duration` is NOT enough —
// video attachments also have durations.
function isVoiceMessage(attachment) {
    if (attachment.waveform)
        return true;
    return isAudioAttachment(attachment) && Boolean(attachment.duration);
}
function isSpoilerAttachment(attachment) {
    return attachment.spoiler === true || (attachment.name || "").startsWith("SPOILER_");
}
// ── Spoiler Wrapper ──────────────────────────────────────────────
// Blurs spoilered media behind a SPOILER pill until clicked,
// matching Discord's click-to-reveal behavior.
function MediaSpoiler({ spoiler, children }) {
    const [revealed, setRevealed] = useState(false);
    if (!spoiler)
        return _jsx(_Fragment, { children: children });
    return (_jsxs("div", { className: revealed ? styles['spoiler-media-revealed'] : styles['spoiler-media'], onClick: revealed ? undefined : (event) => { event.preventDefault(); setRevealed(true); }, role: revealed ? undefined : "button", title: revealed ? undefined : "Spoiler — click to reveal", children: [_jsx("div", { className: styles['spoiler-media-content'], children: children }), !revealed && _jsx("span", { className: styles['spoiler-pill'], children: "SPOILER" })] }));
}
// ── Image Attachments ────────────────────────────────────────────
function ImageAttachments({ attachments }) {
    if (!attachments?.length)
        return null;
    const images = attachments.filter((attachment) => isImageAttachment(attachment) && hasMediaUrl(attachment));
    if (!images.length)
        return null;
    return (_jsx("div", { className: styles['attachments'], children: images.map((image, i) => {
            const imageSource = image.proxyURL || image.url;
            const { width: imageWidth, height: imageHeight } = fitMediaDimensions(image.width, image.height);
            return (_jsx(MediaSpoiler, { spoiler: isSpoilerAttachment(image), children: _jsx("a", { href: image.url || imageSource, target: "_blank", rel: "noopener noreferrer", className: styles['attachment-link'], children: _jsx("img", { src: imageSource, alt: image.name || "attachment", width: imageWidth, height: imageHeight, className: styles['attachment-image'], loading: "lazy" }) }) }, i));
        }) }));
}
// ── Video Attachments ────────────────────────────────────────────
// Uploaded videos (mp4/webm/mov) get an inline player, matching
// Discord's native video attachment rendering.
function VideoAttachments({ attachments }) {
    if (!attachments?.length)
        return null;
    const videos = attachments.filter((attachment) => isVideoAttachment(attachment) && hasMediaUrl(attachment));
    if (!videos.length)
        return null;
    return (_jsx("div", { className: styles['attachments'], children: videos.map((video, i) => {
            const { width: videoWidth, height: videoHeight } = fitMediaDimensions(video.width, video.height);
            return (_jsx(MediaSpoiler, { spoiler: isSpoilerAttachment(video), children: _jsx("video", { src: video.proxyURL || video.url, className: styles['attachment-video'], width: videoWidth, height: videoHeight, controls: true, preload: "metadata", playsInline: true }) }, i));
        }) }));
}
// ── Voice Message Player ─────────────────────────────────────────
function decodeWaveform(base64Str) {
    if (!base64Str)
        return [];
    try {
        const binaryString = window.atob(base64Str);
        const binaryLength = binaryString.length;
        const bytes = new Uint8Array(binaryLength);
        for (let i = 0; i < binaryLength; i++) {
            bytes[i] = binaryString.charCodeAt(i);
        }
        return Array.from(bytes);
    }
    catch (error) {
        console.error("Failed to decode waveform:", error);
        return [];
    }
}
function getWaveformBars(base64Str, targetCount = 35) {
    let raw = [];
    if (base64Str) {
        raw = decodeWaveform(base64Str);
    }
    if (raw.length === 0) {
        for (let i = 0; i < targetCount; i++) {
            const angle = (i / targetCount) * Math.PI * 2;
            const height = Math.abs(Math.sin(angle) * 0.6 + Math.sin(angle * 3) * 0.3 + 0.1);
            raw.push(Math.round(height * 255));
        }
    }
    const resampled = [];
    const step = raw.length / targetCount;
    for (let i = 0; i < targetCount; i++) {
        const startIdx = Math.floor(i * step);
        const endIdx = Math.floor((i + 1) * step);
        let sum = 0;
        let count = 0;
        for (let j = startIdx; j < Math.max(startIdx + 1, endIdx); j++) {
            if (j < raw.length) {
                sum += raw[j];
                count++;
            }
        }
        resampled.push(count > 0 ? sum / count : 0);
    }
    const maximumValue = Math.max(...resampled, 1);
    return resampled.map((value) => Math.max(15, Math.round((value / maximumValue) * 100)));
}
function VoiceMessagePlayer({ attachment }) {
    const audioRef = useRef(null);
    const [playing, setPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(attachment.duration || 0);
    const [playbackRate, setPlaybackRate] = useState(1);
    const [muted, setMuted] = useState(false);
    const [bars] = useState(() => getWaveformBars(attachment.waveform, 38));
    const togglePlay = () => {
        const audio = audioRef.current;
        if (!audio)
            return;
        if (playing) {
            audio.pause();
        }
        else {
            audio.play().catch((error) => console.error("Playback error:", error));
        }
    };
    const handleTimeUpdate = () => {
        if (audioRef.current) {
            setCurrentTime(audioRef.current.currentTime);
        }
    };
    const handleLoadedMetadata = () => {
        if (audioRef.current) {
            setDuration(audioRef.current.duration || attachment.duration || 0);
        }
    };
    const handleAudioEnded = () => {
        setPlaying(false);
        setCurrentTime(0);
        if (audioRef.current) {
            audioRef.current.currentTime = 0;
        }
    };
    const cycleSpeed = () => {
        const nextRate = playbackRate === 1 ? 1.5 : playbackRate === 1.5 ? 2 : 1;
        setPlaybackRate(nextRate);
        if (audioRef.current) {
            audioRef.current.playbackRate = nextRate;
        }
    };
    const toggleMute = () => {
        const nextMuted = !muted;
        setMuted(nextMuted);
        if (audioRef.current) {
            audioRef.current.muted = nextMuted;
        }
    };
    const handleWaveformClick = (event) => {
        const audio = audioRef.current;
        if (!audio || !duration)
            return;
        const rect = event.currentTarget.getBoundingClientRect();
        const clickX = event.clientX - rect.left;
        const width = rect.width;
        const percentage = clamp(clickX / width, 0, 1);
        audio.currentTime = percentage * duration;
        setCurrentTime(audio.currentTime);
    };
    useEffect(() => {
        const audio = audioRef.current;
        if (!audio)
            return;
        const onPlay = () => setPlaying(true);
        const onPause = () => setPlaying(false);
        audio.addEventListener("play", onPlay);
        audio.addEventListener("pause", onPause);
        return () => {
            audio.removeEventListener("play", onPlay);
            audio.removeEventListener("pause", onPause);
        };
    }, []);
    const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;
    const activeBarIndex = Math.floor((progressPercent / 100) * bars.length);
    return (_jsxs("div", { className: styles['voice-player'], children: [_jsx("audio", { ref: audioRef, src: attachment.url, preload: "metadata", onTimeUpdate: handleTimeUpdate, onLoadedMetadata: handleLoadedMetadata, onEnded: handleAudioEnded }), _jsx("button", { className: styles['voice-play-button'], onClick: togglePlay, type: "button", children: playing ? (_jsxs("svg", { className: styles['voice-pause-icon'], viewBox: "0 0 24 24", children: [_jsx("rect", { x: "5", y: "4", width: "4", height: "16", rx: "1" }), _jsx("rect", { x: "15", y: "4", width: "4", height: "16", rx: "1" })] })) : (_jsx("svg", { className: styles['voice-play-icon'], viewBox: "0 0 24 24", children: _jsx("path", { d: "M8 5v14l11-7z" }) })) }), _jsx("div", { className: styles['voice-waveform'], onClick: handleWaveformClick, children: bars.map((height, barIndex) => {
                    const isPlayed = barIndex <= activeBarIndex;
                    return (_jsx("div", { className: `${styles['voice-waveform-bar']} ${isPlayed ? styles['voice-waveform-bar-played'] : ""}`, style: { "--bar-height": `${height}%` } }, barIndex));
                }) }), _jsx("span", { className: styles['voice-duration'], children: formatMediaTimestamp(playing ? currentTime : duration) }), _jsxs("button", { className: styles['voice-speed'], onClick: cycleSpeed, type: "button", children: [playbackRate, "X"] }), _jsx("button", { className: styles['voice-volume'], onClick: toggleMute, type: "button", children: muted ? (_jsx("svg", { className: styles['voice-volume-icon'], viewBox: "0 0 24 24", children: _jsx("path", { d: "M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.21.05-.42.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z" }) })) : (_jsx("svg", { className: styles['voice-volume-icon'], viewBox: "0 0 24 24", children: _jsx("path", { d: "M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z" }) })) })] }));
}
// Voice messages only — regular audio files render as file cards
// with a player (see FileAttachments), matching Discord.
function AudioAttachments({ attachments }) {
    if (!attachments?.length)
        return null;
    const voiceMessages = attachments.filter((attachment) => isVoiceMessage(attachment) && hasMediaUrl(attachment));
    if (!voiceMessages.length)
        return null;
    return (_jsx("div", { className: styles['attachments'], children: voiceMessages.map((audio, i) => (_jsx(VoiceMessagePlayer, { attachment: audio }, i))) }));
}
// ── File Attachments ─────────────────────────────────────────────
// Everything that isn't inline-renderable media gets a Discord-style
// file card: icon, filename (download link), and human-readable size.
// Non-voice audio files additionally embed a playback bar.
function formatFileSize(bytes) {
    if (!bytes || bytes <= 0)
        return "";
    const units = ["bytes", "KB", "MB", "GB"];
    let value = bytes;
    let unitIndex = 0;
    while (value >= 1024 && unitIndex < units.length - 1) {
        value /= 1024;
        unitIndex++;
    }
    return `${unitIndex === 0 ? value : value.toFixed(2)} ${units[unitIndex]}`;
}
function FileAttachments({ attachments }) {
    if (!attachments?.length)
        return null;
    const files = attachments.filter((attachment) => hasMediaUrl(attachment)
        && !isImageAttachment(attachment)
        && !isVideoAttachment(attachment)
        && !isVoiceMessage(attachment));
    if (!files.length)
        return null;
    return (_jsx("div", { className: styles['attachments'], children: files.map((file, i) => {
            const href = file.url || file.proxyURL;
            const sizeLabel = formatFileSize(file.size);
            return (_jsxs("div", { className: styles['file-card'], children: [_jsxs("div", { className: styles['file-card-row'], children: [_jsx("svg", { className: styles['file-icon'], viewBox: "0 0 24 24", fill: "currentColor", "aria-hidden": "true", children: _jsx("path", { d: "M6 2a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6H6zm7 1.5L18.5 9H13V3.5zM8 13h8v1.5H8V13zm0 4h8v1.5H8V17z" }) }), _jsxs("div", { className: styles['file-info'], children: [_jsx("a", { href: href, target: "_blank", rel: "noopener noreferrer", className: styles['file-name'], children: file.name || "Unknown file" }), sizeLabel && _jsx("span", { className: styles['file-size'], children: sizeLabel })] }), _jsx("a", { href: href, target: "_blank", rel: "noopener noreferrer", className: styles['file-download'], title: "Download", children: _jsx("svg", { viewBox: "0 0 24 24", fill: "currentColor", width: "20", height: "20", children: _jsx("path", { d: "M12 2a1 1 0 0 1 1 1v10.59l3.3-3.3a1 1 0 1 1 1.4 1.42l-5 5a1 1 0 0 1-1.4 0l-5-5a1 1 0 1 1 1.4-1.42l3.3 3.3V3a1 1 0 0 1 1-1zM4 19a1 1 0 0 1 1-1h14a1 1 0 1 1 0 2H5a1 1 0 0 1-1-1z" }) }) })] }), isAudioAttachment(file) && (_jsx("audio", { src: href, controls: true, preload: "metadata", className: styles['file-audio'] }))] }, i));
        }) }));
}
// ── Stickers ─────────────────────────────────────────────────────
// Discord stickers render as 160px images. Format 3 (Lottie JSON)
// can't be shown in an <img>, so it falls back to a labeled pill.
function stickerUrl(sticker) {
    if (sticker.format === 3)
        return null;
    if (sticker.url)
        return sticker.url;
    return discordStickerUrl(sticker.id, sticker.format ?? DISCORD_STICKER_FORMAT.png);
}
function Stickers({ stickers }) {
    if (!stickers?.length)
        return null;
    return (_jsx("div", { className: styles['attachments'], children: stickers.map((sticker) => {
            const url = stickerUrl(sticker);
            if (!url) {
                return (_jsx("div", { className: styles['sticker-fallback'], title: sticker.name, children: sticker.name || "Sticker" }, sticker.id));
            }
            return (_jsx("img", { src: url, alt: sticker.name || "Sticker", title: sticker.name, className: styles['sticker'], width: 160, height: 160, loading: "lazy", draggable: false }, sticker.id));
        }) }));
}
// ── Rich Embed Card (Discord link unfurl / Open Graph preview) ───
// Renders Discord-style embed cards with provider, title, description,
// thumbnail/image, and video. Matches the native Discord embed UI.
// Embed descriptions/fields render markdown with no message-level
// emoji map — raw <:name:id> tokens still resolve via their ids.
const EMBED_MARKDOWN_CTX = { emojiMap: new Map() };
function formatEmbedTimestamp(timestamp) {
    const date = new Date(timestamp);
    if (isNaN(date.getTime()))
        return "";
    return formatTimestamp(date.toISOString());
}
function EmbedMedia({ embeds }) {
    if (!embeds?.length)
        return null;
    // Skip non-object embeds (legacy string data), Tenor (handled separately),
    // and embeds with nothing renderable
    const filteredEmbeds = embeds.filter((embed) => typeof embed === "object" && embed !== null
        && (embed.title || embed.description || embed.provider || embed.author || embed.footer
            || embed.fields?.length || embed.image || embed.thumbnail || embed.video)
        && embed.provider?.name !== "Tenor"
        && !/tenor\.com/i.test(embed.url || ""));
    if (!filteredEmbeds.length)
        return null;
    return (_jsx("div", { className: styles['embed-list'], children: filteredEmbeds.map((embed, i) => {
            const hasMetadata = embed.title || embed.description || embed.provider
                || embed.author || embed.footer || embed.fields?.length;
            const hasThumbnailOnly = embed.thumbnail && !embed.image && !embed.video;
            const hasLargeImage = embed.image && !embed.video;
            const accentColor = embed.color
                ? `#${embed.color.toString(16).padStart(6, "0")}`
                : null;
            // Pure image/gif embeds with NO metadata → render as simple attachment
            if (!hasMetadata && (embed.image || embed.thumbnail)) {
                const imageSource = embed.image?.url || embed.image?.proxyURL
                    || embed.thumbnail?.url || embed.thumbnail?.proxyURL;
                if (!imageSource)
                    return null;
                const imgMeta = embed.image || embed.thumbnail;
                if (!imgMeta)
                    return null;
                const { width: imageWidth, height: imageHeight } = fitMediaDimensions(imgMeta.width, imgMeta.height);
                return (_jsx("a", { href: embed.url || imageSource, target: "_blank", rel: "noopener noreferrer", className: styles['attachment-link'], children: _jsx("img", { src: imageSource, alt: embed.title || "embed", width: imageWidth, height: imageHeight, className: styles['attachment-image'], loading: "lazy" }) }, i));
            }
            // Pure video embeds with NO metadata → render inline or thumbnail
            if (!hasMetadata && embed.video) {
                return _jsx(EmbedVideo, { embed: embed }, i);
            }
            // ── Rich embed card ───────────────────────────────────
            return (_jsxs("div", { className: styles['embed-card'], style: accentColor ? { borderLeftColor: accentColor } : undefined, children: [_jsxs("div", { className: hasThumbnailOnly ? styles['embed-card-body-inline'] : styles['embed-card-body'], children: [_jsxs("div", { className: styles['embed-card-text'], children: [embed.provider?.name && (_jsx("span", { className: styles['embed-provider'], children: embed.provider.name })), embed.author?.name && (_jsxs("span", { className: styles['embed-author'], children: [(embed.author.iconURL || embed.author.proxyIconURL) && (_jsx("img", { src: embed.author.proxyIconURL || embed.author.iconURL, alt: "", className: styles['embed-author-icon'], loading: "lazy", draggable: false })), embed.author.url ? (_jsx("a", { href: embed.author.url, target: "_blank", rel: "noopener noreferrer", className: styles['embed-author-name'], children: embed.author.name })) : (_jsx("span", { className: styles['embed-author-name'], children: embed.author.name }))] })), embed.title && (embed.url ? (_jsx("a", { href: embed.url, target: "_blank", rel: "noopener noreferrer", className: styles['embed-title'], children: embed.title })) : (_jsx("span", { className: styles['embed-title-plain'], children: embed.title }))), embed.description && (_jsx("div", { className: styles['embed-description'], children: renderMarkdown(embed.description, EMBED_MARKDOWN_CTX) })), embed.fields && embed.fields.length > 0 && (_jsx("div", { className: styles['embed-fields'], children: embed.fields.map((field, fieldIndex) => (_jsxs("div", { className: field.inline ? styles['embed-field-inline'] : styles['embed-field'], children: [_jsx("div", { className: styles['embed-field-name'], children: parseInline(field.name || "", EMBED_MARKDOWN_CTX, `f${fieldIndex}`) }), _jsx("div", { className: styles['embed-field-value'], children: renderMarkdown(field.value || "", EMBED_MARKDOWN_CTX) })] }, fieldIndex))) }))] }), hasThumbnailOnly && embed.thumbnail?.url && (_jsx("a", { href: embed.url || embed.thumbnail.url, target: "_blank", rel: "noopener noreferrer", className: styles['embed-thumb-link'], children: _jsx("img", { src: embed.thumbnail.proxyURL || embed.thumbnail.url, alt: embed.title || "thumbnail", className: styles['embed-thumb'], loading: "lazy" }) }))] }), hasLargeImage && embed.image && (() => {
                        const imageSource = embed.image.proxyURL || embed.image.url;
                        const { width: imageWidth, height: imageHeight } = fitMediaDimensions(embed.image.width, embed.image.height);
                        return (_jsx("a", { href: embed.url || imageSource, target: "_blank", rel: "noopener noreferrer", className: styles['embed-image-link'], children: _jsx("img", { src: imageSource, alt: embed.title || "embed image", width: imageWidth, height: imageHeight, className: styles['embed-image'], loading: "lazy" }) }));
                    })(), embed.video && _jsx(EmbedVideo, { embed: embed }), (embed.footer?.text || embed.timestamp) && (_jsxs("div", { className: styles['embed-footer'], children: [(embed.footer?.iconURL || embed.footer?.proxyIconURL) && (_jsx("img", { src: embed.footer.proxyIconURL || embed.footer.iconURL, alt: "", className: styles['embed-footer-icon'], loading: "lazy", draggable: false })), _jsxs("span", { className: styles['embed-footer-text'], children: [embed.footer?.text, embed.footer?.text && embed.timestamp ? " • " : "", embed.timestamp ? formatEmbedTimestamp(embed.timestamp) : ""] })] }))] }, i));
        }) }));
}
// ── Embed Video Sub-Component ────────────────────────────────────
function EmbedVideo({ embed }) {
    const poster = embed.thumbnail?.url || embed.thumbnail?.proxyURL || null;
    const videoUrl = embed.video?.url || embed.video?.proxyURL;
    const isDirectVideo = videoUrl && /\.(mp4|webm|mov)(\?|$)/i.test(videoUrl);
    if (isDirectVideo) {
        return (_jsx("div", { className: styles['embed-video-wrap'], children: _jsx("video", { src: videoUrl, poster: poster || undefined, className: styles['embed-video'], controls: true, preload: "metadata", loop: true, muted: true, autoPlay: true, playsInline: true }) }));
    }
    if (poster) {
        return (_jsxs("a", { href: embed.url || videoUrl || undefined, target: "_blank", rel: "noopener noreferrer", className: styles['embed-video-thumb-link'], children: [_jsx("img", { src: poster, alt: embed.title || "Video", className: styles['embed-video-thumb'], loading: "lazy" }), _jsx("span", { className: styles['embed-play-button'], children: "\u25B6" })] }));
    }
    return null;
}
// ── Reply Context Bar ────────────────────────────────────────────
// Renders a compact bar above the message showing who the user
// replied to, their avatar, and a truncated snippet of the
// referenced message — matching Discord's native reply UI.
function ReplyContext({ replyTo, messageMap }) {
    const messageReference = messageMap?.get(replyTo);
    if (!messageReference) {
        // Referenced message is outside the loaded window — show fallback
        return (_jsxs(_Fragment, { children: [_jsx("div", { className: styles['reply-spine'] }), _jsx("div", { className: styles['reply-bar'], children: _jsx("span", { className: styles['reply-content'], children: _jsx("span", { className: styles['reply-unknown'], children: "Original message was deleted or is not loaded" }) }) })] }));
    }
    const nameStyle = resolveRoleColorStyle(messageReference.author);
    const snippet = messageReference.content || messageReference.cleanContent || "";
    const truncated = snippet.length > 80 ? snippet.slice(0, 77) + "…" : snippet;
    const hasAttachment = (messageReference.attachments && messageReference.attachments.length > 0)
        || (messageReference.embeds && messageReference.embeds.length > 0)
        || (messageReference.stickers && messageReference.stickers.length > 0);
    return (_jsxs(_Fragment, { children: [_jsx("div", { className: styles['reply-spine'] }), _jsxs("div", { className: styles['reply-bar'], children: [messageReference.author.avatarUrl ? (_jsx("img", { src: messageReference.author.avatarUrl, alt: "", className: styles['reply-avatar'], loading: "lazy" })) : (_jsx("div", { className: styles['reply-avatar-fallback'], style: { background: getAvatarColor(messageReference.author.id) }, children: (messageReference.author.displayName || "?")[0].toUpperCase() })), messageReference.author.isBot && (_jsxs("span", { className: styles['reply-bot-badge'], children: [_jsx("svg", { className: styles['bot-badge-icon'], viewBox: "0 0 16 16", fill: "currentColor", children: _jsx("path", { d: "M7.4,11.17,4,8.62,5,7.26l2,1.53L10.64,4l1.36,1Z" }) }), "APP"] })), _jsxs("span", { className: styles['reply-author'], style: nameStyle, children: ["@", messageReference.author.displayName] }), _jsx("span", { className: styles['reply-content'], children: truncated || (hasAttachment ? _jsxs(_Fragment, { children: ["Click to see attachment ", _jsx("span", { "aria-hidden": "true", children: "\uD83D\uDDBC\uFE0F" })] }) : "…") })] })] }));
}
// ── Comprehensive Unicode Emojis for the picker (categorized) ────
const EMOJI_CATEGORIES = [
    { id: "frequent", name: "Frequently Used", icon: "🕐", emojis: [
            "👍", "👎", "❤️", "😂", "😮", "😢", "😡", "🔥", "🎉", "✅", "👀", "💯", "🙏", "💀", "🤣", "😭", "🥺", "😤", "🤔", "👏", "💪", "🫡", "🤡", "💩",
        ] },
    { id: "people", name: "People & Faces", icon: "😀", emojis: [
            "😀", "😃", "😄", "😁", "😆", "😅", "🤣", "😂", "🙂", "🙃", "🫠", "😉", "😊", "😇", "🥰", "😍", "🤩", "😘", "😗", "😚", "😙", "🥲", "😋", "😛", "😜", "🤪", "😝", "🤑", "🤗", "🤭", "🫢", "🫣", "🤫", "🤔", "🫡", "🤐", "🤨", "😐", "😑", "😶", "🫥", "😏", "😒", "🙄", "😬", "🤥", "😌", "😔", "😪", "🤤", "😴", "😷", "🤒", "🤕", "🤢", "🤮", "🥵", "🥶", "🥴", "😵", "🤯", "🤠", "🥳", "🥸", "😎", "🤓", "🧐", "😕", "🫤", "😟", "🙁", "😮", "😯", "😲", "😳", "🥺", "🥹", "😦", "😧", "😨", "😰", "😥", "😢", "😭", "😱", "😖", "😣", "😞", "😓", "😩", "😫", "🥱", "😤", "😡", "😠", "🤬", "😈", "👿", "💀", "☠️", "💩", "🤡", "👹", "👺", "👻", "👽", "👾", "🤖", "😺", "😸", "😹", "😻", "😼", "😽", "🙀", "😿", "😾", "🙈", "🙉", "🙊", "💌", "💘", "💝", "💖", "💗", "💓", "💞", "💕", "💟", "❣️", "💔", "❤️‍🔥", "❤️‍🩹", "❤️", "🩷", "🧡", "💛", "💚", "💙", "🩵", "💜", "🤎", "🖤", "🩶", "🤍", "👋", "🤚", "🖐️", "✋", "🖖", "🫱", "🫲", "🫳", "🫴", "🫷", "🫸", "👌", "🤌", "🤏", "✌️", "🤞", "🫰", "🤟", "🤘", "🤙", "👈", "👉", "👆", "🖕", "👇", "☝️", "🫵", "👍", "👎", "✊", "👊", "🤛", "🤜", "👏", "🙌", "🫶", "👐", "🤲", "🤝", "🙏", "✍️", "💅", "🤳", "💪", "🦾", "🦿", "🦵", "🦶", "👂", "🦻", "👃", "🧠", "🫀", "🫁", "🦷", "🦴", "👀", "👁️", "👅", "👄", "🫦", "👶", "🧒", "👦", "👧", "🧑", "👱", "👨", "🧔", "👩", "🧓", "👴", "👵",
        ] },
    { id: "nature", name: "Nature", icon: "🌿", emojis: [
            "🐶", "🐱", "🐭", "🐹", "🐰", "🦊", "🐻", "🐼", "🐻‍❄️", "🐨", "🐯", "🦁", "🐮", "🐷", "🐽", "🐸", "🐵", "🙈", "🙉", "🙊", "🐒", "🐔", "🐧", "🐦", "🐤", "🐣", "🐥", "🦆", "🦅", "🦉", "🦇", "🐺", "🐗", "🐴", "🦄", "🫎", "🐝", "🪱", "🐛", "🦋", "🐌", "🐞", "🐜", "🪲", "🪳", "🦟", "🦗", "🕷️", "🦂", "🐢", "🐍", "🦎", "🦖", "🦕", "🐙", "🦑", "🦐", "🦞", "🦀", "🐡", "🐠", "🐟", "🐬", "🐳", "🐋", "🦈", "🪸", "🐊", "🐅", "🐆", "🦓", "🫏", "🦍", "🦧", "🐘", "🦛", "🦏", "🐪", "🐫", "🦒", "🦘", "🦬", "🐃", "🐂", "🐄", "🐎", "🐖", "🐏", "🐑", "🦙", "🐐", "🦌", "🐕", "🐩", "🦮", "🐕‍🦺", "🐈", "🐈‍⬛", "🪶", "🐓", "🦃", "🦤", "🦚", "🦜", "🦢", "🪿", "🦩", "🕊️", "🐇", "🦝", "🦨", "🦡", "🦫", "🦦", "🦥", "🐁", "🐀", "🐿️", "🦔", "🐾", "🐉", "🐲", "🌵", "🎄", "🌲", "🌳", "🌴", "🪵", "🌱", "🌿", "☘️", "🍀", "🎍", "🪴", "🎋", "🍃", "🍂", "🍁", "🪺", "🪹", "🍄", "🌾", "💐", "🌷", "🌹", "🥀", "🌺", "🌸", "🌼", "🌻", "🌞", "🌝", "🌛", "🌜", "🌚", "🌕", "🌖", "🌗", "🌘", "🌑", "🌒", "🌓", "🌔", "🌙", "🌎", "🌍", "🌏", "🪐", "💫", "⭐", "🌟", "✨", "⚡", "☄️", "💥", "🔥", "🌪️", "🌈", "☀️", "🌤️", "⛅", "🌥️", "☁️", "🌦️", "🌧️", "⛈️", "🌩️", "🌨️", "❄️", "☃️", "⛄", "🌬️", "💨", "💧", "💦", "🫧", "☔", "☂️", "🌊", "🌫️",
        ] },
    { id: "food", name: "Food & Drink", icon: "🍔", emojis: [
            "🍇", "🍈", "🍉", "🍊", "🍋", "🍌", "🍍", "🥭", "🍎", "🍏", "🍐", "🍑", "🍒", "🍓", "🫐", "🥝", "🍅", "🫒", "🥥", "🥑", "🍆", "🥔", "🥕", "🌽", "🌶️", "🫑", "🥒", "🥬", "🥦", "🧄", "🧅", "🍄", "🥜", "🫘", "🌰", "🍞", "🥐", "🥖", "🫓", "🥨", "🥯", "🥞", "🧇", "🧀", "🍖", "🍗", "🥩", "🥓", "🍔", "🍟", "🍕", "🌭", "🥪", "🌮", "🌯", "🫔", "🥙", "🧆", "🥚", "🍳", "🥘", "🍲", "🫕", "🥣", "🥗", "🍿", "🧈", "🧂", "🥫", "🍱", "🍘", "🍙", "🍚", "🍛", "🍜", "🍝", "🍠", "🍢", "🍣", "🍤", "🍥", "🥮", "🍡", "🥟", "🥠", "🥡", "🦀", "🦞", "🦐", "🦑", "🦪", "🍦", "🍧", "🍨", "🍩", "🍪", "🎂", "🍰", "🧁", "🥧", "🍫", "🍬", "🍭", "🍮", "🍯", "🍼", "🥛", "☕", "🫖", "🍵", "🍶", "🍾", "🍷", "🍸", "🍹", "🍺", "🍻", "🥂", "🥃", "🫗", "🥤", "🧋", "🧃", "🧉", "🧊",
        ] },
    { id: "activities", name: "Activities", icon: "⚽", emojis: [
            "⚽", "🏀", "🏈", "⚾", "🥎", "🎾", "🏐", "🏉", "🥏", "🎱", "🪀", "🏓", "🏸", "🏒", "🏑", "🥍", "🏏", "🪃", "🥅", "⛳", "🪁", "🏹", "🎣", "🤿", "🥊", "🥋", "🎽", "🛹", "🛼", "🛷", "⛸️", "🥌", "🎿", "⛷️", "🏂", "🪂", "🏋️", "🤼", "🤸", "🤺", "⛹️", "🤾", "🏌️", "🏇", "🧘", "🏄", "🏊", "🤽", "🚣", "🧗", "🚵", "🚴", "🏆", "🥇", "🥈", "🥉", "🏅", "🎖️", "🏵️", "🎗️", "🎪", "🤹", "🎭", "🩰", "🎨", "🎬", "🎤", "🎧", "🎼", "🎹", "🥁", "🪘", "🎷", "🎺", "🪗", "🎸", "🪕", "🎻", "🪈", "🎲", "♟️", "🎯", "🎳", "🎮", "🕹️", "🎰",
        ] },
    { id: "travel", name: "Travel & Places", icon: "✈️", emojis: [
            "🚗", "🚕", "🚙", "🚌", "🚎", "🏎️", "🚓", "🚑", "🚒", "🚐", "🛻", "🚚", "🚛", "🚜", "🏍️", "🛵", "🦽", "🦼", "🛺", "🚲", "🛴", "🛹", "🛼", "🚏", "🛣️", "🛤️", "🛞", "⛽", "🛟", "🚨", "🚥", "🚦", "🛑", "🚧", "⚓", "🛟", "⛵", "🛶", "🚤", "🛳️", "⛴️", "🛥️", "🚢", "✈️", "🛩️", "🛫", "🛬", "🪂", "💺", "🚁", "🚟", "🚠", "🚡", "🛰️", "🚀", "🛸", "🛎️", "🧳", "⏰", "🕐", "🕑", "🕒", "🕓", "🕔", "🕕", "🕖", "🕗", "🕘", "🕙", "🕚", "🕛", "🌑", "🌒", "🌓", "🌔", "🌕", "🌖", "🌗", "🌘", "🌙", "🌚", "🌛", "🌜", "☀️", "🌝", "🌞", "⭐", "🌟", "🌠", "🏠", "🏡", "🏢", "🏣", "🏤", "🏥", "🏦", "🏨", "🏩", "🏪", "🏫", "🏬", "🏭", "🏯", "🏰", "💒", "🗼", "🗽", "⛪", "🕌", "🛕", "🕍", "⛩️", "🕋", "⛲", "⛺", "🌁", "🌃", "🏙️", "🌄", "🌅", "🌆", "🌇", "🌉", "♨️", "🎠", "🛝", "🎡", "🎢", "💈", "🎪", "🗺️", "🧭", "🏔️", "⛰️", "🌋", "🗻", "🏕️", "🏖️", "🏜️", "🏝️", "🏞️",
        ] },
    { id: "objects", name: "Objects", icon: "💡", emojis: [
            "⌚", "📱", "📲", "💻", "⌨️", "🖥️", "🖨️", "🖱️", "🖲️", "🕹️", "🗜️", "💾", "💿", "📀", "📼", "📷", "📸", "📹", "🎥", "📽️", "🎞️", "📞", "☎️", "📟", "📠", "📺", "📻", "🎙️", "🎚️", "🎛️", "🧭", "⏱️", "⏲️", "⏰", "🕰️", "⌛", "⏳", "📡", "🔋", "🪫", "🔌", "💡", "🔦", "🕯️", "🪔", "🧯", "🛢️", "💸", "💵", "💴", "💶", "💷", "🪙", "💰", "💳", "🪪", "💎", "⚖️", "🪜", "🧰", "🪛", "🔧", "🔨", "⚒️", "🛠️", "⛏️", "🪚", "🔩", "⚙️", "🪤", "🧱", "⛓️", "🧲", "🔫", "💣", "🧨", "🪓", "🔪", "🗡️", "⚔️", "🛡️", "🚬", "⚰️", "🪦", "⚱️", "🏺", "🔮", "📿", "🧿", "🪬", "💈", "⚗️", "🔭", "🔬", "🕳️", "🩹", "🩺", "🩻", "🩼", "💊", "💉", "🩸", "🧬", "🦠", "🧫", "🧪", "🌡️", "🧹", "🪠", "🧺", "🧻", "🪣", "🧼", "🫧", "🪥", "🧽", "🧴", "🛎️", "🔑", "🗝️", "🚪", "🪑", "🛋️", "🛏️", "🛌", "🧸", "🪆", "🖼️", "🪞", "🪟", "🛍️", "🛒", "🎁", "🎈", "🎏", "🎀", "🪄", "🪅", "🎊", "🎉", "🎎", "🏮", "🎐", "🧧", "✉️", "📩", "📨", "📧", "💌", "📥", "📤", "📦", "🏷️", "🪧", "📪", "📫", "📬", "📭", "📮", "📯", "📜", "📃", "📄", "📑", "🧾", "📊", "📈", "📉", "🗒️", "🗓️", "📆", "📅", "🗑️", "📇", "🗃️", "🗳️", "🗄️", "📋", "📁", "📂", "🗂️", "🗞️", "📰", "📓", "📔", "📒", "📕", "📗", "📘", "📙", "📚", "📖", "🔖", "🧷", "🔗", "📎", "🖇️", "📐", "📏", "🧮", "📌", "📍", "✂️", "🖊️", "🖋️", "✒️", "🖌️", "🖍️", "📝", "✏️", "🔍", "🔎", "🔏", "🔐", "🔒", "🔓",
        ] },
    { id: "symbols", name: "Symbols", icon: "💠", emojis: [
            "❤️", "🧡", "💛", "💚", "💙", "💜", "🖤", "🤍", "🤎", "💔", "❤️‍🔥", "❤️‍🩹", "❣️", "💕", "💞", "💓", "💗", "💖", "💘", "💝", "💟", "☮️", "✝️", "☪️", "🕉️", "☸️", "✡️", "🔯", "🕎", "☯️", "☦️", "🛐", "⛎", "♈", "♉", "♊", "♋", "♌", "♍", "♎", "♏", "♐", "♑", "♒", "♓", "🆔", "⚛️", "🉑", "☢️", "☣️", "📴", "📳", "🈶", "🈚", "🈸", "🈺", "🈷️", "✴️", "🆚", "💮", "🉐", "㊙️", "㊗️", "🈴", "🈵", "🈹", "🈲", "🅰️", "🅱️", "🆎", "🆑", "🅾️", "🆘", "❌", "⭕", "🛑", "⛔", "📛", "🚫", "💯", "💢", "♨️", "🚷", "🚯", "🚳", "🚱", "🔞", "📵", "🚭", "❗", "❕", "❓", "❔", "‼️", "⁉️", "🔅", "🔆", "〽️", "⚠️", "🚸", "🔱", "⚜️", "🔰", "♻️", "✅", "🈯", "💹", "❇️", "✳️", "❎", "🌐", "💠", "Ⓜ️", "🌀", "💤", "🏧", "🚾", "♿", "🅿️", "🛗", "🈳", "🈂️", "🛂", "🛃", "🛄", "🛅", "🚹", "🚺", "🚼", "⚧️", "🚻", "🚮", "🎦", "📶", "🈁", "🔣", "ℹ️", "🔤", "🔡", "🔠", "🆖", "🆗", "🆙", "🆒", "🆕", "🆓", "0️⃣", "1️⃣", "2️⃣", "3️⃣", "4️⃣", "5️⃣", "6️⃣", "7️⃣", "8️⃣", "9️⃣", "🔟", "🔢", "#️⃣", "*️⃣", "⏏️", "▶️", "⏸️", "⏯️", "⏹️", "⏺️", "⏭️", "⏮️", "⏩", "⏪", "⏫", "⏬", "◀️", "🔼", "🔽", "➡️", "⬅️", "⬆️", "⬇️", "↗️", "↘️", "↙️", "↖️", "↕️", "↔️", "↪️", "↩️", "⤴️", "⤵️", "🔀", "🔁", "🔂", "🔄", "🔃", "🎵", "🎶", "➕", "➖", "➗", "✖️", "🟰", "♾️", "💲", "💱", "™️", "©️", "®️", "〰️", "➰", "➿", "🔚", "🔙", "🔛", "🔝", "🔜", "✔️", "☑️", "🔘", "🔴", "🟠", "🟡", "🟢", "🔵", "🟣", "⚫", "⚪", "🟤", "🔺", "🔻", "🔸", "🔹", "🔶", "🔷", "🔳", "🔲", "▪️", "▫️", "◾", "◽", "◼️", "◻️", "🟥", "🟧", "🟨", "🟩", "🟦", "🟪", "⬛", "⬜", "🟫", "🔈", "🔇", "🔉", "🔊", "🔔", "🔕", "📣", "📢", "👁️‍🗨️", "💬", "💭", "🗯️", "♠️", "♣️", "♥️", "♦️", "🃏", "🎴", "🀄",
        ] },
    { id: "flags", name: "Flags", icon: "🏳️", emojis: [
            "🏁", "🚩", "🎌", "🏴", "🏳️", "🏳️‍🌈", "🏳️‍⚧️", "🏴‍☠️", "🇺🇸", "🇬🇧", "🇨🇦", "🇦🇺", "🇩🇪", "🇫🇷", "🇪🇸", "🇮🇹", "🇯🇵", "🇰🇷", "🇨🇳", "🇷🇺", "🇧🇷", "🇲🇽", "🇮🇳", "🇳🇱", "🇸🇪", "🇳🇴", "🇩🇰", "🇫🇮", "🇵🇱", "🇹🇷", "🇦🇷", "🇨🇱", "🇨🇴", "🇵🇪", "🇻🇪", "🇨🇺", "🇵🇷", "🇺🇦", "🇮🇱", "🇸🇦", "🇦🇪", "🇪🇬", "🇿🇦", "🇳🇬", "🇰🇪", "🇬🇭", "🇹🇭", "🇻🇳", "🇮🇩", "🇵🇭", "🇲🇾", "🇸🇬", "🇳🇿", "🇵🇹", "🇬🇷", "🇨🇿", "🇦🇹", "🇨🇭", "🇧🇪", "🇮🇪", "🇭🇺", "🇷🇴",
        ] },
];
// ── localStorage helpers for reaction dedup ──────────────────────
const REACT_STORAGE_KEY = "discord-reactions";
const REACT_MAX_ENTRIES = 500;
function loadReactedSet() {
    try {
        const raw = localStorage.getItem(REACT_STORAGE_KEY);
        return raw ? new Set(JSON.parse(raw)) : new Set();
    }
    catch {
        return new Set();
    }
}
function persistReactedSet(set) {
    try {
        let array = Array.from(set);
        // FIFO eviction if over limit
        if (array.length > REACT_MAX_ENTRIES) {
            array = array.slice(array.length - REACT_MAX_ENTRIES);
        }
        localStorage.setItem(REACT_STORAGE_KEY, JSON.stringify(array));
    }
    catch {
        // localStorage full or unavailable — silent
    }
}
function buildReactKey(messageId, emoji) {
    // For custom emojis the identifier is "name:id", for Unicode it's the char
    return `${messageId}:${emoji}`;
}
function EmojiPicker({ anchorRef, serverEmojis, onSelect, onClose }) {
    const pickerRef = useRef(null);
    const searchRef = useRef(null);
    const bodyRef = useRef(null);
    const [filter, setFilter] = useState("");
    const [activeCategory, setActiveCategory] = useState(serverEmojis?.length ? "server" : "frequent");
    // Auto-focus the search input when picker opens
    useEffect(() => {
        searchRef.current?.focus();
    }, []);
    // Position the picker above the anchor (Discord-style)
    useEffect(() => {
        const anchor = anchorRef;
        const picker = pickerRef.current;
        if (!anchor || !picker)
            return;
        const rect = anchor.getBoundingClientRect();
        const pickerH = picker.offsetHeight || 460;
        // Position above the trigger
        let top = rect.top - pickerH - 8;
        // If it goes off-screen top, position below instead
        if (top < 8)
            top = rect.bottom + 8;
        picker.style.top = `${top}px`;
        picker.style.right = `${window.innerWidth - rect.right}px`;
        picker.style.left = "auto";
        // Ensure it doesn't go off-screen left
        const pickerRect = picker.getBoundingClientRect();
        if (pickerRect.left < 8) {
            picker.style.right = "auto";
            picker.style.left = "8px";
        }
    }, [anchorRef]);
    const lowerFilter = filter.toLowerCase();
    // Build all category tabs (server emojis first, if present)
    const allCategories = [];
    if (serverEmojis?.length) {
        allCategories.push({ id: "server", name: "Server Emojis", icon: "🏠" });
    }
    for (const category of EMOJI_CATEGORIES) {
        allCategories.push(category);
    }
    // Filter server emojis
    const filteredCustom = serverEmojis
        ? serverEmojis.filter((emoji) => !filter || emoji.name.toLowerCase().includes(lowerFilter))
        : [];
    // Scroll to a category section
    const scrollToCategory = (catId) => {
        setActiveCategory(catId);
        if (filter)
            setFilter(""); // clear search when clicking a category
        const element = bodyRef.current?.querySelector(`[data-category="${catId}"]`);
        if (element)
            element.scrollIntoView({ behavior: "smooth", block: "start" });
    };
    // When searching, show filtered results from all categories
    const isSearching = filter.length > 0;
    return (_jsxs(_Fragment, { children: [_jsx("div", { className: styles['emoji-picker-overlay'], onClick: onClose }), _jsxs("div", { className: styles['emoji-picker'], ref: pickerRef, children: [_jsx("input", { ref: searchRef, className: styles['emoji-picker-search'], type: "text", placeholder: "Search emojis\u2026", value: filter, onChange: (event) => setFilter(event.target.value) }), _jsxs("div", { className: styles['emoji-picker-main'], children: [_jsx("div", { className: styles['emoji-category-sidebar'], children: allCategories.map((cat) => (_jsx("button", { className: `${styles['emoji-category-tab']} ${activeCategory === cat.id ? styles['emoji-category-tab-active'] : ""}`, type: "button", onClick: () => scrollToCategory(cat.id), title: cat.name, children: cat.id === "server" && serverEmojis && serverEmojis[0] ? (_jsx("img", { src: emojiUrl(serverEmojis[0].id, serverEmojis[0].animated), alt: "", className: styles['emoji-category-tab-img'], draggable: false })) : (_jsx("span", { children: cat.icon })) }, cat.id))) }), _jsx("div", { className: styles['emoji-picker-body'], ref: bodyRef, children: isSearching ? (_jsxs(_Fragment, { children: [filteredCustom.length > 0 && (_jsxs(_Fragment, { children: [_jsx("div", { className: styles['emoji-picker-section'], children: "Server Emojis" }), _jsx("div", { className: styles['emoji-picker-grid'], children: filteredCustom.map((emoji) => (_jsx("button", { className: styles['emoji-picker-item'], type: "button", onClick: () => onSelect(`${emoji.name}:${emoji.id}`), title: `:${emoji.name}:`, children: _jsx("img", { src: emojiUrl(emoji.id, emoji.animated), alt: `:${emoji.name}:`, className: styles['emoji-picker-custom-img'], draggable: false, loading: "lazy" }) }, emoji.id))) })] })), EMOJI_CATEGORIES.map((cat) => (_jsxs("div", { children: [_jsx("div", { className: styles['emoji-picker-section'], children: cat.name }), _jsx("div", { className: styles['emoji-picker-grid'], children: cat.emojis.map((emoji) => (_jsx("button", { className: styles['emoji-picker-item'], type: "button", onClick: () => onSelect(emoji), title: emoji, children: emoji }, emoji))) })] }, cat.id))), filteredCustom.length === 0 && (_jsx("div", { className: styles['emoji-picker-empty'], children: "No matching emojis found" }))] })) : (_jsxs(_Fragment, { children: [serverEmojis && serverEmojis.length > 0 && (_jsxs("div", { "data-category": "server", children: [_jsx("div", { className: styles['emoji-picker-section'], children: "Server Emojis" }), _jsx("div", { className: styles['emoji-picker-grid'], children: serverEmojis.map((emoji) => (_jsx("button", { className: styles['emoji-picker-item'], type: "button", onClick: () => onSelect(`${emoji.name}:${emoji.id}`), title: `:${emoji.name}:`, children: _jsx("img", { src: emojiUrl(emoji.id, emoji.animated), alt: `:${emoji.name}:`, className: styles['emoji-picker-custom-img'], draggable: false, loading: "lazy" }) }, emoji.id))) })] })), EMOJI_CATEGORIES.map((cat) => (_jsxs("div", { "data-category": cat.id, children: [_jsx("div", { className: styles['emoji-picker-section'], children: cat.name }), _jsx("div", { className: styles['emoji-picker-grid'], children: cat.emojis.map((emoji) => (_jsx("button", { className: styles['emoji-picker-item'], type: "button", onClick: () => onSelect(emoji), title: emoji, children: emoji }, emoji))) })] }, cat.id)))] })) })] })] })] }));
}
function MessageActions({ messageId, onOpenPicker, pickerMessageId }) {
    const btnRef = useRef(null);
    const isPickerOpen = pickerMessageId === messageId;
    return (_jsx("div", { className: `${styles['message-actions']} ${isPickerOpen ? styles['message-actions-visible'] : ""}`, children: _jsx("button", { ref: btnRef, className: styles['action-button'], type: "button", onClick: () => onOpenPicker(messageId, btnRef), title: "Add Reaction", children: "\uD83D\uDE00" }) }));
}
function Reactions({ reactions, messageId, reactedSet, onReact }) {
    // Show nothing if no existing reactions
    if (!reactions?.length)
        return null;
    return (_jsx("div", { className: styles['reactions'], children: reactions.map((reaction, i) => {
            const emoji = reaction.emoji;
            const emojiIdentifier = emoji.id ? `${emoji.name}:${emoji.id}` : emoji.name;
            const reactKey = buildReactKey(messageId, emojiIdentifier);
            // Treat as "already reacted" if either the user clicked it this session
            // (localStorage) OR the bot already holds this reaction (`reaction.me`).
            const hasReacted = reactedSet?.has(reactKey) || reaction.me === true;
            const pillClass = hasReacted ? styles['reaction-pill-reacted'] : styles['reaction-pill'];
            // Custom server emoji → CDN image
            if (emoji.id) {
                return (_jsxs("button", { className: pillClass, type: "button", onClick: () => !hasReacted && onReact?.(messageId, emojiIdentifier), title: hasReacted ? "You reacted" : `:${emoji.name}:`, children: [_jsx("img", { src: emojiUrl(emoji.id, emoji.animated), alt: `:${emoji.name}:`, className: styles['reaction-emoji'], loading: "lazy", draggable: false }), _jsx("span", { className: styles['reaction-count'], children: reaction.count })] }, `${emoji.id}-${i}`));
            }
            // Unicode emoji
            return (_jsxs("button", { className: pillClass, type: "button", onClick: () => !hasReacted && onReact?.(messageId, emojiIdentifier), title: hasReacted ? "You reacted" : emoji.name, children: [_jsx("span", { className: styles['reaction-unicode'], children: emoji.name }), _jsx("span", { className: styles['reaction-count'], children: reaction.count })] }, `${emoji.name}-${i}`));
        }) }));
}
// ── Status Indicator ─────────────────────────────────────────────
function StatusDot({ status }) {
    const colors = { online: "#23a559", idle: "#f0b232", dnd: "#f23f43" };
    return (_jsx("span", { className: styles['status-dot'], style: { background: colors[status || "offline"] || "#80848e" }, title: status }));
}
function ChannelItem({ channel, isActive, onClick }) {
    return (_jsxs("button", { className: `${styles['channel-item']} ${isActive ? styles['channel-item-active'] : ""}`, onClick: () => onClick(channel), title: channel.topic || channel.name, children: [_jsx("span", { className: styles['channel-hash'], children: "#" }), _jsx("span", { className: styles['channel-item-name'], children: channel.name })] }));
}
// ── Members Sidebar ──────────────────────────────────────────────
function MemberItem({ member }) {
    return (_jsxs("div", { className: styles['member-item'], children: [_jsxs("div", { className: styles['member-avatar-wrap'], children: [member.avatarUrl ? (_jsx("img", { src: member.avatarUrl, alt: "", className: styles['member-avatar'], loading: "lazy" })) : (_jsx("div", { className: styles['member-avatar-fallback'], style: { background: getAvatarColor(member.id) }, children: (member.displayName || "?")[0].toUpperCase() })), _jsx(StatusDot, { status: member.status })] }), _jsxs("div", { className: styles['member-info'], children: [_jsxs("div", { className: styles['member-name-row'], children: [_jsx("span", { className: styles['member-name'], style: member.roleColors?.secondary
                                    ? resolveRoleColorStyle(member)
                                    : { color: member.roleColor || "#dbdee1" }, children: member.displayName }), member.isBot && (_jsxs("span", { className: styles['member-bot-badge'], children: [_jsx("svg", { className: styles['bot-badge-icon'], viewBox: "0 0 16 16", fill: "currentColor", children: _jsx("path", { d: "M7.4,11.17,4,8.62,5,7.26l2,1.53L10.64,4l1.36,1Z" }) }), "APP"] })), _jsx(UserBadges, { badges: member.badges })] }), member.roleTags && member.roleTags.length > 0 && (_jsx(RoleTags, { roleTags: member.roleTags })), member.activity && (_jsx("span", { className: styles['member-activity'], children: member.activity }))] })] }));
}
function MessageBody({ message, tenorOembedUrl, reactedSet, onReact }) {
    const formatted = formatContent(message.content, message.cleanContent);
    return (_jsxs(_Fragment, { children: [formatted && _jsx("div", { className: styles['message-text'], children: formatted }), _jsx(TenorEmbeds, { content: message.content, tenorOembedUrl: tenorOembedUrl }), _jsx(ImageAttachments, { attachments: message.attachments }), _jsx(VideoAttachments, { attachments: message.attachments }), _jsx(AudioAttachments, { attachments: message.attachments }), _jsx(FileAttachments, { attachments: message.attachments }), _jsx(Stickers, { stickers: message.stickers }), _jsx(EmbedMedia, { embeds: message.embeds }), _jsx(Reactions, { reactions: message.reactions, messageId: message.id, reactedSet: reactedSet, onReact: onReact })] }));
}
// ── Test-only exports ────────────────────────────────────────────
// Internal pure helpers exposed for unit tests — not public API.
export const __internal = {
    formatContent,
    renderMarkdown,
    parseInline,
    isEmojiOnly,
    formatDiscordTimestamp,
    formatFileSize,
    isImageAttachment,
    isVideoAttachment,
    isAudioAttachment,
    isVoiceMessage,
    isSpoilerAttachment,
    stickerUrl,
    fitMediaDimensions,
};
export default function DiscordChatComponent({ messageCount = 500, joinMode = false, inviteUrl = "https://discord.gg/sBX7BxP", onJoinHoverChange, channelIds = [], channelsUrl = "/api/discord/channels", streamUrl = "/api/discord/stream", membersUrl = "/api/discord/members", tenorOembedUrl = "/api/tenor/oembed", reactUrl = "/api/discord/react", emojisUrl = "/api/discord/emojis", serverIconUrl, serverBannerUrl: serverBannerUrlProp, servers = [], }) {
    const [channels, setChannels] = useState([]);
    const [serverName, setServerName] = useState("");
    const [serverIcon, setServerIcon] = useState(serverIconUrl || null);
    const [serverBannerUrl, setServerBannerUrl] = useState(serverBannerUrlProp || null);
    const [activeChannelId, setActiveChannelId] = useState(channelIds[0]);
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [members, setMembers] = useState(null);
    const scrollRef = useRef(null);
    const isFirstLoad = useRef(true);
    const shouldSnapToBottom = useRef(false);
    // ── Reaction state ──────────────────────────────────────────────
    const [serverEmojis, setServerEmojis] = useState(null);
    const [reactedSet, setReactedSet] = useState(() => loadReactedSet());
    const [pickerMessageId, setPickerMessageId] = useState(null);
    const pickerAnchorRef = useRef(null);
    // Derive active channel object from fetched data
    const activeChannel = channels.find((ch) => ch.id === activeChannelId) || { id: activeChannelId, name: "chat" };
    // ── Fetch channel list + server name from API ───────────────────
    useEffect(() => {
        let cancelled = false;
        fetch(channelsUrl)
            .then((res) => (res.ok ? res.json() : Promise.reject()))
            .then((data) => {
            if (cancelled)
                return;
            if (data.guildName)
                setServerName(data.guildName);
            if (data.guildIcon)
                setServerIcon((prev) => prev || data.guildIcon);
            if (data.guildBanner)
                setServerBannerUrl((prev) => prev || data.guildBanner);
            else if (data.guildSplash)
                setServerBannerUrl((prev) => prev || data.guildSplash);
            // Filter to only the whitelisted channels, sorted by Discord position
            const idSet = new Set(channelIds);
            const filtered = (data.channels || [])
                .filter((ch) => idSet.has(ch.id))
                .sort((channelA, channelB) => (channelA.position ?? 0) - (channelB.position ?? 0));
            setChannels(filtered.length > 0 ? filtered : channelIds.map((id) => ({ id, name: id })));
        })
            .catch(() => {
            // Fallback — use IDs as names
            if (!cancelled)
                setChannels(channelIds.map((id) => ({ id, name: id })));
        });
        return () => { cancelled = true; };
    }, [channelsUrl]);
    // ── Scroll to bottom ────────────────────────────────────────────
    const scrollToBottom = useCallback((instant = false) => {
        const element = scrollRef.current;
        if (!element)
            return;
        element.scrollTo({ top: element.scrollHeight, behavior: instant ? "instant" : "smooth" });
    }, []);
    // ── Snap to bottom after React commits DOM (useLayoutEffect) ───
    // Fires synchronously after DOM mutation, guaranteeing scrollHeight
    // is accurate — unlike requestAnimationFrame which races React.
    // A delayed fallback re-scrolls after images finish loading and
    // shift scrollHeight beyond the initial measurement.
    useLayoutEffect(() => {
        if (shouldSnapToBottom.current && messages.length > 0) {
            const instant = isFirstLoad.current;
            scrollToBottom(instant);
            shouldSnapToBottom.current = false;
            isFirstLoad.current = false;
            // Catch late layout shifts from lazy-loaded images
            const scrollTimeout = setTimeout(() => scrollToBottom(true), 200);
            return () => clearTimeout(scrollTimeout);
        }
    }, [messages, scrollToBottom]);
    // ── SSE stream for messages ─────────────────────────────────────
    useEffect(() => {
        let eventSource;
        let retryTimeout;
        function connect() {
            eventSource = new EventSource(`${streamUrl}?limit=${messageCount}&channelId=${activeChannelId}`);
            eventSource.addEventListener("init", (event) => {
                try {
                    const { messages: msgs } = JSON.parse(event.data);
                    const reversed = (msgs || []).reverse();
                    shouldSnapToBottom.current = true;
                    setMessages(reversed);
                    setError(null);
                    setLoading(false);
                    // ── Backfill server name & channel names from message data ──
                    // The SSE stream messages include guildName and channelName
                    // from DiscordDataService, so we can use them as a fallback
                    // when the Lupos /guild/channels endpoint is unavailable.
                    if (reversed.length > 0) {
                        const firstMsg = reversed[0];
                        if (firstMsg.guildName) {
                            setServerName((prev) => prev || firstMsg.guildName);
                        }
                        // Build guild icon/banner CDN URLs from stored hashes
                        const iconUrl = discordGuildIconUrl(firstMsg.guildId, firstMsg.guildIcon);
                        if (iconUrl) {
                            setServerIcon((prev) => prev || iconUrl);
                        }
                        const bannerUrl = discordBannerUrl(firstMsg.guildId, firstMsg.guildBanner) ||
                            discordSplashUrl(firstMsg.guildId, firstMsg.guildSplash);
                        if (bannerUrl) {
                            setServerBannerUrl((prev) => prev || bannerUrl);
                        }
                        // Build channel name map from all messages in the batch
                        setChannels((prev) => {
                            // If we already have real names (not just IDs), keep them
                            const hasRealNames = prev.some((ch) => ch.name !== ch.id);
                            if (hasRealNames)
                                return prev;
                            const channelMap = new Map();
                            for (const message of reversed) {
                                if (message.channelId && message.channelName) {
                                    channelMap.set(message.channelId, message.channelName);
                                }
                            }
                            if (channelMap.size === 0)
                                return prev;
                            // Merge discovered names into existing channel list
                            return prev.map((ch) => ({
                                ...ch,
                                name: channelMap.get(ch.id) || ch.name,
                            }));
                        });
                    }
                }
                catch (error) {
                    console.error("[DiscordChat] Init event parse error:", error);
                    setError(error instanceof Error ? error : new Error(String(error)));
                    setLoading(false);
                }
            });
            eventSource.addEventListener("new", (event) => {
                try {
                    const { messages: newMsgs } = JSON.parse(event.data);
                    if (!newMsgs?.length)
                        return;
                    shouldSnapToBottom.current = true;
                    setMessages((prev) => {
                        const appended = [...prev, ...newMsgs.reverse()];
                        return appended.length > messageCount ? appended.slice(appended.length - messageCount) : appended;
                    });
                }
                catch (error) {
                    console.error("[DiscordChat] New message parse error:", error);
                }
            });
            eventSource.addEventListener("delete", (event) => {
                try {
                    const { ids } = JSON.parse(event.data);
                    if (!ids?.length)
                        return;
                    const deletedSet = new Set(ids);
                    setMessages((prev) => prev.filter((message) => !deletedSet.has(message.id)));
                }
                catch (error) {
                    console.error("[DiscordChat] Delete event parse error:", error);
                }
            });
            // Reaction (and other field) changes on existing messages.
            // The server detects when a message's reactions fingerprint
            // changes and sends the full updated message object.
            eventSource.addEventListener("update", (event) => {
                try {
                    const { messages: updatedMsgs } = JSON.parse(event.data);
                    if (!updatedMsgs?.length)
                        return;
                    const updateMap = new Map(updatedMsgs.map((message) => [message.id, message]));
                    setMessages((prev) => prev.map((message) => {
                        const updated = updateMap.get(message.id);
                        return updated ? { ...message, reactions: updated.reactions } : message;
                    }));
                }
                catch (error) {
                    console.error("[DiscordChat] Update event parse error:", error);
                }
            });
            eventSource.addEventListener("error", () => {
                if (eventSource && eventSource.readyState === EventSource.CLOSED) {
                    console.warn("[DiscordChat] SSE closed, retrying in 3s…");
                    eventSource.close();
                    retryTimeout = setTimeout(connect, 3_000);
                }
            });
        }
        connect();
        return () => {
            if (eventSource)
                eventSource.close();
            if (retryTimeout)
                clearTimeout(retryTimeout);
        };
    }, [messageCount, activeChannelId, streamUrl]);
    // ── Fetch members (poll every 30s) ──────────────────────────────
    useEffect(() => {
        let cancelled = false;
        async function fetchMembers() {
            try {
                const response = await fetch(membersUrl);
                if (response.ok && !cancelled) {
                    setMembers(await response.json());
                }
            }
            catch {
                // silently ignore — sidebar is non-critical
            }
        }
        fetchMembers();
        const interval = setInterval(fetchMembers, 30_000);
        return () => { cancelled = true; clearInterval(interval); };
    }, [membersUrl]);
    // ── Channel switch — reset message state eagerly ────────────────
    const handleChannelClick = useCallback((channel) => {
        setActiveChannelId(channel.id);
        setMessages([]);
        setLoading(true);
        isFirstLoad.current = true;
    }, []);
    // ── Fetch server emojis for the picker ───────────────────────────
    useEffect(() => {
        let cancelled = false;
        fetch(emojisUrl)
            .then((res) => (res.ok ? res.json() : Promise.reject()))
            .then((data) => {
            if (!cancelled && data.emojis)
                setServerEmojis(data.emojis);
        })
            .catch(() => {
            // Non-critical — picker will only show Unicode emojis
        });
        return () => { cancelled = true; };
    }, [emojisUrl]);
    // ── Handle emoji reaction ───────────────────────────────────────
    const handleReact = useCallback(async (messageId, emojiIdentifier) => {
        const reactKey = buildReactKey(messageId, emojiIdentifier);
        // Already reacted — bail
        if (reactedSet.has(reactKey))
            return;
        // Optimistic: mark as reacted immediately
        setReactedSet((prev) => {
            const next = new Set(prev);
            next.add(reactKey);
            persistReactedSet(next);
            return next;
        });
        // Optimistic: update message reactions in-place so the UI reflects the change immediately.
        // Parses the emojiIdentifier ("name:id" for custom, raw string for Unicode) and either
        // increments an existing reaction's count or appends a new reaction entry.
        setMessages((prev) => prev.map((message) => {
            if (message.id !== messageId)
                return message;
            const reactions = message.reactions ? [...message.reactions] : [];
            const isCustom = /^\w+:\d+$/.test(emojiIdentifier);
            const index = reactions.findIndex((reaction) => {
                if (isCustom)
                    return reaction.emoji.id === emojiIdentifier.split(":")[1];
                return reaction.emoji.name === emojiIdentifier && !reaction.emoji.id;
            });
            if (index >= 0) {
                reactions[index] = { ...reactions[index], count: reactions[index].count + 1 };
            }
            else {
                // New reaction
                if (isCustom) {
                    const [name, id] = emojiIdentifier.split(":");
                    reactions.push({ emoji: { id, name, animated: false }, count: 1 });
                }
                else {
                    reactions.push({ emoji: { id: undefined, name: emojiIdentifier, animated: false }, count: 1 });
                }
            }
            return { ...message, reactions };
        }));
        try {
            const response = await fetch(reactUrl, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    channelId: activeChannelId,
                    messageId,
                    emoji: emojiIdentifier,
                }),
            });
            // 409 = already reacted (bot already had that reaction)
            // That's fine — keep the localStorage entry
            if (!response.ok && response.status !== 409) {
                // Revert optimistic update on real failure
                console.warn("[DiscordChat] React failed:", response.status);
                setReactedSet((prev) => {
                    const next = new Set(prev);
                    next.delete(reactKey);
                    persistReactedSet(next);
                    return next;
                });
            }
        }
        catch (error) {
            console.error("[DiscordChat] React error:", error);
            // Revert optimistic update
            setReactedSet((prev) => {
                const next = new Set(prev);
                next.delete(reactKey);
                persistReactedSet(next);
                return next;
            });
        }
    }, [reactedSet, reactUrl, activeChannelId]);
    // ── Picker open/close handlers ──────────────────────────────────
    const handleOpenPicker = useCallback((messageId, btnRef) => {
        pickerAnchorRef.current = btnRef.current;
        setPickerMessageId((prev) => (prev === messageId ? null : messageId));
    }, []);
    const handleClosePicker = useCallback(() => {
        setPickerMessageId(null);
        pickerAnchorRef.current = null;
    }, []);
    const handlePickerSelect = useCallback((emojiIdentifier) => {
        if (pickerMessageId) {
            handleReact(pickerMessageId, emojiIdentifier);
        }
        handleClosePicker();
    }, [pickerMessageId, handleReact, handleClosePicker]);
    return (_jsxs("div", { className: `discord-chat-component ${styles['container']}`, id: "discord-chat", children: [_jsxs("div", { className: styles['title-bar'], children: [_jsxs("div", { className: styles['traffic-lights'], children: [_jsx("span", { className: styles['traffic-dot'] }), _jsx("span", { className: styles['traffic-dot'] }), _jsx("span", { className: styles['traffic-dot'] })] }), _jsxs("span", { className: styles['title-bar-center'], children: [serverIcon && (_jsx("img", { src: serverIcon, alt: "", className: styles['title-bar-clock'], "aria-hidden": "true" })), _jsx("span", { className: styles['channel-name'], children: serverName || "Discord" })] }), _jsx("span", { className: styles['online-dot'] }), members && (_jsxs("span", { className: styles['channel-topic'], children: [members.totalOnline, " online \u00B7 ", members.totalMembers, " members"] }))] }), _jsxs("div", { className: styles['panel-layout'], children: [_jsxs("nav", { className: styles['guild-bar'], "aria-label": "Servers", children: [_jsx("button", { className: styles['guild-bar-home'], title: "Direct Messages", children: _jsx("svg", { width: "28", height: "20", viewBox: "0 0 28 20", fill: "currentColor", children: _jsx("path", { d: "M23.0212 1.67671C21.3107 0.879656 19.5079 0.318797 17.6584 0C17.4062 0.461742 17.1749 0.934541 16.966 1.4184C15.0099 1.11706 13.0236 1.11706 11.0675 1.4184C10.8585 0.934541 10.6272 0.461742 10.3749 0C8.52404 0.320819 6.72029 0.882524 5.00882 1.68093C1.47767 7.01788 0.404834 12.216 0.93776 17.3363C3.01815 18.8838 5.37198 19.9903 7.87029 20.5984C8.39591 19.8931 8.86441 19.1447 9.27153 18.3603C8.51536 18.0784 7.78792 17.7241 7.09936 17.3023C7.28989 17.1629 7.47591 17.0186 7.65739 16.8744C12.0547 18.9136 16.9758 18.9136 21.376 16.8744C21.5575 17.0186 21.7435 17.1629 21.934 17.3023C21.2447 17.7248 20.5165 18.0797 19.7597 18.3624C20.1661 19.1454 20.6337 19.8925 21.1583 20.5963C23.6581 19.99 26.0132 18.8845 28.0936 17.3384C28.7196 11.3653 27.1385 6.21906 23.0212 1.67671Z" }) }) }), _jsx("div", { className: styles['guild-bar-separator'] }), _jsxs("button", { className: `${styles['guild-bar-item']} ${styles['guild-bar-item-active']}`, title: serverName || "Discord", children: [serverIcon ? (_jsx("img", { src: serverIcon, alt: "", className: styles['guild-bar-icon'] })) : (_jsx("span", { className: styles['guild-bar-initial'], children: (serverName || "D")[0].toUpperCase() })), _jsx("span", { className: styles['guild-bar-pill'] })] }), servers.map((srv) => (_jsx("button", { className: styles['guild-bar-item'], title: srv.name, children: srv.iconUrl ? (_jsx("img", { src: srv.iconUrl, alt: "", className: styles['guild-bar-icon'] })) : (_jsx("span", { className: styles['guild-bar-initial'], children: (srv.name || "?")[0].toUpperCase() })) }, srv.id || srv.name)))] }), _jsxs("aside", { className: styles['channel-sidebar'], children: [_jsxs("div", { className: `${styles['server-header']} ${serverBannerUrl ? styles['server-header-banner'] : ""}`, children: [serverBannerUrl && (_jsx("img", { src: serverBannerUrl, alt: "", className: styles['server-banner-image'], loading: "lazy", draggable: false })), _jsx("span", { className: styles['server-name'], children: serverName || "Discord" })] }), _jsx("div", { className: styles['channel-list'], children: (() => {
                                    // Group channels by their Discord category (parentName).
                                    // Preserves the order channels arrive from the API (sorted
                                    // by position), and groups under real category headings.
                                    const groups = [];
                                    let lastCategory = null;
                                    for (const ch of channels) {
                                        const channelCategory = ch.parentName || "Text Channels";
                                        if (channelCategory !== lastCategory) {
                                            groups.push({ category: channelCategory, items: [] });
                                            lastCategory = channelCategory;
                                        }
                                        groups[groups.length - 1].items.push(ch);
                                    }
                                    return groups.map((group) => (_jsxs("div", { children: [_jsx("div", { className: styles['channel-category'], children: _jsx("span", { className: styles['category-name'], children: group.category }) }), group.items.map((ch) => (_jsx(ChannelItem, { channel: ch, isActive: activeChannelId === ch.id, onClick: handleChannelClick }, ch.id)))] }, group.category)));
                                })() })] }), _jsxs("div", { className: styles['chat-panel'], children: [_jsxs("div", { className: styles['messages-area'], ref: scrollRef, children: [loading && (_jsxs("div", { className: styles['is-loading-state'], children: [_jsxs("div", { className: styles['loading-dots'], children: [_jsx("span", { className: styles['loading-dot'] }), _jsx("span", { className: styles['loading-dot'] }), _jsx("span", { className: styles['loading-dot'] })] }), _jsx("span", { children: "Loading messages\u2026" })] })), !!error && (_jsxs("div", { className: styles['error'], children: [_jsx("span", { className: styles['error-icon'], children: "\u26A0\uFE0F" }), _jsx("span", { children: "Couldn't load messages" })] })), !loading && !error && (() => {
                                        // Build a lookup map for reply references
                                        const messageMap = new Map(messages.map((message) => [message.id, message]));
                                        return messages.map((message, i) => {
                                            const previousMessage = i > 0 ? messages[i - 1] : null;
                                            const grouped = shouldGroup(message, previousMessage);
                                            const newDay = isDifferentDay(message, previousMessage);
                                            const nameStyle = resolveRoleColorStyle(message.author);
                                            return (_jsxs("div", { children: [newDay && (_jsx("div", { className: styles['date-separator'], children: _jsx("span", { className: styles['date-separator-text'], children: formatDateSeparator(message.createdAtISO) }) })), grouped && !newDay ? (_jsxs("div", { className: styles['message-row-grouped'], children: [_jsx("span", { className: styles['timestamp-inline'], children: formatShortTime(message.createdAtISO) }), _jsx(MessageActions, { messageId: message.id, onOpenPicker: handleOpenPicker, pickerMessageId: pickerMessageId }), _jsx("div", { className: styles['message-content'], children: _jsx(MessageBody, { message: message, tenorOembedUrl: tenorOembedUrl, reactedSet: reactedSet, onReact: handleReact }) })] })) : (_jsxs("div", { className: `${styles['message-row']} ${message.replyTo ? styles['message-row-reply'] : ""}`, children: [message.replyTo && (_jsx(ReplyContext, { replyTo: message.replyTo, messageMap: messageMap })), message.author.avatarUrl ? (_jsx("img", { className: styles['avatar'], src: message.author.avatarUrl, alt: message.author.displayName, width: 40, height: 40, loading: "lazy" })) : (_jsx("div", { className: styles['avatar-fallback'], style: { background: getAvatarColor(message.author.id) }, children: (message.author.displayName || "?")[0].toUpperCase() })), _jsx(MessageActions, { messageId: message.id, onOpenPicker: handleOpenPicker, pickerMessageId: pickerMessageId }), _jsxs("div", { className: styles['message-content'], children: [_jsxs("div", { className: styles['message-header'], children: [_jsx("span", { className: styles['author-name'], style: nameStyle, children: message.author.displayName }), message.author.isBot && (_jsxs("span", { className: styles['bot-badge'], children: [_jsx("svg", { className: styles['bot-badge-icon'], viewBox: "0 0 16 16", fill: "currentColor", children: _jsx("path", { d: "M7.4,11.17,4,8.62,5,7.26l2,1.53L10.64,4l1.36,1Z" }) }), "BOT"] })), _jsx(UserBadges, { badges: message.author.badges }), _jsx(RoleTags, { roleTags: message.author.roleTags }), _jsx("span", { className: styles['timestamp'], children: formatTimestamp(message.createdAtISO) })] }), _jsx(MessageBody, { message: message, tenorOembedUrl: tenorOembedUrl, reactedSet: reactedSet, onReact: handleReact })] })] }))] }, message.id));
                                        });
                                    })()] }), _jsx("div", { className: styles['input-bar'], children: joinMode ? (_jsxs("a", { href: inviteUrl, target: "_blank", rel: "noopener noreferrer", className: styles['join-button'], id: "discord-join-button", onMouseEnter: () => onJoinHoverChange?.(true), onMouseLeave: () => onJoinHoverChange?.(false), children: [_jsx("svg", { className: styles['join-button-icon'], viewBox: "0 0 24 24", width: "20", height: "20", fill: "currentColor", children: _jsx("path", { d: "M19.27 5.33C17.94 4.71 16.5 4.26 15 4a.09.09 0 0 0-.07.03c-.18.33-.39.76-.53 1.09a16.09 16.09 0 0 0-4.8 0c-.14-.34-.36-.76-.54-1.09c-.01-.02-.04-.03-.07-.03c-1.5.26-2.93.71-4.27 1.33c-.01 0-.02.01-.03.02c-2.72 4.07-3.47 8.03-3.1 11.95c0 .02.01.04.03.05c1.8 1.32 3.53 2.12 5.24 2.65c.03.01.06 0 .07-.02c.4-.55.76-1.13 1.07-1.74c.02-.04 0-.08-.04-.09c-.57-.22-1.11-.48-1.64-.78c-.04-.02-.04-.08-.01-.11c.11-.08.22-.17.33-.25c.02-.02.05-.02.07-.01c3.44 1.57 7.15 1.57 10.55 0c.02-.01.05-.01.07.01c.11.09.22.17.33.26c.04.03.04.09-.01.11c-.52.31-1.07.56-1.64.78c-.04.01-.05.06-.04.09c.32.61.68 1.19 1.07 1.74c.03.01.06.02.09.01c1.72-.53 3.45-1.33 5.24-2.65c.02-.01.03-.03.03-.05c.44-4.53-.73-8.46-3.1-11.95c-.01-.01-.02-.02-.04-.02zM8.52 14.91c-1.03 0-1.89-.95-1.89-2.12s.84-2.12 1.89-2.12c1.06 0 1.9.96 1.89 2.12c0 1.17-.84 2.12-1.89 2.12zm6.97 0c-1.03 0-1.89-.95-1.89-2.12s.84-2.12 1.89-2.12c1.06 0 1.9.96 1.89 2.12c0 1.17-.83 2.12-1.89 2.12z" }) }), "Join the Discord Server"] })) : (_jsxs("div", { className: styles['input-container'], children: [_jsxs("span", { className: styles['input-placeholder'], children: ["Message #", activeChannel.name] }), _jsxs("div", { className: styles['input-icons'], children: [_jsx("span", { children: "\uD83D\uDE00" }), _jsx("span", { children: "\uD83C\uDF81" }), _jsx("span", { children: "\uD83D\uDCCE" })] })] })) })] }), _jsx("aside", { className: styles['member-sidebar'], children: members ? (_jsxs("div", { className: styles['member-list'], children: [members.roles?.map((role) => (_jsxs("div", { className: styles['member-role-group'], children: [_jsxs("div", { className: styles['member-role-header'], children: [role.name, " \u2014 ", role.members.length] }), role.members.map((member) => (_jsx(MemberItem, { member: member }, member.id)))] }, role.id))), members.bots && members.bots.length > 0 && (_jsxs("div", { className: styles['member-role-group'], children: [_jsxs("div", { className: styles['member-role-header'], children: ["Bots \u2014 ", members.bots.length] }), members.bots.map((member) => (_jsx(MemberItem, { member: member }, member.id)))] }))] })) : (_jsx("div", { className: styles['is-loading-state'], children: _jsxs("div", { className: styles['loading-dots'], children: [_jsx("span", { className: styles['loading-dot'] }), _jsx("span", { className: styles['loading-dot'] }), _jsx("span", { className: styles['loading-dot'] })] }) })) })] }), pickerMessageId && (_jsx(EmojiPicker, { anchorRef: pickerAnchorRef.current, serverEmojis: serverEmojis, onSelect: handlePickerSelect, onClose: handleClosePicker }))] }));
}
//# sourceMappingURL=DiscordChatComponent.js.map