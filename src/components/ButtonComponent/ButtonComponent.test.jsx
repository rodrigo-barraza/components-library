import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import ButtonComponent from "./ButtonComponent.js";

// Mock the components provider to avoid needing the full context
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

describe("ButtonComponent", () => {
  it("renders with default primary variant", () => {
    render(<ButtonComponent>Click Me</ButtonComponent>);
    const button = screen.getByRole("button", { name: "Click Me" });
    expect(button).toBeInTheDocument();
    expect(button).toHaveClass(/btn/i);
    expect(button).toHaveClass(/primary/i);
    expect(button).not.toBeDisabled();
  });

  it("triggers onClick when clicked", async () => {
    const handleClick = vi.fn();
    render(<ButtonComponent onClick={handleClick}>Click Me</ButtonComponent>);
    const button = screen.getByRole("button", { name: "Click Me" });
    await userEvent.click(button);
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it("is disabled when disabled prop is true", () => {
    render(<ButtonComponent disabled>Disabled Btn</ButtonComponent>);
    const button = screen.getByRole("button", { name: "Disabled Btn" });
    expect(button).toBeDisabled();
  });

  it("is disabled and shows spinner when loading prop is true", () => {
    const { container } = render(<ButtonComponent loading>Loading Btn</ButtonComponent>);
    const button = screen.getByRole("button", { name: "Loading Btn" });
    expect(button).toBeDisabled();
    // Assuming spinner renders an element with className containing spinner
    const spinner = container.querySelector('[class*="spinner"]');
    expect(spinner).toBeInTheDocument();
  });

  it("applies fullWidth class when fullWidth prop is true", () => {
    render(<ButtonComponent fullWidth>Full Width</ButtonComponent>);
    const button = screen.getByRole("button", { name: "Full Width" });
    expect(button).toHaveClass(/fullWidth/i);
  });

  it("renders an icon if provided", () => {
    const MockIcon = () => <svg data-testid="mock-icon" />;
    render(<ButtonComponent icon={MockIcon}>With Icon</ButtonComponent>);
    const icon = screen.getByTestId("mock-icon");
    expect(icon).toBeInTheDocument();
  });
});
