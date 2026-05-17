// @ts-nocheck
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import FabComponent from "./FabComponent.tsx";
import { ComponentsProvider } from "../ComponentsProvider.tsx";

/* ── Stub icon ───────────────────────────────────────────────────── */
function PlusIcon({ size = 24, ...rest }) {
  return (
    <svg width={size} height={size} data-testid="icon-plus" {...rest}>
      <line x1="12" y1="5" x2="12" y2="19" />
      <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  );
}

const wrap = (ui) => render(<ComponentsProvider>{ui}</ComponentsProvider>);

describe("FabComponent", () => {
  /* ── Rendering ─────────────────────────────────────────────────── */

  it("renders as a button with role='button'", () => {
    wrap(<FabComponent icon={PlusIcon} aria-label="Add" />);
    const btn = screen.getByRole("button", { name: "Add" });
    expect(btn).toBeTruthy();
    expect(btn.tagName).toBe("BUTTON");
    expect(btn.type).toBe("button");
  });

  it("renders the icon", () => {
    wrap(<FabComponent icon={PlusIcon} aria-label="Add" />);
    expect(screen.getByTestId("icon-plus")).toBeTruthy();
  });

  it("renders as extended FAB with label", () => {
    wrap(<FabComponent icon={PlusIcon} label="Create" />);
    expect(screen.getByText("Create")).toBeTruthy();
  });

  it("renders extended FAB without icon", () => {
    wrap(<FabComponent label="New item" />);
    const btn = screen.getByRole("button", { name: "New item" });
    expect(btn).toBeTruthy();
    expect(screen.queryByTestId("icon-plus")).toBeNull();
  });

  /* ── Props ─────────────────────────────────────────────────────── */

  it("applies size class for small", () => {
    wrap(<FabComponent icon={PlusIcon} size="small" aria-label="Add" />);
    const btn = screen.getByRole("button");
    expect(btn.className).toContain("small");
  });

  it("applies size class for large", () => {
    wrap(<FabComponent icon={PlusIcon} size="large" aria-label="Add" />);
    const btn = screen.getByRole("button");
    expect(btn.className).toContain("large");
  });

  it("sets icon size to 36 for large FAB", () => {
    wrap(<FabComponent icon={PlusIcon} size="large" aria-label="Add" />);
    const icon = screen.getByTestId("icon-plus");
    expect(icon.getAttribute("width")).toBe("36");
  });

  it("sets icon size to 24 for standard FAB", () => {
    wrap(<FabComponent icon={PlusIcon} aria-label="Add" />);
    const icon = screen.getByTestId("icon-plus");
    expect(icon.getAttribute("width")).toBe("24");
  });

  it("applies custom iconSize override", () => {
    wrap(
      <FabComponent icon={PlusIcon} iconSize={20} aria-label="Add" />,
    );
    const icon = screen.getByTestId("icon-plus");
    expect(icon.getAttribute("width")).toBe("20");
  });

  it("applies color variant classes", () => {
    const { rerender } = wrap(
      <FabComponent icon={PlusIcon} color="surface" aria-label="Add" />,
    );
    expect(screen.getByRole("button").className).toContain("surface");
  });

  it("applies lowered class", () => {
    wrap(
      <FabComponent icon={PlusIcon} lowered aria-label="Add" />,
    );
    expect(screen.getByRole("button").className).toContain("lowered");
  });

  it("applies fixed + position classes", () => {
    wrap(
      <FabComponent
        icon={PlusIcon}
        fixed
        position="bottom-start"
        aria-label="Add"
      />,
    );
    const btn = screen.getByRole("button");
    expect(btn.className).toContain("fixed");
    expect(btn.className).toContain("bottomStart");
  });

  it("applies hidden class for scroll-hide", () => {
    wrap(
      <FabComponent icon={PlusIcon} hidden aria-label="Add" />,
    );
    expect(screen.getByRole("button").className).toContain("hidden");
  });

  /* ── Disabled ──────────────────────────────────────────────────── */

  it("disables the button", () => {
    wrap(
      <FabComponent icon={PlusIcon} disabled aria-label="Add" />,
    );
    const btn = screen.getByRole("button");
    expect(btn.disabled).toBe(true);
    expect(btn.getAttribute("aria-disabled")).toBe("true");
  });

  it("does not fire onClick when disabled", () => {
    const handler = vi.fn();
    wrap(
      <FabComponent
        icon={PlusIcon}
        disabled
        onClick={handler}
        aria-label="Add"
      />,
    );
    fireEvent.click(screen.getByRole("button"));
    expect(handler).not.toHaveBeenCalled();
  });

  /* ── Events ────────────────────────────────────────────────────── */

  it("fires onClick", () => {
    const handler = vi.fn();
    wrap(
      <FabComponent icon={PlusIcon} onClick={handler} aria-label="Add" />,
    );
    fireEvent.click(screen.getByRole("button"));
    expect(handler).toHaveBeenCalledOnce();
  });

  it("fires onMouseEnter", () => {
    const handler = vi.fn();
    wrap(
      <FabComponent
        icon={PlusIcon}
        onMouseEnter={handler}
        aria-label="Add"
      />,
    );
    fireEvent.mouseEnter(screen.getByRole("button"));
    expect(handler).toHaveBeenCalledOnce();
  });

  /* ── Accessibility ─────────────────────────────────────────────── */

  it("uses label as aria-label for extended FAB", () => {
    wrap(<FabComponent icon={PlusIcon} label="Compose" />);
    expect(
      screen.getByRole("button", { name: "Compose" }),
    ).toBeTruthy();
  });

  it("uses explicit aria-label over label prop", () => {
    wrap(
      <FabComponent
        icon={PlusIcon}
        label="Compose"
        aria-label="Write new message"
      />,
    );
    expect(
      screen.getByRole("button", { name: "Write new message" }),
    ).toBeTruthy();
  });

  /* ── Ref forwarding ────────────────────────────────────────────── */

  it("forwards ref to the button element", () => {
    const ref = { current: null };
    wrap(
      <FabComponent ref={ref} icon={PlusIcon} aria-label="Add" />,
    );
    expect(ref.current).toBeTruthy();
    expect(ref.current.tagName).toBe("BUTTON");
  });
});
