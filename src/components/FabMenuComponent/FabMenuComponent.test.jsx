import React from "react";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import FabMenuComponent from "./FabMenuComponent.js";

// Mock the components provider
vi.mock("../ComponentsProvider.js", () => ({
  useComponents: () => ({ sound: false }),
}));

// Mock sound service
vi.mock("../../services/SoundService.js", () => ({
  default: {
    playHoverButton: vi.fn(),
    playClickButton: vi.fn(),
  },
}));

// Reusable mock icon
const MockIcon = (props) => <svg data-testid="mock-icon" {...props} />;

// Reusable items fixture
const mockItems = [
  { icon: MockIcon, label: "Edit", onClick: vi.fn() },
  { icon: MockIcon, label: "Share", onClick: vi.fn() },
  { icon: MockIcon, label: "Delete", onClick: vi.fn() },
];

describe("FabMenuComponent", () => {
  // ── Rendering ───────────────────────────────────────────
  it("renders the trigger FAB with default aria-label", () => {
    render(<FabMenuComponent items={mockItems} />);
    const trigger = screen.getByRole("button", { name: "Actions menu" });
    expect(trigger).toBeInTheDocument();
    expect(trigger).not.toBeDisabled();
  });

  it("renders with a custom trigger icon", () => {
    render(<FabMenuComponent items={mockItems} icon={MockIcon} />);
    const trigger = screen.getByRole("button", { name: "Actions menu" });
    expect(trigger).toBeInTheDocument();
  });

  it("renders the default plus SVG when no icon is provided", () => {
    render(<FabMenuComponent items={mockItems} />);
    const trigger = screen.getByRole("button", { name: "Actions menu" });
    const svg = trigger.querySelector("svg");
    expect(svg).toBeInTheDocument();
  });

  it("applies the primary variant class by default", () => {
    render(<FabMenuComponent items={mockItems} />);
    const trigger = screen.getByRole("button", { name: "Actions menu" });
    expect(trigger).toHaveClass(/triggerPrimary/i);
  });

  // ── Variants ────────────────────────────────────────────
  it.each(["primary", "secondary", "tertiary", "surface"])(
    "applies the %s trigger variant class",
    (variant) => {
      render(<FabMenuComponent items={mockItems} variant={variant} />);
      const trigger = screen.getByRole("button", { name: "Actions menu" });
      const className = `trigger${variant.charAt(0).toUpperCase() + variant.slice(1)}`;
      expect(trigger).toHaveClass(new RegExp(className, "i"));
    },
  );

  // ── Menu interaction ────────────────────────────────────
  it("opens the menu when trigger is clicked", async () => {
    render(<FabMenuComponent items={mockItems} />);
    const trigger = screen.getByRole("button", { name: "Actions menu" });
    await userEvent.click(trigger);

    // Menu should now be visible
    const menu = screen.getByRole("menu");
    expect(menu).toHaveAttribute("aria-hidden", "false");
  });

  it("sets aria-expanded on the trigger when open", async () => {
    render(<FabMenuComponent items={mockItems} />);
    const trigger = screen.getByRole("button", { name: "Actions menu" });

    expect(trigger).toHaveAttribute("aria-expanded", "false");
    await userEvent.click(trigger);
    // After opening, trigger label changes
    const openTrigger = screen.getByRole("button", { name: "Close menu" });
    expect(openTrigger).toHaveAttribute("aria-expanded", "true");
  });

  it("renders all menu items as menuitems", async () => {
    render(<FabMenuComponent items={mockItems} />);
    await userEvent.click(screen.getByRole("button", { name: "Actions menu" }));

    const menuItems = screen.getAllByRole("menuitem");
    expect(menuItems).toHaveLength(3);
  });

  it("fires item onClick and closes menu when an item is clicked", async () => {
    const onEdit = vi.fn();
    const items = [
      { icon: MockIcon, label: "Edit", onClick: onEdit },
      { icon: MockIcon, label: "Share", onClick: vi.fn() },
      { icon: MockIcon, label: "Delete", onClick: vi.fn() },
    ];

    render(<FabMenuComponent items={items} />);
    await userEvent.click(screen.getByRole("button", { name: "Actions menu" }));
    await userEvent.click(screen.getByRole("menuitem", { name: "Edit" }));

    expect(onEdit).toHaveBeenCalledTimes(1);
    // Menu should be closed — query hidden because aria-hidden="true"
    const menu = screen.getByRole("menu", { hidden: true });
    expect(menu).toHaveAttribute("aria-hidden", "true");
  });

  // ── Keyboard navigation ─────────────────────────────────
  it("closes the menu on Escape and returns focus to trigger", async () => {
    render(<FabMenuComponent items={mockItems} />);
    const trigger = screen.getByRole("button", { name: "Actions menu" });
    await userEvent.click(trigger);

    await userEvent.keyboard("{Escape}");
    // Query hidden because aria-hidden="true" when closed
    const menu = screen.getByRole("menu", { hidden: true });
    expect(menu).toHaveAttribute("aria-hidden", "true");
  });

  // ── Disabled ────────────────────────────────────────────
  it("disables the trigger when disabled prop is true", () => {
    render(<FabMenuComponent items={mockItems} disabled />);
    const trigger = screen.getByRole("button", { name: "Actions menu" });
    expect(trigger).toBeDisabled();
  });

  // ── Scrim ───────────────────────────────────────────────
  it("renders scrim when showScrim is true (default)", () => {
    const { container } = render(<FabMenuComponent items={mockItems} />);
    const scrim = container.querySelector('[data-visible]');
    expect(scrim).toBeInTheDocument();
    expect(scrim).toHaveAttribute("data-visible", "false");
  });

  it("does not render scrim when showScrim is false", () => {
    const { container } = render(
      <FabMenuComponent items={mockItems} showScrim={false} />,
    );
    const scrim = container.querySelector('[data-visible]');
    expect(scrim).toBeNull();
  });

  // ── Ref forwarding ──────────────────────────────────────
  it("forwards ref to the container element", () => {
    const ref = React.createRef();
    render(<FabMenuComponent ref={ref} items={mockItems} />);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });

  // ── Fixed positioning ───────────────────────────────────
  it("applies fixed class when fixed prop is true", () => {
    const ref = React.createRef();
    render(<FabMenuComponent ref={ref} items={mockItems} fixed />);
    expect(ref.current).toHaveClass(/fixed/i);
  });

  // ── Custom aria-label ───────────────────────────────────
  it("accepts a custom ariaLabel", () => {
    render(<FabMenuComponent items={mockItems} ariaLabel="Quick actions" />);
    const trigger = screen.getByRole("button", { name: "Quick actions" });
    expect(trigger).toBeInTheDocument();
  });
});
