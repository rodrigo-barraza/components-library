// @ts-nocheck
import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import DialogComponent from "./DialogComponent.tsx";

describe("DialogComponent", () => {
  let user;

  beforeEach(() => {
    user = userEvent.setup();
  });

  afterEach(() => {
    // Cleanup body overflow style
    document.body.style.overflow = "";
  });

  // ── Rendering ─────────────────────────────────────────

  it("does not render when open is false", () => {
    render(
      <DialogComponent open={false} onClose={vi.fn()}>
        Hidden content
      </DialogComponent>,
    );
    expect(screen.queryByRole("alertdialog")).not.toBeInTheDocument();
  });

  it("renders when open is true", () => {
    render(
      <DialogComponent open={true} onClose={vi.fn()}>
        Visible content
      </DialogComponent>,
    );
    expect(screen.getByRole("alertdialog")).toBeInTheDocument();
    expect(screen.getByText("Visible content")).toBeInTheDocument();
  });

  it("renders headline when provided", () => {
    render(
      <DialogComponent open={true} onClose={vi.fn()} headline="Delete item?">
        Are you sure?
      </DialogComponent>,
    );
    expect(screen.getByText("Delete item?")).toBeInTheDocument();
  });

  it("renders icon when provided", () => {
    const MockIcon = () => <svg data-testid="dialog-icon" />;
    render(
      <DialogComponent open={true} onClose={vi.fn()} icon={<MockIcon />}>
        Content
      </DialogComponent>,
    );
    expect(screen.getByTestId("dialog-icon")).toBeInTheDocument();
  });

  it("renders default OK/Cancel button labels", () => {
    render(
      <DialogComponent open={true} onClose={vi.fn()}>
        Content
      </DialogComponent>,
    );
    expect(screen.getByRole("button", { name: "OK" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Cancel" })).toBeInTheDocument();
  });

  it("renders custom button labels", () => {
    render(
      <DialogComponent
        open={true}
        onClose={vi.fn()}
        confirmLabel="Delete"
        cancelLabel="Keep"
      >
        Content
      </DialogComponent>,
    );
    expect(screen.getByRole("button", { name: "Delete" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Keep" })).toBeInTheDocument();
  });

  it("hides cancel button when hideCancel is true", () => {
    render(
      <DialogComponent open={true} onClose={vi.fn()} hideCancel>
        Acknowledge
      </DialogComponent>,
    );
    expect(screen.getByRole("button", { name: "OK" })).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Cancel" })).not.toBeInTheDocument();
  });

  // ── ARIA attributes ───────────────────────────────────

  it("applies correct ARIA attributes", () => {
    render(
      <DialogComponent
        open={true}
        onClose={vi.fn()}
        headline="Confirm action"
        id="test-dialog"
      >
        Are you sure?
      </DialogComponent>,
    );
    const dialog = screen.getByRole("alertdialog");
    expect(dialog).toHaveAttribute("aria-modal", "true");
    expect(dialog).toHaveAttribute("aria-labelledby", "test-dialog-headline");
    expect(dialog).toHaveAttribute("aria-describedby", "test-dialog-body");
  });

  // ── Interactions ──────────────────────────────────────

  it("calls onConfirm when confirm button is clicked", async () => {
    const handleConfirm = vi.fn();
    render(
      <DialogComponent open={true} onClose={vi.fn()} onConfirm={handleConfirm}>
        Content
      </DialogComponent>,
    );
    await user.click(screen.getByRole("button", { name: "OK" }));
    expect(handleConfirm).toHaveBeenCalledTimes(1);
  });

  it("disables confirm button when confirmDisabled is true", () => {
    render(
      <DialogComponent open={true} onClose={vi.fn()} confirmDisabled>
        Content
      </DialogComponent>,
    );
    expect(screen.getByRole("button", { name: "OK" })).toBeDisabled();
  });

  // ── Body scroll lock ──────────────────────────────────

  it("locks body scroll when open", () => {
    render(
      <DialogComponent open={true} onClose={vi.fn()}>
        Content
      </DialogComponent>,
    );
    expect(document.body.style.overflow).toBe("hidden");
  });

  it("restores body scroll on unmount", () => {
    document.body.style.overflow = "auto";
    const { unmount } = render(
      <DialogComponent open={true} onClose={vi.fn()}>
        Content
      </DialogComponent>,
    );
    expect(document.body.style.overflow).toBe("hidden");
    unmount();
    expect(document.body.style.overflow).toBe("auto");
  });
});
