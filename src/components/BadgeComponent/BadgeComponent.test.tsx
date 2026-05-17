import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import BadgeComponent from "./BadgeComponent.js";
import TooltipComponent from "../TooltipComponent/TooltipComponent.js";

describe("BadgeComponent", () => {
  it("renders with default info variant", () => {
    const { container } = render(<BadgeComponent>Info Label</BadgeComponent>);
    const badge = screen.getByText("Info Label");
    expect(badge).toBeInTheDocument();
    // Assuming CSS modules produce a class string that contains "info" somewhere, but since it's mocked by jsdom it might just have the raw object keys if we mocked css modules.
    // If not using a CSS module mock, it relies on normal className rendering.
    expect(badge).toHaveClass(/badge/i);
    expect(badge).toHaveClass(/info/i);
  });

  it("renders with specified variant", () => {
    render(<BadgeComponent variant="success">Success</BadgeComponent>);
    const badge = screen.getByText("Success");
    expect(badge).toHaveClass(/success/i);
  });

  it("applies the mini class when mini prop is true", () => {
    render(
      <BadgeComponent variant="error" mini>
        Mini Error
      </BadgeComponent>
    );
    const badge = screen.getByText("Mini Error");
    expect(badge).toHaveClass(/mini/i);
  });

  it("applies custom className", () => {
    render(<BadgeComponent className="my-custom-class">Custom</BadgeComponent>);
    const badge = screen.getByText("Custom");
    expect(badge).toHaveClass("my-custom-class");
  });
});
