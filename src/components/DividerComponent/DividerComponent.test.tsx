// @ts-nocheck
import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import DividerComponent from "./DividerComponent.tsx";

describe("DividerComponent", () => {
  /* ── Rendering ──────────────────────────────────────────────────── */

  it("renders a horizontal <hr> by default", () => {
    const { container } = render(<DividerComponent data-testid="divider" />);
    const hr = container.querySelector("hr");
    expect(hr).toBeInTheDocument();
  });

  it("renders a vertical <div> with aria-orientation", () => {
    render(<DividerComponent orientation="vertical" data-testid="divider" />);
    const el = screen.getByRole("separator");
    expect(el.tagName).toBe("DIV");
    expect(el).toHaveAttribute("aria-orientation", "vertical");
  });

  /* ── Variants ───────────────────────────────────────────────────── */

  it("applies inset variant class", () => {
    const { container } = render(<DividerComponent variant="inset" />);
    const hr = container.querySelector("hr");
    expect(hr).toHaveClass(/inset/i);
  });

  it("applies middleInset variant class", () => {
    const { container } = render(<DividerComponent variant="middleInset" />);
    const hr = container.querySelector("hr");
    expect(hr).toHaveClass(/middleInset/i);
  });

  /* ── Accessibility ──────────────────────────────────────────────── */

  it("has implicit separator role for horizontal <hr>", () => {
    render(<DividerComponent />);
    const el = screen.getByRole("separator");
    expect(el).toBeInTheDocument();
  });

  it("applies role='none' when decorative", () => {
    const { container } = render(<DividerComponent decorative />);
    const hr = container.querySelector("hr");
    expect(hr).toHaveAttribute("role", "none");
  });

  it("applies role='none' to decorative vertical divider", () => {
    const { container } = render(
      <DividerComponent orientation="vertical" decorative />
    );
    const div = container.querySelector("div");
    expect(div).toHaveAttribute("role", "none");
  });

  /* ── Spacing ────────────────────────────────────────────────────── */

  it("applies spacing class when spacing prop is provided", () => {
    const { container } = render(<DividerComponent spacing="md" />);
    const hr = container.querySelector("hr");
    expect(hr).toHaveClass(/spacingMd/i);
  });

  /* ── Custom className ───────────────────────────────────────────── */

  it("applies custom className", () => {
    const { container } = render(<DividerComponent className="my-divider" />);
    const hr = container.querySelector("hr");
    expect(hr).toHaveClass("my-divider");
  });

  /* ── Subheader ──────────────────────────────────────────────────── */

  describe("DividerComponent.Subheader", () => {
    it("renders a labeled subheader divider", () => {
      render(<DividerComponent.Subheader label="Section Title" />);
      expect(screen.getByText("Section Title")).toBeInTheDocument();
    });

    it("renders with role='none' (always decorative)", () => {
      const { container } = render(
        <DividerComponent.Subheader label="Settings" />
      );
      const wrapper = container.firstChild;
      expect(wrapper).toHaveAttribute("role", "none");
    });

    it("renders two line spans flanking the label", () => {
      const { container } = render(
        <DividerComponent.Subheader label="Group" />
      );
      const lines = container.querySelectorAll("span");
      // 2 lines + 1 label = 3 spans
      expect(lines.length).toBe(3);
    });

    it("applies custom className", () => {
      const { container } = render(
        <DividerComponent.Subheader label="Custom" className="my-sub" />
      );
      expect(container.firstChild).toHaveClass("my-sub");
    });
  });
});
