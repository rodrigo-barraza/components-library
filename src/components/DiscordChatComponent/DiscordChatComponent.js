/* eslint-disable no-unused-vars -- sub-components used in JSX (no react eslint plugin) */
import { useState, useEffect, useLayoutEffect, useRef, useCallback } from "react";
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
    if (roleColors.tertiary) stops.push(roleColors.tertiary);
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
  if (!badges?.length) return null;
  return (
    <span className={styles.userBadges}>
      {badges.map((badge) => {
        // badge can be a string ID or { id, label } object
        const id = typeof badge === "string" ? badge : badge.id;
        const icon = BADGE_ICONS[id];
        if (!icon) return null;
        return (
          <span key={id} className={styles.badgeIcon} title={icon.label}>
            <svg viewBox="0 0 20 20" fill={icon.color} width="18" height="18">
              <path d={icon.path} />
            </svg>
          </span>
        );
      })}
    </span>
  );
}

// ── Role Tags ────────────────────────────────────────────────
// Renders colored role pill badges next to the username — matching
// Discord's native role tag display to the right of the name.
function RoleTags({ roleTags }) {
  if (!roleTags?.length) return null;
  return (
    <span className={styles.roleTags}>
      {roleTags.map((tag) => (
        <span
          key={tag.name}
          className={styles.roleTag}
          style={{
            "--role-color": tag.color || "#99aab5",
          }}
          title={tag.name}
        >
          {tag.iconUrl && (
            <img
              src={tag.iconUrl}
              alt=""
              className={styles.roleTagIcon}
              width={14}
              height={14}
              loading="lazy"
              draggable={false}
            />
          )}
          <span className={styles.roleTagName}>{tag.name}</span>
        </span>
      ))}
    </span>
  );
}

// ── Tenor URL detection ──────────────────────────────────────────
const TENOR_URL_RE = /https?:\/\/tenor\.com\/view\/[\w-]+/g;

function extractTenorUrls(content) {
  return (content || "").match(TENOR_URL_RE) || [];
}

// ── Discord Custom Emoji ─────────────────────────────────────────
const CUSTOM_EMOJI_RE = /<(a?):(\w+):(\d+)>/g;

function emojiUrl(id, animated) {
  const ext = animated ? "gif" : "webp";
  return `https://cdn.discordapp.com/emojis/${id}.${ext}?size=48&quality=lossless`;
}

// ── Format Discord message content ───────────────────────────────
function formatContent(content, cleanContent) {
  const text = cleanContent || content || "";
  const rawContent = content || "";
  if (!text) return null;

  const emojiMap = new Map();
  let emojiMatch;
  CUSTOM_EMOJI_RE.lastIndex = 0;
  while ((emojiMatch = CUSTOM_EMOJI_RE.exec(rawContent)) !== null) {
    const [, animated, name, id] = emojiMatch;
    emojiMap.set(name, { animated: animated === "a", id, name });
  }

  const emojiRawPattern = "<a?:[\\w]+:\\d+>";
  const emojiCleanPattern = emojiMap.size > 0
    ? `:(?:${[...emojiMap.keys()].map(n => n.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("|")}):`
    : null;

  const splitParts = [
    emojiRawPattern,
    ...(emojiCleanPattern ? [emojiCleanPattern] : []),
    "@[\\w.]+",
    "https?:\\/\\/\\S+",
  ];
  const splitRe = new RegExp(`(${splitParts.join("|")})`, "g");
  const segments = text.split(splitRe);

  if (segments.length <= 1 && emojiMap.size === 0) {
    return <span>{text}</span>;
  }

  return (
    <span>
      {segments.map((seg, i) => {
        if (!seg) return null;
        const rawEmojiMatch = /^<(a?):(\w+):(\d+)>$/.exec(seg);
        if (rawEmojiMatch) {
          const [, animated, name, id] = rawEmojiMatch;
          return (
            <img key={i} src={emojiUrl(id, animated === "a")} alt={`:${name}:`}
              title={`:${name}:`} className={styles.customEmoji} draggable={false} loading="lazy" />
          );
        }
        const cleanEmojiMatch = /^:(\w+):$/.exec(seg);
        if (cleanEmojiMatch && emojiMap.has(cleanEmojiMatch[1])) {
          const emoji = emojiMap.get(cleanEmojiMatch[1]);
          return (
            <img key={i} src={emojiUrl(emoji.id, emoji.animated)} alt={`:${emoji.name}:`}
              title={`:${emoji.name}:`} className={styles.customEmoji} draggable={false} loading="lazy" />
          );
        }
        if (seg.startsWith("@")) {
          return <span key={i} className={styles.mention}>{seg}</span>;
        }
        if (/^https?:\/\//.test(seg)) {
          if (TENOR_URL_RE.test(seg)) { TENOR_URL_RE.lastIndex = 0; return null; }
          const display = seg.length > 50 ? seg.substring(0, 47) + "..." : seg;
          return <a key={i} href={seg} target="_blank" rel="noopener noreferrer">{display}</a>;
        }
        return <span key={i}>{seg}</span>;
      })}
    </span>
  );
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
  if (isToday) return `Today at ${time}`;
  if (isYesterday) return `Yesterday at ${time}`;
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
  if (!previous) return false;
  // Replies always break grouping (matches real Discord behavior)
  if (current.replyTo) return false;
  if (current.author.id !== previous.author.id) return false;
  const diff = new Date(previous.createdAtISO) - new Date(current.createdAtISO);
  return Math.abs(diff) < 7 * 60 * 1000;
}

function isDifferentDay(a, b) {
  if (!a || !b) return true;
  return new Date(a.createdAtISO).toDateString() !== new Date(b.createdAtISO).toDateString();
}

// ── Tenor GIF Embed ──────────────────────────────────────────────
function TenorEmbed({ url, tenorOembedUrl }) {
  const [gifUrl, setGifUrl] = useState(null);
  const [error, setError] = useState(false);
  useEffect(() => {
    let cancelled = false;
    fetch(`${tenorOembedUrl}?url=${encodeURIComponent(url)}`)
      .then((res) => res.ok ? res.json() : Promise.reject())
      .then((data) => { if (!cancelled && data.gifUrl) setGifUrl(data.gifUrl); })
      .catch(() => { if (!cancelled) setError(true); });
    return () => { cancelled = true; };
  }, [url]);
  if (error) return null;
  if (!gifUrl) return <div className={styles.tenorPlaceholder}><div className={styles.tenorSpinner} /></div>;
  return (
    <a href={url} target="_blank" rel="noopener noreferrer" className={styles.attachmentLink}>
      <img src={gifUrl} alt="Tenor GIF" className={styles.tenorGif} loading="lazy" />
    </a>
  );
}

function TenorEmbeds({ content, tenorOembedUrl }) {
  const urls = extractTenorUrls(content);
  if (!urls.length) return null;
  return <div className={styles.attachments}>{urls.map((url, i) => <TenorEmbed key={i} url={url} tenorOembedUrl={tenorOembedUrl} />)}</div>;
}

// ── Image Attachments ────────────────────────────────────────────
function ImageAttachments({ attachments }) {
  if (!attachments?.length) return null;
  const images = attachments.filter((a) => a.contentType?.startsWith("image/") && (a.url || a.proxyURL));
  if (!images.length) return null;
  return (
    <div className={styles.attachments}>
      {images.map((img, i) => {
        const src = img.proxyURL || img.url;
        const maxW = 400, maxH = 300;
        let w = img.width || maxW, h = img.height || maxH;
        if (w > maxW) { h = Math.round(h * (maxW / w)); w = maxW; }
        if (h > maxH) { w = Math.round(w * (maxH / h)); h = maxH; }
        return (
          <a key={i} href={img.url || src} target="_blank" rel="noopener noreferrer" className={styles.attachmentLink}>
            <img src={src} alt={img.name || "attachment"} width={w} height={h}
              className={styles.attachmentImage} loading="lazy" />
          </a>
        );
      })}
    </div>
  );
}

