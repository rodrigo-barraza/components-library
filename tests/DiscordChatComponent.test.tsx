import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import {
  __internal,
  type DiscordAttachment,
} from "../src/components/DiscordChatComponent/DiscordChatComponent.tsx";

const {
  formatContent,
  renderMarkdown,
  isEmojiOnly,
  formatDiscordTimestamp,
  formatFileSize,
  isImageAttachment,
  isVideoAttachment,
  isAudioAttachment,
  isVoiceMessage,
  isSpoilerAttachment,
  stickerUrl,
} = __internal;

const emptyCtx = { emojiMap: new Map() };

function markup(content: string, cleanContent?: string) {
  const { container } = render(<div>{formatContent(content, cleanContent)}</div>);
  return container.innerHTML;
}

// ── Markdown: inline styles ────────────────────────────────────

describe("markdown inline styles", () => {
  it("renders bold, italic, underline, strikethrough", () => {
    const html = markup("**bold** *ital* __under__ ~~gone~~");
    expect(html).toContain("<strong>bold</strong>");
    expect(html).toContain("<em>ital</em>");
    expect(html).toContain("<u>under</u>");
    expect(html).toContain("<s>gone</s>");
  });

  it("renders ***bold italic*** nested", () => {
    const html = markup("***both***");
    expect(html).toContain("<strong><em>both</em></strong>");
  });

  it("renders underscore italics without eating snake_case", () => {
    expect(markup("some _italic_ text")).toContain("<em>italic</em>");
    expect(markup("snake_case_name here")).not.toContain("<em>");
  });

  it("supports nesting styles", () => {
    const html = markup("**bold with *inner* text**");
    expect(html).toContain("<strong>");
    expect(html).toContain("<em>inner</em>");
  });

  it("renders inline code without formatting inside", () => {
    const html = markup("run `npm **install**` now");
    expect(html).toContain("npm **install**");
    expect(html).not.toContain("<strong>");
  });

  it("renders masked links with safe attributes", () => {
    const html = markup("[click here](https://example.com/page)");
    expect(html).toContain('href="https://example.com/page"');
    expect(html).toContain("click here");
    expect(html).toContain('rel="noopener noreferrer"');
  });

  it("leaves plain text untouched", () => {
    expect(markup("just a plain message")).toContain("just a plain message");
  });
});

// ── Markdown: block-level ──────────────────────────────────────

describe("markdown blocks", () => {
  it("renders fenced code blocks verbatim", () => {
    const html = markup("look:\n```js\nconst x = **not bold**;\n```\ndone");
    expect(html).toContain("<pre");
    expect(html).toContain("const x = **not bold**;");
    expect(html).not.toContain("<strong>");
    expect(html).toContain("done");
  });

  it("renders single-line block quotes", () => {
    const html = markup("> quoted wisdom\nafter");
    expect(html).toContain("<blockquote");
    expect(html).toContain("quoted wisdom");
    expect(html).toContain("after");
  });

  it(">>> quotes the rest of the message", () => {
    const html = markup(">>> line one\nline two");
    const quoteIndex = html.indexOf("<blockquote");
    expect(quoteIndex).toBeGreaterThan(-1);
    expect(html.indexOf("line two")).toBeGreaterThan(quoteIndex);
  });

  it("renders headers h1–h3", () => {
    const html = markup("# Big\n## Medium\n### Small");
    expect(html).toContain("Big");
    expect(html).toContain("Medium");
    expect(html).toContain("Small");
    expect(html).toMatch(/md-h1/);
    expect(html).toMatch(/md-h3/);
  });

  it("renders subtext and list items", () => {
    const html = markup("-# small print\n- first\n- second");
    expect(html).toMatch(/md-subtext/);
    expect(html).toContain("small print");
    expect((html.match(/md-list-item/g) || []).length).toBe(2);
  });
});

// ── Markdown: Discord tokens ───────────────────────────────────

describe("discord tokens", () => {
  it("renders raw custom emoji tokens as CDN images", () => {
    const html = markup("hello <:pepe:1234567890>");
    expect(html).toContain("cdn.discordapp.com/emojis/1234567890.webp");
    expect(html).toContain(':pepe:');
  });

  it("renders animated emojis as gifs", () => {
    expect(markup("<a:dance:987654321>")).toContain("/987654321.gif");
  });

  it("resolves :name: via raw content emoji map (cleanContent path)", () => {
    const html = markup("hi <:wave:111222333>", "hi :wave:");
    expect(html).toContain("cdn.discordapp.com/emojis/111222333.webp");
  });

  it("styles @mentions", () => {
    expect(markup("thanks @rodrigo!")).toMatch(/class="[^"]*mention[^"]*">@rodrigo/);
  });

  it("renders unresolved mention tokens generically", () => {
    const html = markup("<@123> in <#456> for <@&789>");
    expect(html).toContain("@user");
    expect(html).toContain("#channel");
    expect(html).toContain("@role");
  });

  it("renders <t:…:R> timestamps as relative text", () => {
    const past = Math.floor(Date.now() / 1000) - 3600 * 2;
    const html = markup(`see you <t:${past}:R>`);
    expect(html).toContain("2 hours ago");
  });

  it("linkifies bare URLs and truncates long ones", () => {
    const long = "https://example.com/" + "a".repeat(60);
    const html = markup(long);
    expect(html).toContain(`href="${long}"`);
    expect(html).toContain("...");
  });

  it("skips Tenor URLs in text (rendered as embeds elsewhere)", () => {
    const html = markup("https://tenor.com/view/funny-cat-12345");
    expect(html).not.toContain("<a");
  });

  it("renders ||spoiler|| hidden until clicked", () => {
    const html = markup("the killer is ||the butler||");
    expect(html).toMatch(/spoiler-text/);
    expect(html).toContain("the butler");
  });
});

