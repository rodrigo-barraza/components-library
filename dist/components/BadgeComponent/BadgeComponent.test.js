import { jsx as _jsx } from "react/jsx-runtime";
import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import BadgeComponent from "./BadgeComponent.js";
describe("BadgeComponent", () => {
    it("renders with default info variant", () => {
        const { container } = render(_jsx(BadgeComponent, { children: "Info Label" }));
        const badge = screen.getByText("Info Label");
        expect(badge).toBeInTheDocument();
        // Assuming CSS modules produce a class string that contains "info" somewhere, but since it's mocked by jsdom it might just have the raw object keys if we mocked css modules.
        // If not using a CSS module mock, it relies on normal className rendering.
        expect(badge).toHaveClass(/badge/i);
        expect(badge).toHaveClass(/info/i);
    });
    it("renders with specified variant", () => {
        render(_jsx(BadgeComponent, { variant: "success", children: "Success" }));
        const badge = screen.getByText("Success");
        expect(badge).toHaveClass(/success/i);
    });
    it("applies the mini class when mini prop is true", () => {
        render(_jsx(BadgeComponent, { variant: "error", mini: true, children: "Mini Error" }));
        const badge = screen.getByText("Mini Error");
        expect(badge).toHaveClass(/mini/i);
    });
    it("applies custom className", () => {
        render(_jsx(BadgeComponent, { className: "my-custom-class", children: "Custom" }));
        const badge = screen.getByText("Custom");
        expect(badge).toHaveClass("my-custom-class");
    });
});
//# sourceMappingURL=BadgeComponent.test.js.map