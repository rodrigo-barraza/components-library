import { jsx as _jsx } from "react/jsx-runtime";
import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import DividerComponent from "./DividerComponent.js";
describe("DividerComponent", () => {
    /* ── Rendering ──────────────────────────────────────────────────── */
    it("renders a horizontal <hr> by default", () => {
        const { container } = render(_jsx(DividerComponent, { "data-testid": "divider" }));
        const hr = container.querySelector("hr");
        expect(hr).toBeInTheDocument();
    });
    it("renders a vertical <div> with aria-orientation", () => {
        render(_jsx(DividerComponent, { orientation: "vertical", "data-testid": "divider" }));
        const el = screen.getByRole("separator");
        expect(el.tagName).toBe("DIV");
        expect(el).toHaveAttribute("aria-orientation", "vertical");
    });
    /* ── Variants ───────────────────────────────────────────────────── */
    it("applies inset variant class", () => {
        const { container } = render(_jsx(DividerComponent, { variant: "inset" }));
        const hr = container.querySelector("hr");
        expect(hr).toHaveClass(/inset/i);
    });
    it("applies middleInset variant class", () => {
        const { container } = render(_jsx(DividerComponent, { variant: "middleInset" }));
        const hr = container.querySelector("hr");
        expect(hr).toHaveClass(/middleInset/i);
    });
    /* ── Accessibility ──────────────────────────────────────────────── */
    it("has implicit separator role for horizontal <hr>", () => {
        render(_jsx(DividerComponent, {}));
        const el = screen.getByRole("separator");
        expect(el).toBeInTheDocument();
    });
    it("applies role='none' when decorative", () => {
        const { container } = render(_jsx(DividerComponent, { decorative: true }));
        const hr = container.querySelector("hr");
        expect(hr).toHaveAttribute("role", "none");
    });
    it("applies role='none' to decorative vertical divider", () => {
        const { container } = render(_jsx(DividerComponent, { orientation: "vertical", decorative: true }));
        const div = container.querySelector("div");
        expect(div).toHaveAttribute("role", "none");
    });
    /* ── Spacing ────────────────────────────────────────────────────── */
    it("applies spacing class when spacing prop is provided", () => {
        const { container } = render(_jsx(DividerComponent, { spacing: "md" }));
        const hr = container.querySelector("hr");
        expect(hr).toHaveClass(/spacingMd/i);
    });
    /* ── Custom className ───────────────────────────────────────────── */
    it("applies custom className", () => {
        const { container } = render(_jsx(DividerComponent, { className: "my-divider" }));
        const hr = container.querySelector("hr");
        expect(hr).toHaveClass("my-divider");
    });
    /* ── Subheader ──────────────────────────────────────────────────── */
    describe("DividerComponent.Subheader", () => {
        it("renders a labeled subheader divider", () => {
            render(_jsx(DividerComponent.Subheader, { label: "Section Title" }));
            expect(screen.getByText("Section Title")).toBeInTheDocument();
        });
        it("renders with role='none' (always decorative)", () => {
            const { container } = render(_jsx(DividerComponent.Subheader, { label: "Settings" }));
            const wrapper = container.firstChild;
            expect(wrapper).toHaveAttribute("role", "none");
        });
        it("renders two line spans flanking the label", () => {
            const { container } = render(_jsx(DividerComponent.Subheader, { label: "Group" }));
            const lines = container.querySelectorAll("span");
            // 2 lines + 1 label = 3 spans
            expect(lines.length).toBe(3);
        });
        it("applies custom className", () => {
            const { container } = render(_jsx(DividerComponent.Subheader, { label: "Custom", className: "my-sub" }));
            expect(container.firstChild).toHaveClass("my-sub");
        });
    });
});
//# sourceMappingURL=DividerComponent.test.js.map