// ── Rich Embed Card (Discord link unfurl / Open Graph preview) ───
// Renders Discord-style embed cards with provider, title, description,
// thumbnail/image, and video. Matches the native Discord embed UI.
function EmbedMedia({ embeds }) {
  if (!embeds?.length) return null;
  // Skip non-object embeds (legacy string data), Tenor (handled separately),
  // and embeds with nothing renderable
  const filteredEmbeds = embeds.filter((e) =>
    typeof e === "object" && e !== null
    && (e.title || e.description || e.provider || e.image || e.thumbnail || e.video)
    && e.provider?.name !== "Tenor"
    && !/tenor\.com/i.test(e.url || "")
  );
  if (!filteredEmbeds.length) return null;

  return (
    <div className={styles.embedList}>
      {filteredEmbeds.map((embed, i) => {
        const hasMetadata = embed.title || embed.description || embed.provider;
        const hasThumbnailOnly = embed.thumbnail && !embed.image && !embed.video;
        const hasLargeImage = embed.image && !embed.video;
        const accentColor = embed.color
          ? `#${embed.color.toString(16).padStart(6, "0")}`
          : null;

        // Pure image/gif embeds with NO metadata → render as simple attachment
        if (!hasMetadata && (embed.image || embed.thumbnail)) {
          const imgSrc = embed.image?.url || embed.image?.proxyURL
            || embed.thumbnail?.url || embed.thumbnail?.proxyURL;
          if (!imgSrc) return null;
          const imgMeta = embed.image || embed.thumbnail;
          const maxW = 400, maxH = 300;
          let w = imgMeta.width || maxW, h = imgMeta.height || maxH;
          if (w > maxW) { h = Math.round(h * (maxW / w)); w = maxW; }
          if (h > maxH) { w = Math.round(w * (maxH / h)); h = maxH; }
          return (
            <a key={i} href={embed.url || imgSrc} target="_blank" rel="noopener noreferrer" className={styles.attachmentLink}>
                <img src={imgSrc} alt={embed.title || "embed"} width={w} height={h}
                className={styles.attachmentImage} loading="lazy" />
            </a>
          );
        }

        // Pure video embeds with NO metadata → render inline or thumbnail
        if (!hasMetadata && embed.video) {
          return <EmbedVideo key={i} embed={embed} />;
        }

        // ── Rich embed card ───────────────────────────────────
        return (
          <div
            key={i}
            className={styles.embedCard}
            style={accentColor ? { borderLeftColor: accentColor } : undefined}
          >
            <div className={hasThumbnailOnly ? styles.embedCardBodyInline : styles.embedCardBody}>
              <div className={styles.embedCardText}>
                {embed.provider?.name && (
                  <span className={styles.embedProvider}>{embed.provider.name}</span>
                )}
                {embed.title && (
                  embed.url ? (
                    <a href={embed.url} target="_blank" rel="noopener noreferrer" className={styles.embedTitle}>
                      {embed.title}
                    </a>
                  ) : (
                    <span className={styles.embedTitlePlain}>{embed.title}</span>
                  )
                )}
                {embed.description && (
                  <p className={styles.embedDescription}>{embed.description}</p>
                )}
              </div>
              {/* Inline thumbnail (small, right-aligned — e.g. article previews) */}
              {hasThumbnailOnly && embed.thumbnail?.url && (
                <a href={embed.url || embed.thumbnail.url} target="_blank" rel="noopener noreferrer" className={styles.embedThumbLink}>
                        <img
                    src={embed.thumbnail.proxyURL || embed.thumbnail.url}
                    alt={embed.title || "thumbnail"}
                    className={styles.embedThumb}
                    loading="lazy"
                  />
                </a>
              )}
            </div>
            {/* Large image below text (e.g. Newgrounds portal submissions) */}
            {hasLargeImage && (() => {
              const imgSrc = embed.image.proxyURL || embed.image.url;
              const maxW = 400, maxH = 300;
              let w = embed.image.width || maxW, h = embed.image.height || maxH;
              if (w > maxW) { h = Math.round(h * (maxW / w)); w = maxW; }
              if (h > maxH) { w = Math.round(w * (maxH / h)); h = maxH; }
              return (
                <a href={embed.url || imgSrc} target="_blank" rel="noopener noreferrer" className={styles.embedImageLink}>
                        <img src={imgSrc} alt={embed.title || "embed image"} width={w} height={h}
                    className={styles.embedImage} loading="lazy" />
                </a>
              );
            })()}
            {/* Video embed inside the card */}
            {embed.video && <EmbedVideo embed={embed} />}
          </div>
        );
      })}
    </div>
  );
}

// ── Embed Video Sub-Component ────────────────────────────────────
function EmbedVideo({ embed }) {
  const poster = embed.thumbnail?.url || embed.thumbnail?.proxyURL || null;
  const videoUrl = embed.video.url || embed.video.proxyURL;
  const isDirectVideo = videoUrl && /\.(mp4|webm|mov)(\?|$)/i.test(videoUrl);
  if (isDirectVideo) {
    return (
      <div className={styles.embedVideoWrap}>
        <video
          src={videoUrl}
          poster={poster}
          className={styles.embedVideo}
          controls
          preload="metadata"
          loop
          muted
          autoPlay
          playsInline
        />
      </div>
    );
  }
  if (poster) {
    return (
      <a href={embed.url || videoUrl} target="_blank" rel="noopener noreferrer" className={styles.embedVideoThumbLink}>
        <img src={poster} alt={embed.title || "Video"} className={styles.embedVideoThumb} loading="lazy" />
        <span className={styles.embedPlayButton}>▶</span>
      </a>
    );
  }
  return null;
}

// ── Reply Context Bar ────────────────────────────────────────────
// Renders a compact bar above the message showing who the user
// replied to, their avatar, and a truncated snippet of the
// referenced message — matching Discord's native reply UI.
function ReplyContext({ replyTo, messageMap }) {
  const ref = messageMap?.get(replyTo);
  if (!ref) {
    // Referenced message is outside the loaded window — show fallback
    return (
      <>
        <div className={styles.replySpine} />
        <div className={styles.replyBar}>
          <span className={styles.replyContent}>
            <span className={styles.replyUnknown}>Original message was deleted or is not loaded</span>
          </span>
        </div>
      </>
    );
  }
  const nameStyle = resolveRoleColorStyle(ref.author);
  const snippet = ref.content || ref.cleanContent || "";
  const truncated = snippet.length > 80 ? snippet.slice(0, 77) + "…" : snippet;
  const hasAttachment = ref.attachments?.length > 0 || ref.embeds?.length > 0;
  return (
    <>
      <div className={styles.replySpine} />
      <div className={styles.replyBar}>
        {ref.author.avatarUrl ? (
          <img src={ref.author.avatarUrl} alt="" className={styles.replyAvatar} loading="lazy" />
        ) : (
          <div className={styles.replyAvatarFallback} style={{ background: getAvatarColor(ref.author.id) }}>
            {(ref.author.displayName || "?")[0].toUpperCase()}
          </div>
        )}
        {ref.author.isBot && (
          <span className={styles.replyBotBadge}>
            <svg className={styles.botBadgeIcon} viewBox="0 0 16 16" fill="currentColor">
              <path d="M7.4,11.17,4,8.62,5,7.26l2,1.53L10.64,4l1.36,1Z" />
            </svg>
            APP
          </span>
        )}
        <span className={styles.replyAuthor} style={nameStyle}>
          @{ref.author.displayName}
        </span>
        <span className={styles.replyContent}>
          {truncated || (hasAttachment ? <>Click to see attachment <span aria-hidden="true">🖼️</span></> : "…")}
        </span>
      </div>
    </>
  );
}

