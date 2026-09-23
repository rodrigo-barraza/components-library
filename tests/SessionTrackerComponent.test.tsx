import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, render } from "@testing-library/react";
import SessionTrackerComponent, {
  trackEvent,
} from "../src/components/SessionTrackerComponent/SessionTrackerComponent.tsx";

function queued() {
  return window.__sessions?.q ?? [];
}

afterEach(() => {
  cleanup(); // unmount (which queues "stop") before the next test's fresh queue
  delete window.__sessions;
  document.getElementById("sessions-tracker")?.remove();
});

describe("SessionTrackerComponent", () => {
  it("loads the service's tracker once and queues identify before init", () => {
    const { rerender } = render(
      <SessionTrackerComponent
        projectId="site"
        userId="a@b.c"
        replay
        heatmap
      />,
    );
    rerender(
      <SessionTrackerComponent
        projectId="site"
        userId="a@b.c"
        replay
        heatmap
      />,
    );

    const scripts = document.querySelectorAll("script#sessions-tracker");
    expect(scripts).toHaveLength(1);
    expect(scripts[0].getAttribute("type")).toBe("module");
    expect(scripts[0].getAttribute("src")).toBe(
      "/api/sessions/tracker/client.js",
    );
    expect(queued()).toEqual([
      ["identify", "a@b.c"],
      [
        "init",
        {
          projectId: "site",
          apiBase: "/api/sessions",
          replay: true,
          heatmap: true,
          trackLocalhost: false,
        },
      ],
    ]);
  });

  it("follows the signed-in user and stops on unmount", () => {
    const { rerender, unmount } = render(
      <SessionTrackerComponent projectId="site" apiBase="/proxy/" />,
    );
    rerender(
      <SessionTrackerComponent projectId="site" apiBase="/proxy/" userId="u" />,
    );
    unmount();

    expect(
      document.getElementById("sessions-tracker")?.getAttribute("src"),
    ).toBe("/proxy/tracker/client.js");
    expect(queued().map(([name, ...args]) => [name, args[0]])).toEqual([
      ["identify", null],
      ["init", expect.objectContaining({ projectId: "site" })],
      ["identify", "u"],
      ["stop", undefined],
    ]);
  });

  it("hands commands straight to a tracker that has already loaded", () => {
    const tracker = Object.assign(vi.fn(), { loaded: true });
    window.__sessions = tracker;
    render(<SessionTrackerComponent projectId="site" pathname="/a" />);
    trackEvent("signup", { plan: "pro" });

    expect(tracker).toHaveBeenCalledWith(
      "init",
      expect.objectContaining({ projectId: "site" }),
    );
    expect(tracker).toHaveBeenCalledWith("page");
    expect(tracker).toHaveBeenCalledWith("event", "signup", { plan: "pro" });
  });
});
