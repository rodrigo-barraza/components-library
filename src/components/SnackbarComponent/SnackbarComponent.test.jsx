import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, act, fireEvent } from "@testing-library/react";
import SnackbarComponent, { useSnackbar } from "./SnackbarComponent.tsx";

/* ── Helper: renders hook result via wrapper ──────────── */
function HookHarness({ hookRef }) {
  const result = useSnackbar();
  hookRef.current = result;
  return <SnackbarComponent {...result.snackbarProps} />;
}

describe("SnackbarComponent", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  // ── Rendering ──────────────────────────────────────────

  it("renders nothing when closed", () => {
    const { container } = render(
      <SnackbarComponent open={false} message="Hello" />,
    );
    expect(container.innerHTML).toBe("");
  });

  it("renders supporting text when open", () => {
    render(<SnackbarComponent open message="File saved" />);
    expect(screen.getByText("File saved")).toBeInTheDocument();
  });

  it("renders action button when actionLabel is provided", () => {
    render(
      <SnackbarComponent
        open
        message="Item deleted"
        actionLabel="Undo"
        onAction={() => {}}
      />,
    );
    expect(screen.getByText("Undo")).toBeInTheDocument();
    expect(screen.getByText("Undo").tagName).toBe("BUTTON");
  });

  it("renders close button when showClose is true", () => {
    render(
      <SnackbarComponent
        open
        message="Update available"
        showClose
        onDismiss={() => {}}
      />,
    );
    expect(screen.getByLabelText("Dismiss")).toBeInTheDocument();
  });

  it("does not render close button by default", () => {
    render(<SnackbarComponent open message="Hello" />);
    expect(screen.queryByLabelText("Dismiss")).not.toBeInTheDocument();
  });

  // ── Accessibility ──────────────────────────────────────

  it("has role='status' for polite announcement", () => {
    render(<SnackbarComponent open message="Saved" />);
    expect(screen.getByRole("status")).toBeInTheDocument();
  });

  it("has aria-live='polite'", () => {
    render(<SnackbarComponent open message="Saved" />);
    expect(screen.getByRole("status")).toHaveAttribute("aria-live", "polite");
  });

  it("has aria-atomic='true' for full content announcement", () => {
    render(<SnackbarComponent open message="Saved" />);
    expect(screen.getByRole("status")).toHaveAttribute("aria-atomic", "true");
  });

  it("close button has accessible label", () => {
    render(
      <SnackbarComponent
        open
        message="Update"
        showClose
        onDismiss={() => {}}
      />,
    );
    const closeBtn = screen.getByLabelText("Dismiss");
    expect(closeBtn).toBeInTheDocument();
  });

  // ── Interactions ───────────────────────────────────────

  it("calls onAction when action button is clicked", () => {
    const spy = vi.fn();
    render(
      <SnackbarComponent
        open
        message="Deleted"
        actionLabel="Undo"
        onAction={spy}
      />,
    );
    fireEvent.click(screen.getByText("Undo"));
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it("triggers dismiss animation when close is clicked", () => {
    const onDismiss = vi.fn();
    render(
      <SnackbarComponent
        open
        message="Info"
        showClose
        onDismiss={onDismiss}
      />,
    );
    fireEvent.click(screen.getByLabelText("Dismiss"));

    // The exit animation is initiated via data-exiting
    const container = screen.getByRole("status");
    expect(container.dataset.exiting).toBe("true");
  });

  // ── useSnackbar hook ───────────────────────────────────

  it("useSnackbar shows and auto-dismisses a snackbar", () => {
    const hookRef = { current: null };
    render(<HookHarness hookRef={hookRef} />);

    // Initially no snackbar
    expect(screen.queryByRole("status")).not.toBeInTheDocument();

    // Show snackbar
    act(() => {
      hookRef.current.showSnackbar("Test message", { duration: 4000 });
    });

    expect(screen.getByText("Test message")).toBeInTheDocument();

    // Auto-dismiss after duration
    act(() => {
      vi.advanceTimersByTime(4100);
    });

    // After dismiss, current is null — snackbar should be gone
    expect(screen.queryByText("Test message")).not.toBeInTheDocument();
  });

  it("useSnackbar clamps duration to M3 range (4–10s)", () => {
    const hookRef = { current: null };
    render(<HookHarness hookRef={hookRef} />);

    // Show with very short duration (should clamp to 4s)
    act(() => {
      hookRef.current.showSnackbar("Quick", { duration: 1000 });
    });

    expect(screen.getByText("Quick")).toBeInTheDocument();

    // Should not dismiss at 2s (because clamped to 4s)
    act(() => {
      vi.advanceTimersByTime(2000);
    });
    expect(screen.getByText("Quick")).toBeInTheDocument();
  });

  it("useSnackbar supports action callbacks", () => {
    const hookRef = { current: null };
    const actionSpy = vi.fn();
    render(<HookHarness hookRef={hookRef} />);

    act(() => {
      hookRef.current.showSnackbar("Deleted", {
        actionLabel: "Undo",
        onAction: actionSpy,
      });
    });

    fireEvent.click(screen.getByText("Undo"));
    expect(actionSpy).toHaveBeenCalledTimes(1);
  });

  // ── Unique IDs ─────────────────────────────────────────

  it("generates unique element IDs", () => {
    render(
      <SnackbarComponent
        open
        message="Hello"
        actionLabel="Action"
        showClose
        onAction={() => {}}
        onDismiss={() => {}}
        id="my-snackbar"
      />,
    );
    expect(document.getElementById("my-snackbar-host")).toBeInTheDocument();
    expect(document.getElementById("my-snackbar-message")).toBeInTheDocument();
    expect(document.getElementById("my-snackbar-action")).toBeInTheDocument();
    expect(document.getElementById("my-snackbar-close")).toBeInTheDocument();
  });
});