// ── Comprehensive Unicode Emojis for the picker (categorized) ────
const EMOJI_CATEGORIES = [
  { id: "frequent", name: "Frequently Used", icon: "🕐", emojis: [
    "👍","👎","❤️","😂","😮","😢","😡","🔥","🎉","✅","👀","💯","🙏","💀","🤣","😭","🥺","😤","🤔","👏","💪","🫡","🤡","💩",
  ]},
  { id: "people", name: "People & Faces", icon: "😀", emojis: [
    "😀","😃","😄","😁","😆","😅","🤣","😂","🙂","🙃","🫠","😉","😊","😇","🥰","😍","🤩","😘","😗","😚","😙","🥲","😋","😛","😜","🤪","😝","🤑","🤗","🤭","🫢","🫣","🤫","🤔","🫡","🤐","🤨","😐","😑","😶","🫥","😏","😒","🙄","😬","🤥","😌","😔","😪","🤤","😴","😷","🤒","🤕","🤢","🤮","🥵","🥶","🥴","😵","🤯","🤠","🥳","🥸","😎","🤓","🧐","😕","🫤","😟","🙁","😮","😯","😲","😳","🥺","🥹","😦","😧","😨","😰","😥","😢","😭","😱","😖","😣","😞","😓","😩","😫","🥱","😤","😡","😠","🤬","😈","👿","💀","☠️","💩","🤡","👹","👺","👻","👽","👾","🤖","😺","😸","😹","😻","😼","😽","🙀","😿","😾","🙈","🙉","🙊","💌","💘","💝","💖","💗","💓","💞","💕","💟","❣️","💔","❤️‍🔥","❤️‍🩹","❤️","🩷","🧡","💛","💚","💙","🩵","💜","🤎","🖤","🩶","🤍","👋","🤚","🖐️","✋","🖖","🫱","🫲","🫳","🫴","🫷","🫸","👌","🤌","🤏","✌️","🤞","🫰","🤟","🤘","🤙","👈","👉","👆","🖕","👇","☝️","🫵","👍","👎","✊","👊","🤛","🤜","👏","🙌","🫶","👐","🤲","🤝","🙏","✍️","💅","🤳","💪","🦾","🦿","🦵","🦶","👂","🦻","👃","🧠","🫀","🫁","🦷","🦴","👀","👁️","👅","👄","🫦","👶","🧒","👦","👧","🧑","👱","👨","🧔","👩","🧓","👴","👵",
  ]},
  { id: "nature", name: "Nature", icon: "🌿", emojis: [
    "🐶","🐱","🐭","🐹","🐰","🦊","🐻","🐼","🐻‍❄️","🐨","🐯","🦁","🐮","🐷","🐽","🐸","🐵","🙈","🙉","🙊","🐒","🐔","🐧","🐦","🐤","🐣","🐥","🦆","🦅","🦉","🦇","🐺","🐗","🐴","🦄","🫎","🐝","🪱","🐛","🦋","🐌","🐞","🐜","🪲","🪳","🦟","🦗","🕷️","🦂","🐢","🐍","🦎","🦖","🦕","🐙","🦑","🦐","🦞","🦀","🐡","🐠","🐟","🐬","🐳","🐋","🦈","🪸","🐊","🐅","🐆","🦓","🫏","🦍","🦧","🐘","🦛","🦏","🐪","🐫","🦒","🦘","🦬","🐃","🐂","🐄","🐎","🐖","🐏","🐑","🦙","🐐","🦌","🐕","🐩","🦮","🐕‍🦺","🐈","🐈‍⬛","🪶","🐓","🦃","🦤","🦚","🦜","🦢","🪿","🦩","🕊️","🐇","🦝","🦨","🦡","🦫","🦦","🦥","🐁","🐀","🐿️","🦔","🐾","🐉","🐲","🌵","🎄","🌲","🌳","🌴","🪵","🌱","🌿","☘️","🍀","🎍","🪴","🎋","🍃","🍂","🍁","🪺","🪹","🍄","🌾","💐","🌷","🌹","🥀","🌺","🌸","🌼","🌻","🌞","🌝","🌛","🌜","🌚","🌕","🌖","🌗","🌘","🌑","🌒","🌓","🌔","🌙","🌎","🌍","🌏","🪐","💫","⭐","🌟","✨","⚡","☄️","💥","🔥","🌪️","🌈","☀️","🌤️","⛅","🌥️","☁️","🌦️","🌧️","⛈️","🌩️","🌨️","❄️","☃️","⛄","🌬️","💨","💧","💦","🫧","☔","☂️","🌊","🌫️",
  ]},
  { id: "food", name: "Food & Drink", icon: "🍔", emojis: [
    "🍇","🍈","🍉","🍊","🍋","🍌","🍍","🥭","🍎","🍏","🍐","🍑","🍒","🍓","🫐","🥝","🍅","🫒","🥥","🥑","🍆","🥔","🥕","🌽","🌶️","🫑","🥒","🥬","🥦","🧄","🧅","🍄","🥜","🫘","🌰","🍞","🥐","🥖","🫓","🥨","🥯","🥞","🧇","🧀","🍖","🍗","🥩","🥓","🍔","🍟","🍕","🌭","🥪","🌮","🌯","🫔","🥙","🧆","🥚","🍳","🥘","🍲","🫕","🥣","🥗","🍿","🧈","🧂","🥫","🍱","🍘","🍙","🍚","🍛","🍜","🍝","🍠","🍢","🍣","🍤","🍥","🥮","🍡","🥟","🥠","🥡","🦀","🦞","🦐","🦑","🦪","🍦","🍧","🍨","🍩","🍪","🎂","🍰","🧁","🥧","🍫","🍬","🍭","🍮","🍯","🍼","🥛","☕","🫖","🍵","🍶","🍾","🍷","🍸","🍹","🍺","🍻","🥂","🥃","🫗","🥤","🧋","🧃","🧉","🧊",
  ]},
  { id: "activities", name: "Activities", icon: "⚽", emojis: [
    "⚽","🏀","🏈","⚾","🥎","🎾","🏐","🏉","🥏","🎱","🪀","🏓","🏸","🏒","🏑","🥍","🏏","🪃","🥅","⛳","🪁","🏹","🎣","🤿","🥊","🥋","🎽","🛹","🛼","🛷","⛸️","🥌","🎿","⛷️","🏂","🪂","🏋️","🤼","🤸","🤺","⛹️","🤾","🏌️","🏇","🧘","🏄","🏊","🤽","🚣","🧗","🚵","🚴","🏆","🥇","🥈","🥉","🏅","🎖️","🏵️","🎗️","🎪","🤹","🎭","🩰","🎨","🎬","🎤","🎧","🎼","🎹","🥁","🪘","🎷","🎺","🪗","🎸","🪕","🎻","🪈","🎲","♟️","🎯","🎳","🎮","🕹️","🎰",
  ]},
  { id: "travel", name: "Travel & Places", icon: "✈️", emojis: [
    "🚗","🚕","🚙","🚌","🚎","🏎️","🚓","🚑","🚒","🚐","🛻","🚚","🚛","🚜","🏍️","🛵","🦽","🦼","🛺","🚲","🛴","🛹","🛼","🚏","🛣️","🛤️","🛞","⛽","🛟","🚨","🚥","🚦","🛑","🚧","⚓","🛟","⛵","🛶","🚤","🛳️","⛴️","🛥️","🚢","✈️","🛩️","🛫","🛬","🪂","💺","🚁","🚟","🚠","🚡","🛰️","🚀","🛸","🛎️","🧳","⏰","🕐","🕑","🕒","🕓","🕔","🕕","🕖","🕗","🕘","🕙","🕚","🕛","🌑","🌒","🌓","🌔","🌕","🌖","🌗","🌘","🌙","🌚","🌛","🌜","☀️","🌝","🌞","⭐","🌟","🌠","🏠","🏡","🏢","🏣","🏤","🏥","🏦","🏨","🏩","🏪","🏫","🏬","🏭","🏯","🏰","💒","🗼","🗽","⛪","🕌","🛕","🕍","⛩️","🕋","⛲","⛺","🌁","🌃","🏙️","🌄","🌅","🌆","🌇","🌉","♨️","🎠","🛝","🎡","🎢","💈","🎪","🗺️","🧭","🏔️","⛰️","🌋","🗻","🏕️","🏖️","🏜️","🏝️","🏞️",
  ]},
  { id: "objects", name: "Objects", icon: "💡", emojis: [
    "⌚","📱","📲","💻","⌨️","🖥️","🖨️","🖱️","🖲️","🕹️","🗜️","💾","💿","📀","📼","📷","📸","📹","🎥","📽️","🎞️","📞","☎️","📟","📠","📺","📻","🎙️","🎚️","🎛️","🧭","⏱️","⏲️","⏰","🕰️","⌛","⏳","📡","🔋","🪫","🔌","💡","🔦","🕯️","🪔","🧯","🛢️","💸","💵","💴","💶","💷","🪙","💰","💳","🪪","💎","⚖️","🪜","🧰","🪛","🔧","🔨","⚒️","🛠️","⛏️","🪚","🔩","⚙️","🪤","🧱","⛓️","🧲","🔫","💣","🧨","🪓","🔪","🗡️","⚔️","🛡️","🚬","⚰️","🪦","⚱️","🏺","🔮","📿","🧿","🪬","💈","⚗️","🔭","🔬","🕳️","🩹","🩺","🩻","🩼","💊","💉","🩸","🧬","🦠","🧫","🧪","🌡️","🧹","🪠","🧺","🧻","🪣","🧼","🫧","🪥","🧽","🧴","🛎️","🔑","🗝️","🚪","🪑","🛋️","🛏️","🛌","🧸","🪆","🖼️","🪞","🪟","🛍️","🛒","🎁","🎈","🎏","🎀","🪄","🪅","🎊","🎉","🎎","🏮","🎐","🧧","✉️","📩","📨","📧","💌","📥","📤","📦","🏷️","🪧","📪","📫","📬","📭","📮","📯","📜","📃","📄","📑","🧾","📊","📈","📉","🗒️","🗓️","📆","📅","🗑️","📇","🗃️","🗳️","🗄️","📋","📁","📂","🗂️","🗞️","📰","📓","📔","📒","📕","📗","📘","📙","📚","📖","🔖","🧷","🔗","📎","🖇️","📐","📏","🧮","📌","📍","✂️","🖊️","🖋️","✒️","🖌️","🖍️","📝","✏️","🔍","🔎","🔏","🔐","🔒","🔓",
  ]},
  { id: "symbols", name: "Symbols", icon: "💠", emojis: [
    "❤️","🧡","💛","💚","💙","💜","🖤","🤍","🤎","💔","❤️‍🔥","❤️‍🩹","❣️","💕","💞","💓","💗","💖","💘","💝","💟","☮️","✝️","☪️","🕉️","☸️","✡️","🔯","🕎","☯️","☦️","🛐","⛎","♈","♉","♊","♋","♌","♍","♎","♏","♐","♑","♒","♓","🆔","⚛️","🉑","☢️","☣️","📴","📳","🈶","🈚","🈸","🈺","🈷️","✴️","🆚","💮","🉐","㊙️","㊗️","🈴","🈵","🈹","🈲","🅰️","🅱️","🆎","🆑","🅾️","🆘","❌","⭕","🛑","⛔","📛","🚫","💯","💢","♨️","🚷","🚯","🚳","🚱","🔞","📵","🚭","❗","❕","❓","❔","‼️","⁉️","🔅","🔆","〽️","⚠️","🚸","🔱","⚜️","🔰","♻️","✅","🈯","💹","❇️","✳️","❎","🌐","💠","Ⓜ️","🌀","💤","🏧","🚾","♿","🅿️","🛗","🈳","🈂️","🛂","🛃","🛄","🛅","🚹","🚺","🚼","⚧️","🚻","🚮","🎦","📶","🈁","🔣","ℹ️","🔤","🔡","🔠","🆖","🆗","🆙","🆒","🆕","🆓","0️⃣","1️⃣","2️⃣","3️⃣","4️⃣","5️⃣","6️⃣","7️⃣","8️⃣","9️⃣","🔟","🔢","#️⃣","*️⃣","⏏️","▶️","⏸️","⏯️","⏹️","⏺️","⏭️","⏮️","⏩","⏪","⏫","⏬","◀️","🔼","🔽","➡️","⬅️","⬆️","⬇️","↗️","↘️","↙️","↖️","↕️","↔️","↪️","↩️","⤴️","⤵️","🔀","🔁","🔂","🔄","🔃","🎵","🎶","➕","➖","➗","✖️","🟰","♾️","💲","💱","™️","©️","®️","〰️","➰","➿","🔚","🔙","🔛","🔝","🔜","✔️","☑️","🔘","🔴","🟠","🟡","🟢","🔵","🟣","⚫","⚪","🟤","🔺","🔻","🔸","🔹","🔶","🔷","🔳","🔲","▪️","▫️","◾","◽","◼️","◻️","🟥","🟧","🟨","🟩","🟦","🟪","⬛","⬜","🟫","🔈","🔇","🔉","🔊","🔔","🔕","📣","📢","👁️‍🗨️","💬","💭","🗯️","♠️","♣️","♥️","♦️","🃏","🎴","🀄",
  ]},
  { id: "flags", name: "Flags", icon: "🏳️", emojis: [
    "🏁","🚩","🎌","🏴","🏳️","🏳️‍🌈","🏳️‍⚧️","🏴‍☠️","🇺🇸","🇬🇧","🇨🇦","🇦🇺","🇩🇪","🇫🇷","🇪🇸","🇮🇹","🇯🇵","🇰🇷","🇨🇳","🇷🇺","🇧🇷","🇲🇽","🇮🇳","🇳🇱","🇸🇪","🇳🇴","🇩🇰","🇫🇮","🇵🇱","🇹🇷","🇦🇷","🇨🇱","🇨🇴","🇵🇪","🇻🇪","🇨🇺","🇵🇷","🇺🇦","🇮🇱","🇸🇦","🇦🇪","🇪🇬","🇿🇦","🇳🇬","🇰🇪","🇬🇭","🇹🇭","🇻🇳","🇮🇩","🇵🇭","🇲🇾","🇸🇬","🇳🇿","🇵🇹","🇬🇷","🇨🇿","🇦🇹","🇨🇭","🇧🇪","🇮🇪","🇭🇺","🇷🇴",
  ]},
];

