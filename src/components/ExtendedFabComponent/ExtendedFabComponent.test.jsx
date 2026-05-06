import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import ExtendedFabComponent from "./ExtendedFabComponent.js";

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

describe("ExtendedFabComponent", () => {
  // ── Rendering ───────────────────────────────────────────
  it("renders with default primary variant and label", () => {
    render(<ExtendedFabComponent>Create</ExtendedFabComponent>);
    const button = screen.getByRole("button", { name: "Create" });
    expect(button).toBeInTheDocument();
    expect(button).toHaveClass(/extendedFab/i);
    expect(button).toHaveClass(/primary/i);
    expect(button).not.toBeDisabled();
  });

  it("renders with an icon and label", () => {
    const MockIcon = (props) => <svg data-testid="fab-icon" {...props} />;
    render(<ExtendedFabComponent icon={MockIcon}>Compose</ExtendedFabComponent>);
    const icon = screen.getByTestId("fab-icon");
    expect(icon).toBeInTheDocument();
    expect(screen.getByText("Compose")).toBeInTheDocument();
  });

  it("renders icon with size=24 per M3 spec", () => {
    const MockIcon = (props) => (
      <svg data-testid="fab-icon" data-size={props.size} />
    );
    render(<ExtendedFabComponent icon={MockIcon}>New</ExtendedFabComponent>);
    const icon = screen.getByTestId("fab-icon");
    expect(icon).toHaveAttribute("data-size", "24");
  });

  // ── Variants ────────────────────────────────────────────
  it.each(["primary", "secondary", "tertiary", "surface"])(
    "applies the %s variant class",
    (variant) => {
      render(
        <ExtendedFabComponent variant={variant}>Action</ExtendedFabComponent>,
      );
      const button = screen.getByRole("button", { name: "Action" });
      expect(button).toHaveClass(new RegExp(variant, "i"));
    },
  );

  // ── Interaction ─────────────────────────────────────────
  it("triggers onClick when clicked", async () => {
    const handleClick = vi.fn();
    render(
      <ExtendedFabComponent onClick={handleClick}>Click</ExtendedFabComponent>,
    );
    const button = screen.getByRole("button", { name: "Click" });
    await userEvent.click(button);
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it("does not fire onClick when disabled", async () => {
    const handleClick = vi.fn();
    render(
      <ExtendedFabComponent onClick={handleClick} disabled>
        Click
      </ExtendedFabComponent>,
    );
    const button = screen.getByRole("button", { name: "Click" });
    expect(button).toBeDisabled();
    await userEvent.click(button).catch(() => {});
    expect(handleClick).not.toHaveBeenCalled();
  });

  // ── Collapsed mode ──────────────────────────────────────
  it("applies collapsed class when collapsed prop is true", () => {
    const MockIcon = () => <svg data-testid="fab-icon" />;
    render(
      <ExtendedFabComponent collapsed icon={MockIcon} ariaLabel="Create">
        Create
      </ExtendedFabComponent>,
    );
    const button = screen.getByRole("button", { name: "Create" });
    expect(button).toHaveClass(/collapsed/i);
  });

  // ── Lowered ─────────────────────────────────────────────
  it("applies lowered class when lowered prop is true", () => {
    render(<ExtendedFabComponent lowered>Low</ExtendedFabComponent>);
    const button = screen.getByRole("button", { name: "Low" });
    expect(button).toHaveClass(/lowered/i);
  });

  // ── Fixed positioning ───────────────────────────────────
  it("applies fixed class when fixed prop is true", () => {
    render(<ExtendedFabComponent fixed>Fixed</ExtendedFabComponent>);
    const button = screen.getByRole("button", { name: "Fixed" });
    expect(button).toHaveClass(/fixed/i);
  });

  // ── Accessibility ───────────────────────────────────────
  it("accepts aria-label for collapsed (icon-only) mode", () => {
    const MockIcon = () => <svg data-testid="fab-icon" />;
    render(
      <ExtendedFabComponent collapsed icon={MockIcon} ariaLabel="New item">
        New item
      </ExtendedFabComponent>,
    );
    const button = screen.getByRole("button", { name: "New item" });
    expect(button).toBeInTheDocument();
  });

  it("marks icon as aria-hidden", () => {
    const MockIcon = () => <svg data-testid="fab-icon" />;
    render(
      <ExtendedFabComponent icon={MockIcon}>Create</ExtendedFabComponent>,
    );
    // The wrapping <span> should have aria-hidden
    const iconWrapper = screen.getByTestId("fab-icon").parentElement;
    expect(iconWrapper).toHaveAttribute("aria-hidden", "true");
  });

  // ── Ref forwarding ──────────────────────────────────────
  it("forwards ref to the button element", () => {
    const ref = React.createRef();
    render(<ExtendedFabComponent ref={ref}>Ref</ExtendedFabComponent>);
    expect(ref.current).toBeInstanceOf(HTMLButtonElement);
  });
});
