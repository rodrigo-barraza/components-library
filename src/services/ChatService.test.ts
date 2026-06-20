import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import ChatService from "./ChatService.js";
import { CHAT_DEFAULTS } from "../constants/chat.js";

describe("ChatService", () => {
  const serviceUrl = "https://api.rod.dev";
  const widgetId = "widget-123";
  let globalFetchMock: any;

  beforeEach(() => {
    localStorage.clear();
    globalFetchMock = vi.spyOn(global, "fetch");
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("should restore visitor and conversation IDs from localStorage on initialization", () => {
    localStorage.setItem(CHAT_DEFAULTS.STORAGE_KEY_VISITOR, "existing-visitor");
    localStorage.setItem(CHAT_DEFAULTS.STORAGE_KEY_CONVERSATION, "existing-convo");

    const service = new ChatService({ serviceUrl, widgetId });

    expect(service.visitorId).toBe("existing-visitor");
    expect(service.conversationId).toBe("existing-convo");
  });

  it("should clear conversation, visitor, and messages on clearConversation", () => {
    localStorage.setItem(CHAT_DEFAULTS.STORAGE_KEY_VISITOR, "visitor-to-clear");
    localStorage.setItem(CHAT_DEFAULTS.STORAGE_KEY_CONVERSATION, "convo-to-clear");
    localStorage.setItem(CHAT_DEFAULTS.STORAGE_KEY_MESSAGES, "[]");

    const service = new ChatService({ serviceUrl, widgetId });
    expect(service.visitorId).toBe("visitor-to-clear");
    expect(service.conversationId).toBe("convo-to-clear");

    service.clearConversation();

    expect(service.visitorId).toBeNull();
    expect(service.conversationId).toBeNull();
    expect(localStorage.getItem(CHAT_DEFAULTS.STORAGE_KEY_VISITOR)).toBeNull();
    expect(localStorage.getItem(CHAT_DEFAULTS.STORAGE_KEY_CONVERSATION)).toBeNull();
    expect(localStorage.getItem(CHAT_DEFAULTS.STORAGE_KEY_MESSAGES)).toBeNull();
  });

  it("should identify visitor and persist ID in localStorage", async () => {
    globalFetchMock.mockResolvedValue({
      ok: true,
      json: async () => ({ visitorId: "new-visitor-id" }),
    });

    const service = new ChatService({ serviceUrl, widgetId });
    const visitor = await service.identifyVisitor({ name: "Alice" });

    expect(visitor.visitorId).toBe("new-visitor-id");
    expect(service.visitorId).toBe("new-visitor-id");
    expect(localStorage.getItem(CHAT_DEFAULTS.STORAGE_KEY_VISITOR)).toBe("new-visitor-id");
  });

  it("should create conversation and persist ID in localStorage", async () => {
    globalFetchMock.mockResolvedValue({
      ok: true,
      json: async () => ({ conversationId: "new-convo-id" }),
    });

    const service = new ChatService({ serviceUrl, widgetId });
    const convo = await service.createConversation();

    expect(convo.conversationId).toBe("new-convo-id");
    expect(service.conversationId).toBe("new-convo-id");
    expect(localStorage.getItem(CHAT_DEFAULTS.STORAGE_KEY_CONVERSATION)).toBe("new-convo-id");
  });

  it("should auto-recover from stale conversation on 404 response", async () => {
    localStorage.setItem(CHAT_DEFAULTS.STORAGE_KEY_VISITOR, "some-visitor");
    localStorage.setItem(CHAT_DEFAULTS.STORAGE_KEY_CONVERSATION, "old-stale-convo");

    const service = new ChatService({ serviceUrl, widgetId });

    // Mock fetch implementation:
    // First fetch to fetchMessages returns 404
    // Second fetch to createConversation returns a new conversation
    // Third fetch (retry) returns the message list
    let fetchCallCount = 0;
    globalFetchMock.mockImplementation((url: string, init: any) => {
      fetchCallCount++;
      if (url.includes("/messages") && url.includes("old-stale-convo")) {
        return Promise.resolve({
          ok: false,
          status: 404,
          statusText: "Not Found",
          text: async () => "Conversation not found",
        });
      }
      if (url.includes("/chat/conversations") && init?.method === "POST") {
        return Promise.resolve({
          ok: true,
          json: async () => ({ conversationId: "recovered-convo-id" }),
        });
      }
      if (url.includes("/messages") && url.includes("recovered-convo-id")) {
        return Promise.resolve({
          ok: true,
          json: async () => ({ messages: [{ id: "msg-1", content: "hello" }], hasMore: false }),
        });
      }
      return Promise.reject(new Error("Unexpected fetch call"));
    });

    const result = await service.fetchMessages();

    expect(result.messages).toEqual([{ id: "msg-1", content: "hello" }]);
    expect(service.conversationId).toBe("recovered-convo-id");
    expect(localStorage.getItem(CHAT_DEFAULTS.STORAGE_KEY_CONVERSATION)).toBe("recovered-convo-id");
    expect(fetchCallCount).toBe(3);
  });
});