// ── Jumbo emojis ───────────────────────────────────────────────

describe("isEmojiOnly", () => {
  it("is true for emoji-only messages", () => {
    expect(isEmojiOnly("🔥🔥🔥", new Map())).toBe(true);
    expect(isEmojiOnly("<:pepe:123> <:pepe:123>", new Map())).toBe(true);
  });

  it("is false with any text, digits, or >30 emojis", () => {
    expect(isEmojiOnly("nice 🔥", new Map())).toBe(false);
    expect(isEmojiOnly("123", new Map())).toBe(false);
    expect(isEmojiOnly("🔥".repeat(31), new Map())).toBe(false);
  });
});

// ── Attachment classification ──────────────────────────────────

describe("attachment classification", () => {
  const video: DiscordAttachment = { url: "https://cdn.x/clip.mp4", contentType: "video/mp4", name: "clip.mp4", duration: 12 };
  const voice: DiscordAttachment = { url: "https://cdn.x/voice.ogg", contentType: "audio/ogg", name: "voice-message.ogg", duration: 4, waveform: "AAAA" };
  const song: DiscordAttachment = { url: "https://cdn.x/song.mp3", contentType: "audio/mpeg", name: "song.mp3", size: 4200000 };
  const pdf: DiscordAttachment = { url: "https://cdn.x/doc.pdf", contentType: "application/pdf", name: "doc.pdf", size: 1024 };

  it("videos are videos — never voice messages, even with a duration", () => {
    expect(isVideoAttachment(video)).toBe(true);
    expect(isVoiceMessage(video)).toBe(false);
    expect(isImageAttachment(video)).toBe(false);
  });

  it("waveform audio is a voice message; plain audio is not", () => {
    expect(isVoiceMessage(voice)).toBe(true);
    expect(isVoiceMessage(song)).toBe(false);
    expect(isAudioAttachment(song)).toBe(true);
  });

  it("documents fall through to file handling", () => {
    expect(isImageAttachment(pdf)).toBe(false);
    expect(isVideoAttachment(pdf)).toBe(false);
    expect(isAudioAttachment(pdf)).toBe(false);
  });

  it("falls back to extension when contentType is missing", () => {
    expect(isImageAttachment({ url: "x", name: "photo.PNG" })).toBe(true);
    expect(isVideoAttachment({ url: "x", name: "clip.webm" })).toBe(true);
  });

  it("detects spoilers by flag or filename prefix", () => {
    expect(isSpoilerAttachment({ url: "x", spoiler: true })).toBe(true);
    expect(isSpoilerAttachment({ url: "x", name: "SPOILER_img.png" })).toBe(true);
    expect(isSpoilerAttachment(pdf)).toBe(false);
  });
});

// ── Misc helpers ───────────────────────────────────────────────

describe("helpers", () => {
  it("formatFileSize produces human sizes", () => {
    expect(formatFileSize(512)).toBe("512 bytes");
    expect(formatFileSize(5931843)).toBe("5.66 MB");
    expect(formatFileSize(0)).toBe("");
  });

  it("stickerUrl prefers stored url, builds CDN url otherwise, skips Lottie", () => {
    expect(stickerUrl({ id: "1", url: "https://cdn.discordapp.com/stickers/1.png" }))
      .toBe("https://cdn.discordapp.com/stickers/1.png");
    expect(stickerUrl({ id: "2", format: 4 })).toContain("/stickers/2.gif");
    expect(stickerUrl({ id: "3", format: 3 })).toBeNull();
  });

  it("formatDiscordTimestamp handles absolute styles", () => {
    const unix = Math.floor(new Date("2026-07-04T12:00:00Z").getTime() / 1000);
    expect(formatDiscordTimestamp(unix, "D")).toContain("July");
    expect(formatDiscordTimestamp(unix, "d")).toMatch(/\d{2}\/\d{2}\/\d{4}/);
  });

  it("renderMarkdown handles embed field values with raw emoji tokens", () => {
    const { container } = render(
      <div>{renderMarkdown("259<:Gold:750698118994985050> 22<:Silver:750698133755002964>", emptyCtx)}</div>,
    );
    expect(container.innerHTML).toContain("emojis/750698118994985050.webp");
    expect(container.innerHTML).toContain("emojis/750698133755002964.webp");
  });
});
