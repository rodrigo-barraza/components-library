import { describe, it, expect } from "vitest";
import { attachmentSource } from "./DiscordChatComponent";

describe("attachmentSource", () => {
  it("prefers the archived url over Discord's expiring proxy link", () => {
    expect(
      attachmentSource({
        url: "/api/media/discord-media/media/abc.jpg",
        proxyURL: "https://media.discordapp.net/attachments/1/2/a.jpg?ex=6aa7f2cb",
      }),
    ).toBe("/api/media/discord-media/media/abc.jpg");
  });

  it("falls back to the proxy link", () => {
    expect(attachmentSource({ url: "", proxyURL: "https://media.discordapp.net/a.jpg" })).toBe(
      "https://media.discordapp.net/a.jpg",
    );
  });
});