// ── localStorage helpers for reaction dedup ──────────────────────
const REACT_STORAGE_KEY = "discord-reactions";
const REACT_MAX_ENTRIES = 500;

function loadReactedSet() {
  try {
    const raw = localStorage.getItem(REACT_STORAGE_KEY);
    return raw ? new Set(JSON.parse(raw)) : new Set();
  } catch {
    return new Set();
  }
}

function persistReactedSet(set) {
  try {
    let arr = Array.from(set);
    // FIFO eviction if over limit
    if (arr.length > REACT_MAX_ENTRIES) {
      arr = arr.slice(arr.length - REACT_MAX_ENTRIES);
    }
    localStorage.setItem(REACT_STORAGE_KEY, JSON.stringify(arr));
  } catch {
    // localStorage full or unavailable — silent
  }
}

function buildReactKey(messageId, emoji) {
  // For custom emojis the identifier is "name:id", for Unicode it's the char
  return `${messageId}:${emoji}`;
}

// ── Emoji Picker ─────────────────────────────────────────────────
// A floating popover showing Unicode + server custom emojis with
// search filtering, category tabs, and server emoji integration.
// Opens above the trigger element like Discord's native picker.
function EmojiPicker({ anchorRef, serverEmojis, onSelect, onClose }) {
  const pickerRef = useRef(null);
  const searchRef = useRef(null);
  const bodyRef = useRef(null);
  const [filter, setFilter] = useState("");
  const [activeCategory, setActiveCategory] = useState(
    serverEmojis?.length ? "server" : "frequent",
  );

  // Auto-focus the search input when picker opens
  useEffect(() => {
    searchRef.current?.focus();
  }, []);

  // Position the picker above the anchor (Discord-style)
  useEffect(() => {
    const anchor = anchorRef?.current;
    const picker = pickerRef.current;
    if (!anchor || !picker) return;
    const rect = anchor.getBoundingClientRect();
    const pickerH = picker.offsetHeight || 460;
    // Position above the trigger
    let top = rect.top - pickerH - 8;
    // If it goes off-screen top, position below instead
    if (top < 8) top = rect.bottom + 8;
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
  for (const cat of EMOJI_CATEGORIES) {
    allCategories.push(cat);
  }

  // Filter server emojis
  const filteredCustom = serverEmojis
    ? serverEmojis.filter((e) => !filter || e.name.toLowerCase().includes(lowerFilter))
    : [];

  // Scroll to a category section
  const scrollToCategory = (catId) => {
    setActiveCategory(catId);
    if (filter) setFilter(""); // clear search when clicking a category
    const el = bodyRef.current?.querySelector(`[data-category="${catId}"]`);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  // When searching, show filtered results from all categories
  const isSearching = filter.length > 0;

  return (
    <>
      <div className={styles.emojiPickerOverlay} onClick={onClose} />
      <div className={styles.emojiPicker} ref={pickerRef}>
        <input
          ref={searchRef}
          className={styles.emojiPickerSearch}
          type="text"
          placeholder="Search emojis…"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        />
        <div className={styles.emojiPickerMain}>
          {/* Category sidebar tabs */}
          <div className={styles.emojiCategorySidebar}>
            {allCategories.map((cat) => (
              <button
                key={cat.id}
                className={`${styles.emojiCategoryTab} ${activeCategory === cat.id ? styles.emojiCategoryTabActive : ""}`}
                type="button"
                onClick={() => scrollToCategory(cat.id)}
                title={cat.name}
              >
                {cat.id === "server" && serverEmojis?.[0] ? (
                  <img
                    src={emojiUrl(serverEmojis[0].id, serverEmojis[0].animated)}
                    alt=""
                    className={styles.emojiCategoryTabImg}
                    draggable={false}
                  />
                ) : (
                  <span>{cat.icon}</span>
                )}
              </button>
            ))}
          </div>

          {/* Emoji grid body */}
          <div className={styles.emojiPickerBody} ref={bodyRef}>
            {isSearching ? (
              /* ── Search results view ────────────────────────── */
              <>
                {filteredCustom.length > 0 && (
                  <>
                    <div className={styles.emojiPickerSection}>Server Emojis</div>
                    <div className={styles.emojiPickerGrid}>
                      {filteredCustom.map((emoji) => (
                        <button
                          key={emoji.id}
                          className={styles.emojiPickerItem}
                          type="button"
                          onClick={() => onSelect(`${emoji.name}:${emoji.id}`)}
                          title={`:${emoji.name}:`}
                        >
                          <img
                            src={emojiUrl(emoji.id, emoji.animated)}
                            alt={`:${emoji.name}:`}
                            className={styles.emojiPickerCustomImg}
                            draggable={false}
                            loading="lazy"
                          />
                        </button>
                      ))}
                    </div>
                  </>
                )}
                {/* Unicode categories that match are harder to search, show all */}
                {EMOJI_CATEGORIES.map((cat) => (
                  <div key={cat.id}>
                    <div className={styles.emojiPickerSection}>{cat.name}</div>
                    <div className={styles.emojiPickerGrid}>
                      {cat.emojis.map((emoji) => (
                        <button
                          key={emoji}
                          className={styles.emojiPickerItem}
                          type="button"
                          onClick={() => onSelect(emoji)}
                          title={emoji}
                        >
                          {emoji}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
                {filteredCustom.length === 0 && (
                  <div className={styles.emojiPickerEmpty}>No matching emojis found</div>
                )}
              </>
            ) : (
              /* ── Category browsing view ─────────────────────── */
              <>
                {/* Server emojis (first, if present) */}
                {serverEmojis?.length > 0 && (
                  <div data-category="server">
                    <div className={styles.emojiPickerSection}>Server Emojis</div>
                    <div className={styles.emojiPickerGrid}>
                      {serverEmojis.map((emoji) => (
                        <button
                          key={emoji.id}
                          className={styles.emojiPickerItem}
                          type="button"
                          onClick={() => onSelect(`${emoji.name}:${emoji.id}`)}
                          title={`:${emoji.name}:`}
                        >
                          <img
                            src={emojiUrl(emoji.id, emoji.animated)}
                            alt={`:${emoji.name}:`}
                            className={styles.emojiPickerCustomImg}
                            draggable={false}
                            loading="lazy"
                          />
                        </button>
                      ))}
                    </div>
                  </div>
                )}
                {/* Unicode categories */}
                {EMOJI_CATEGORIES.map((cat) => (
                  <div key={cat.id} data-category={cat.id}>
                    <div className={styles.emojiPickerSection}>{cat.name}</div>
                    <div className={styles.emojiPickerGrid}>
                      {cat.emojis.map((emoji) => (
                        <button
                          key={emoji}
                          className={styles.emojiPickerItem}
                          type="button"
                          onClick={() => onSelect(emoji)}
                          title={emoji}
                        >
                          {emoji}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

// ── Message Actions (hover bar) ──────────────────────────────────
// Floating action buttons that appear top-right on message hover.
function MessageActions({ messageId, onOpenPicker, pickerMessageId }) {
  const btnRef = useRef(null);
  const isPickerOpen = pickerMessageId === messageId;

  return (
    <div className={`${styles.messageActions} ${isPickerOpen ? styles.messageActionsVisible : ""}`}>
      <button
        ref={btnRef}
        className={styles.actionBtn}
        type="button"
        onClick={() => onOpenPicker(messageId, btnRef)}
        title="Add Reaction"
      >
        😀
      </button>
    </div>
  );
}

// ── Emoji Reactions ──────────────────────────────────────────
// Renders emoji reaction pills below message content, matching
// Discord's native reaction capsules with count badges.
// Clicking a pill triggers a reaction via the bot. Already-reacted
// pills show a blurple highlight and are non-repeatable.
// The "+" add-reaction button lives in the hover MessageActions bar,
// not inline here — matching Discord's native UX.
function Reactions({ reactions, messageId, reactedSet, onReact }) {
  // Show nothing if no existing reactions
  if (!reactions?.length) return null;
  return (
    <div className={styles.reactions}>
      {reactions.map((r, i) => {
        const emoji = r.emoji;
        const emojiIdentifier = emoji.id ? `${emoji.name}:${emoji.id}` : emoji.name;
        const reactKey = buildReactKey(messageId, emojiIdentifier);
        const hasReacted = reactedSet?.has(reactKey);
        const pillClass = hasReacted ? styles.reactionPillReacted : styles.reactionPill;

        // Custom server emoji → CDN image
        if (emoji.id) {
          return (
            <button
              key={`${emoji.id}-${i}`}
              className={pillClass}
              type="button"
              onClick={() => !hasReacted && onReact?.(messageId, emojiIdentifier)}
              title={hasReacted ? "You reacted" : `:${emoji.name}:`}
            >
              <img
                src={emojiUrl(emoji.id, emoji.animated)}
                alt={`:${emoji.name}:`}
                className={styles.reactionEmoji}
                loading="lazy"
                draggable={false}
              />
              <span className={styles.reactionCount}>{r.count}</span>
            </button>
          );
        }
        // Unicode emoji
        return (
          <button
            key={`${emoji.name}-${i}`}
            className={pillClass}
            type="button"
            onClick={() => !hasReacted && onReact?.(messageId, emojiIdentifier)}
            title={hasReacted ? "You reacted" : emoji.name}
          >
            <span className={styles.reactionUnicode}>{emoji.name}</span>
            <span className={styles.reactionCount}>{r.count}</span>
          </button>
        );
      })}
    </div>
  );
}

// ── Status Indicator ─────────────────────────────────────────────
function StatusDot({ status }) {
  const colors = { online: "#23a559", idle: "#f0b232", dnd: "#f23f43" };
  return (
    <span className={styles.statusDot} style={{ background: colors[status] || "#80848e" }}
      title={status} />
  );
}

// ── Channel Sidebar Item ─────────────────────────────────────────
function ChannelItem({ channel, isActive, onClick }) {
  return (
    <button
      className={`${styles.channelItem} ${isActive ? styles.channelItemActive : ""}`}
      onClick={() => onClick(channel)}
      title={channel.topic || channel.name}
    >
      <span className={styles.channelHash}>#</span>
      <span className={styles.channelItemName}>{channel.name}</span>
    </button>
  );
}

// ── Members Sidebar ──────────────────────────────────────────────
function MemberItem({ member }) {
  return (
    <div className={styles.memberItem}>
      <div className={styles.memberAvatarWrap}>
        {member.avatarUrl ? (
          <img src={member.avatarUrl} alt="" className={styles.memberAvatar} loading="lazy" />
        ) : (
          <div className={styles.memberAvatarFallback} style={{ background: getAvatarColor(member.id) }}>
            {(member.displayName || "?")[0].toUpperCase()}
          </div>
        )}
        <StatusDot status={member.status} />
      </div>
      <div className={styles.memberInfo}>
        <div className={styles.memberNameRow}>
          <span
            className={styles.memberName}
            style={member.roleColors?.secondary
              ? resolveRoleColorStyle(member)
              : { color: member.roleColor || "#dbdee1" }
            }
          >
            {member.displayName}
          </span>
          {member.isBot && (
            <span className={styles.memberBotBadge}>
              <svg className={styles.botBadgeIcon} viewBox="0 0 16 16" fill="currentColor">
                <path d="M7.4,11.17,4,8.62,5,7.26l2,1.53L10.64,4l1.36,1Z" />
              </svg>
              APP
            </span>
          )}
          <UserBadges badges={member.badges} />
        </div>
        {member.roleTags?.length > 0 && (
          <RoleTags roleTags={member.roleTags} />
        )}
        {member.activity && (
          <span className={styles.memberActivity}>{member.activity}</span>
        )}
      </div>
    </div>
  );
}

// ═════════════════════════════════════════════════════════════════
//  DiscordChat Component
// ═════════════════════════════════════════════════════════════════

export default function DiscordChatComponent({
  messageCount = 500,
  joinMode = false,
  inviteUrl = "https://discord.gg/sBX7BxP",
  onJoinHoverChange,
  channelIds = [],
  channelsUrl = "/api/discord/channels",
  streamUrl = "/api/discord/stream",
  membersUrl = "/api/discord/members",
  tenorOembedUrl = "/api/tenor/oembed",
  reactUrl = "/api/discord/react",
  emojisUrl = "/api/discord/emojis",
  serverIconUrl,
  serverBannerUrl: serverBannerUrlProp,
  servers = [],
}) {
  const CHANNEL_IDS = channelIds;
  const [channels, setChannels] = useState([]);
  const [serverName, setServerName] = useState("");
  const [serverIcon, setServerIcon] = useState(serverIconUrl || null);
  const [serverBannerUrl, setServerBannerUrl] = useState(serverBannerUrlProp || null);
  const [activeChannelId, setActiveChannelId] = useState(CHANNEL_IDS[0]);
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
        if (cancelled) return;
        if (data.guildName) setServerName(data.guildName);
        if (data.guildIcon) setServerIcon((prev) => prev || data.guildIcon);
        if (data.guildBanner) setServerBannerUrl((prev) => prev || data.guildBanner);
        else if (data.guildSplash) setServerBannerUrl((prev) => prev || data.guildSplash);
        // Filter to only the whitelisted channels, sorted by Discord position
        const idSet = new Set(CHANNEL_IDS);
        const filtered = (data.channels || [])
          .filter((ch) => idSet.has(ch.id))
          .sort((a, b) => (a.position ?? 0) - (b.position ?? 0));
        setChannels(filtered.length > 0 ? filtered : CHANNEL_IDS.map((id) => ({ id, name: id })));
      })
      .catch(() => {
        // Fallback — use IDs as names
        if (!cancelled) setChannels(CHANNEL_IDS.map((id) => ({ id, name: id })));
      });
    return () => { cancelled = true; };
  }, []);

  // ── Scroll to bottom ────────────────────────────────────────────
  const scrollToBottom = useCallback((instant = false) => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollTo({ top: el.scrollHeight, behavior: instant ? "instant" : "smooth" });
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
      const t = setTimeout(() => scrollToBottom(true), 200);
      return () => clearTimeout(t);
    }
  }, [messages, scrollToBottom]);

  // ── SSE stream for messages ─────────────────────────────────────
  useEffect(() => {
    let es;
    let retryTimeout;

    function connect() {
      es = new EventSource(`${streamUrl}?limit=${messageCount}&channelId=${activeChannelId}`);

      es.addEventListener("init", (e) => {
        try {
          const { messages: msgs } = JSON.parse(e.data);
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
            if (firstMsg.guildIcon && firstMsg.guildId) {
              const ext = firstMsg.guildIcon.startsWith("a_") ? "gif" : "png";
              const url = `https://cdn.discordapp.com/icons/${firstMsg.guildId}/${firstMsg.guildIcon}.${ext}?size=128`;
              setServerIcon((prev) => prev || url);
            }
            if (firstMsg.guildBanner && firstMsg.guildId) {
              const url = `https://cdn.discordapp.com/banners/${firstMsg.guildId}/${firstMsg.guildBanner}.png?size=480`;
              setServerBannerUrl((prev) => prev || url);
            } else if (firstMsg.guildSplash && firstMsg.guildId) {
              const url = `https://cdn.discordapp.com/splashes/${firstMsg.guildId}/${firstMsg.guildSplash}.png?size=480`;
              setServerBannerUrl((prev) => prev || url);
            }
            // Build channel name map from all messages in the batch
            setChannels((prev) => {
              // If we already have real names (not just IDs), keep them
              const hasRealNames = prev.some((ch) => ch.name !== ch.id);
              if (hasRealNames) return prev;

              const channelMap = new Map();
              for (const msg of reversed) {
                if (msg.channelId && msg.channelName) {
                  channelMap.set(msg.channelId, msg.channelName);
                }
              }
              if (channelMap.size === 0) return prev;

              // Merge discovered names into existing channel list
              return prev.map((ch) => ({
                ...ch,
                name: channelMap.get(ch.id) || ch.name,
              }));
            });
          }
        } catch (err) {
          console.error("[DiscordChat] Init parse error:", err);
        }
      });

      es.addEventListener("new", (e) => {
        try {
          const { messages: newMsgs } = JSON.parse(e.data);
          if (!newMsgs?.length) return;
          shouldSnapToBottom.current = true;
          setMessages((prev) => {
            const appended = [...prev, ...newMsgs.reverse()];
            return appended.length > messageCount ? appended.slice(appended.length - messageCount) : appended;
          });
        } catch (err) {
          console.error("[DiscordChat] New message parse error:", err);
        }
      });

      es.addEventListener("delete", (e) => {
        try {
          const { ids } = JSON.parse(e.data);
          if (!ids?.length) return;
          const deletedSet = new Set(ids);
          setMessages((prev) => prev.filter((msg) => !deletedSet.has(msg.id)));
        } catch (err) {
          console.error("[DiscordChat] Delete event parse error:", err);
        }
      });

      // Reaction (and other field) changes on existing messages.
      // The server detects when a message's reactions fingerprint
      // changes and sends the full updated message object.
      es.addEventListener("update", (e) => {
        try {
          const { messages: updatedMsgs } = JSON.parse(e.data);
          if (!updatedMsgs?.length) return;
          const updateMap = new Map(updatedMsgs.map((m) => [m.id, m]));
          setMessages((prev) =>
            prev.map((msg) => {
              const updated = updateMap.get(msg.id);
              return updated ? { ...msg, reactions: updated.reactions } : msg;
            }),
          );
        } catch (err) {
          console.error("[DiscordChat] Update event parse error:", err);
        }
      });

      es.addEventListener("error", () => {
        if (es.readyState === EventSource.CLOSED) {
          console.warn("[DiscordChat] SSE closed, retrying in 3s…");
          es.close();
          retryTimeout = setTimeout(connect, 3_000);
        }
      });
    }

    connect();
    return () => {
      if (es) es.close();
      if (retryTimeout) clearTimeout(retryTimeout);
    };
  }, [messageCount, scrollToBottom, activeChannelId]);

  // ── Fetch members (poll every 30s) ──────────────────────────────
  useEffect(() => {
    let cancelled = false;
    async function fetchMembers() {
      try {
        const res = await fetch(membersUrl);
        if (res.ok && !cancelled) {
          setMembers(await res.json());
        }
      } catch {
        // silently ignore — sidebar is non-critical
      }
    }
    fetchMembers();
    const interval = setInterval(fetchMembers, 30_000);
    return () => { cancelled = true; clearInterval(interval); };
  }, []);

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
        if (!cancelled && data.emojis) setServerEmojis(data.emojis);
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
    if (reactedSet.has(reactKey)) return;

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
    setMessages((prev) =>
      prev.map((msg) => {
        if (msg.id !== messageId) return msg;
        const reactions = msg.reactions ? [...msg.reactions] : [];
        const isCustom = /^\w+:\d+$/.test(emojiIdentifier);
        const idx = reactions.findIndex((r) => {
          if (isCustom) return r.emoji.id === emojiIdentifier.split(":")[1];
          return r.emoji.name === emojiIdentifier && !r.emoji.id;
        });
        if (idx >= 0) {
          reactions[idx] = { ...reactions[idx], count: reactions[idx].count + 1 };
        } else {
          // New reaction
          if (isCustom) {
            const [name, id] = emojiIdentifier.split(":");
            reactions.push({ emoji: { id, name, animated: false }, count: 1 });
          } else {
            reactions.push({ emoji: { id: null, name: emojiIdentifier, animated: false }, count: 1 });
          }
        }
        return { ...msg, reactions };
      }),
    );

    try {
      const res = await fetch(reactUrl, {
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
      if (!res.ok && res.status !== 409) {
        // Revert optimistic update on real failure
        console.warn("[DiscordChat] React failed:", res.status);
        setReactedSet((prev) => {
          const next = new Set(prev);
          next.delete(reactKey);
          persistReactedSet(next);
          return next;
        });
      }
    } catch (err) {
      console.error("[DiscordChat] React error:", err);
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
  const handleOpenPicker = useCallback((messageId, anchorRef) => {
    pickerAnchorRef.current = anchorRef;
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

  return (
    <div className={styles.container} id="discord-chat">
      {/* ── Title Bar ─────────────────────────────────────────── */}
      <div className={styles.titleBar}>
        <div className={styles.trafficLights}>
          <span className={styles.trafficDot} />
          <span className={styles.trafficDot} />
          <span className={styles.trafficDot} />
        </div>
        <span className={styles.titleBarCenter}>
          {serverIcon && (
            <img src={serverIcon} alt="" className={styles.titleBarClock} aria-hidden="true" />
          )}
          <span className={styles.channelName}>{serverName || "Discord"}</span>
        </span>
        <span className={styles.onlineDot} />
        {members && (
          <span className={styles.channelTopic}>
            {members.totalOnline} online · {members.totalMembers} members
          </span>
        )}
      </div>

      {/* ── Four-Panel Layout (Guild Bar + Channels + Chat + Members) */}
      <div className={styles.panelLayout}>
        {/* ── Guild Bar (Server List Rail) ─────────────────────── */}
        <nav className={styles.guildBar} aria-label="Servers">
          {/* Home / DM button */}
          <button className={styles.guildBarHome} title="Direct Messages">
            <svg width="28" height="20" viewBox="0 0 28 20" fill="currentColor">
              <path d="M23.0212 1.67671C21.3107 0.879656 19.5079 0.318797 17.6584 0C17.4062 0.461742 17.1749 0.934541 16.966 1.4184C15.0099 1.11706 13.0236 1.11706 11.0675 1.4184C10.8585 0.934541 10.6272 0.461742 10.3749 0C8.52404 0.320819 6.72029 0.882524 5.00882 1.68093C1.47767 7.01788 0.404834 12.216 0.93776 17.3363C3.01815 18.8838 5.37198 19.9903 7.87029 20.5984C8.39591 19.8931 8.86441 19.1447 9.27153 18.3603C8.51536 18.0784 7.78792 17.7241 7.09936 17.3023C7.28989 17.1629 7.47591 17.0186 7.65739 16.8744C12.0547 18.9136 16.9758 18.9136 21.376 16.8744C21.5575 17.0186 21.7435 17.1629 21.934 17.3023C21.2447 17.7248 20.5165 18.0797 19.7597 18.3624C20.1661 19.1454 20.6337 19.8925 21.1583 20.5963C23.6581 19.99 26.0132 18.8845 28.0936 17.3384C28.7196 11.3653 27.1385 6.21906 23.0212 1.67671Z" />
            </svg>
          </button>
          <div className={styles.guildBarSeparator} />

          {/* Current server */}
          <button
            className={`${styles.guildBarItem} ${styles.guildBarItemActive}`}
            title={serverName || "Discord"}
          >
            {serverIcon ? (
              <img src={serverIcon} alt="" className={styles.guildBarIcon} />
            ) : (
              <span className={styles.guildBarInitial}>
                {(serverName || "D")[0].toUpperCase()}
              </span>
            )}
            <span className={styles.guildBarPill} />
          </button>

          {/* Additional servers from props */}
          {servers.map((srv) => (
            <button
              key={srv.id || srv.name}
              className={styles.guildBarItem}
              title={srv.name}
            >
              {srv.iconUrl ? (
                <img src={srv.iconUrl} alt="" className={styles.guildBarIcon} />
              ) : (
                <span className={styles.guildBarInitial}>
                  {(srv.name || "?")[0].toUpperCase()}
                </span>
              )}
            </button>
          ))}
        </nav>

        {/* ── Left Sidebar: Channels ──────────────────────────── */}
        <aside className={styles.channelSidebar}>
          {/* Server Banner / Header */}
          <div className={`${styles.serverHeader} ${serverBannerUrl ? styles.serverHeaderBanner : ""}`}>
            {serverBannerUrl && (
              <img
                src={serverBannerUrl}
                alt=""
                className={styles.serverBannerImage}
                loading="lazy"
                draggable={false}
              />
            )}
            <span className={styles.serverName}>{serverName || "Discord"}</span>
          </div>
          <div className={styles.channelList}>
            {(() => {
              // Group channels by their Discord category (parentName).
              // Preserves the order channels arrive from the API (sorted
              // by position), and groups under real category headings.
              const groups = [];
              let lastCategory = null;
              for (const ch of channels) {
                const cat = ch.parentName || "Text Channels";
                if (cat !== lastCategory) {
                  groups.push({ category: cat, items: [] });
                  lastCategory = cat;
                }
                groups[groups.length - 1].items.push(ch);
              }
              return groups.map((group) => (
                <div key={group.category}>
                  <div className={styles.channelCategory}>
                    <span className={styles.categoryName}>{group.category}</span>
                  </div>
                  {group.items.map((ch) => (
                    <ChannelItem
                      key={ch.id}
                      channel={ch}
                      isActive={activeChannelId === ch.id}
                      onClick={handleChannelClick}
                    />
                  ))}
                </div>
              ));
            })()}
          </div>
        </aside>

        {/* ── Center: Messages ────────────────────────────────── */}
        <div className={styles.chatPanel}>
          <div className={styles.messagesArea} ref={scrollRef}>
            {loading && (
              <div className={styles.loading}>
                <div className={styles.loadingDots}>
                  <span className={styles.loadingDot} />
                  <span className={styles.loadingDot} />
                  <span className={styles.loadingDot} />
                </div>
                <span>Loading messages…</span>
              </div>
            )}
            {error && (
              <div className={styles.error}>
                <span className={styles.errorIcon}>⚠️</span>
                <span>Couldn&apos;t load messages</span>
              </div>
            )}
            {!loading && !error && (() => {
              // Build a lookup map for reply references
              const messageMap = new Map(messages.map((m) => [m.id, m]));
              return messages.map((msg, i) => {
                const prev = i > 0 ? messages[i - 1] : null;
                const grouped = shouldGroup(msg, prev);
                const newDay = isDifferentDay(msg, prev);
                const nameStyle = resolveRoleColorStyle(msg.author);
                return (
                  <div key={msg.id}>
                    {newDay && (
                      <div className={styles.dateSeparator}>
                        <span className={styles.dateSeparatorText}>{formatDateSeparator(msg.createdAtISO)}</span>
                      </div>
                    )}
                    {grouped && !newDay ? (
                      <div className={styles.messageRowGrouped}>
                        <span className={styles.timestampInline}>{formatShortTime(msg.createdAtISO)}</span>
                        <MessageActions
                          messageId={msg.id}
                          onOpenPicker={handleOpenPicker}
                          pickerMessageId={pickerMessageId}
                        />
                        <div className={styles.messageContent}>
                          <p className={styles.messageText}>{formatContent(msg.content, msg.cleanContent)}</p>
                          <TenorEmbeds content={msg.content} tenorOembedUrl={tenorOembedUrl} />
                          <ImageAttachments attachments={msg.attachments} />
                          <EmbedMedia embeds={msg.embeds} />
                          <Reactions
                            reactions={msg.reactions}
                            messageId={msg.id}
                            reactedSet={reactedSet}
                            onReact={handleReact}
                          />
                        </div>
                      </div>
                    ) : (
                      <div className={`${styles.messageRow} ${msg.replyTo ? styles.messageRowReply : ""}`}>
                        {msg.replyTo && (
                          <ReplyContext replyTo={msg.replyTo} messageMap={messageMap} />
                        )}
                        {msg.author.avatarUrl ? (
                          <img className={styles.avatar} src={msg.author.avatarUrl}
                            alt={msg.author.displayName} width={40} height={40} loading="lazy" />
                        ) : (
                          <div className={styles.avatarFallback} style={{ background: getAvatarColor(msg.author.id) }}>
                            {(msg.author.displayName || "?")[0].toUpperCase()}
                          </div>
                        )}
                        <MessageActions
                          messageId={msg.id}
                          onOpenPicker={handleOpenPicker}
                          pickerMessageId={pickerMessageId}
                        />
                        <div className={styles.messageContent}>
                          <div className={styles.messageHeader}>
                            <span className={styles.authorName} style={nameStyle}>
                              {msg.author.displayName}
                            </span>
                            {msg.author.isBot && (
                              <span className={styles.botBadge}>
                                <svg className={styles.botBadgeIcon} viewBox="0 0 16 16" fill="currentColor">
                                  <path d="M7.4,11.17,4,8.62,5,7.26l2,1.53L10.64,4l1.36,1Z" />
                                </svg>
                                BOT
                              </span>
                            )}
                            <UserBadges badges={msg.author.badges} />
                            <RoleTags roleTags={msg.author.roleTags} />
                            <span className={styles.timestamp}>{formatTimestamp(msg.createdAtISO)}</span>
                          </div>
                          <p className={styles.messageText}>{formatContent(msg.content, msg.cleanContent)}</p>
                          <TenorEmbeds content={msg.content} tenorOembedUrl={tenorOembedUrl} />
                          <ImageAttachments attachments={msg.attachments} />
                          <EmbedMedia embeds={msg.embeds} />
                          <Reactions
                            reactions={msg.reactions}
                            messageId={msg.id}
                            reactedSet={reactedSet}
                            onReact={handleReact}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                );
              });
            })()}
          </div>

          {/* ── Input Bar / Join CTA ──────────────────────────── */}
          <div className={styles.inputBar}>
            {joinMode ? (
              <a href={inviteUrl} target="_blank" rel="noopener noreferrer"
                className={styles.joinButton} id="discord-join-button"
                onMouseEnter={() => onJoinHoverChange?.(true)}
                onMouseLeave={() => onJoinHoverChange?.(false)}>
                <svg className={styles.joinButtonIcon} viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                  <path d="M19.27 5.33C17.94 4.71 16.5 4.26 15 4a.09.09 0 0 0-.07.03c-.18.33-.39.76-.53 1.09a16.09 16.09 0 0 0-4.8 0c-.14-.34-.36-.76-.54-1.09c-.01-.02-.04-.03-.07-.03c-1.5.26-2.93.71-4.27 1.33c-.01 0-.02.01-.03.02c-2.72 4.07-3.47 8.03-3.1 11.95c0 .02.01.04.03.05c1.8 1.32 3.53 2.12 5.24 2.65c.03.01.06 0 .07-.02c.4-.55.76-1.13 1.07-1.74c.02-.04 0-.08-.04-.09c-.57-.22-1.11-.48-1.64-.78c-.04-.02-.04-.08-.01-.11c.11-.08.22-.17.33-.25c.02-.02.05-.02.07-.01c3.44 1.57 7.15 1.57 10.55 0c.02-.01.05-.01.07.01c.11.09.22.17.33.26c.04.03.04.09-.01.11c-.52.31-1.07.56-1.64.78c-.04.01-.05.06-.04.09c.32.61.68 1.19 1.07 1.74c.03.01.06.02.09.01c1.72-.53 3.45-1.33 5.24-2.65c.02-.01.03-.03.03-.05c.44-4.53-.73-8.46-3.1-11.95c-.01-.01-.02-.02-.04-.02zM8.52 14.91c-1.03 0-1.89-.95-1.89-2.12s.84-2.12 1.89-2.12c1.06 0 1.9.96 1.89 2.12c0 1.17-.84 2.12-1.89 2.12zm6.97 0c-1.03 0-1.89-.95-1.89-2.12s.84-2.12 1.89-2.12c1.06 0 1.9.96 1.89 2.12c0 1.17-.83 2.12-1.89 2.12z" />
                </svg>
                Join the Discord Server
              </a>
            ) : (
              <div className={styles.inputContainer}>
                <span className={styles.inputPlaceholder}>Message #{activeChannel.name}</span>
                <div className={styles.inputIcons}>
                  <span>😀</span><span>🎁</span><span>📎</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ── Right Sidebar: Members ──────────────────────────── */}
        <aside className={styles.memberSidebar}>
          {members ? (
            <div className={styles.memberList}>
              {members.roles?.map((role) => (
                <div key={role.id} className={styles.memberRoleGroup}>
                  <div className={styles.memberRoleHeader}>
                    {role.name} — {role.members.length}
                  </div>
                  {role.members.map((m) => (
                    <MemberItem key={m.id} member={m} />
                  ))}
                </div>
              ))}
              {members.bots?.length > 0 && (
                <div className={styles.memberRoleGroup}>
                  <div className={styles.memberRoleHeader}>
                    Bots — {members.bots.length}
                  </div>
                  {members.bots.map((m) => (
                    <MemberItem key={m.id} member={m} />
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className={styles.loading}>
              <div className={styles.loadingDots}>
                <span className={styles.loadingDot} />
                <span className={styles.loadingDot} />
                <span className={styles.loadingDot} />
              </div>
            </div>
          )}
        </aside>
      </div>

      {/* ── Emoji Picker Portal ────────────────────────────────── */}
      {pickerMessageId && (
        <EmojiPicker
          anchorRef={pickerAnchorRef.current}
          serverEmojis={serverEmojis}
          onSelect={handlePickerSelect}
          onClose={handleClosePicker}
        />
      )}
    </div>
  );
}
