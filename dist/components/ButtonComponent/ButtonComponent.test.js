import { jsx as _jsx } from "react/jsx-runtime";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import ButtonComponent from "./ButtonComponent.js";
// Mock the components provider to avoid needing the full context
vi.mock("../ComponentsProvider.tsx", () => ({
    useComponents: () => ({ sound: false }),
}));
// Mock sound service
vi.mock("../../services/SoundService.tsx", () => ({
    default: {
        playHoverButton: vi.fn(),
        playClickButton: vi.fn(),
    },
}));
describe("ButtonComponent", () => {
    /* ── Core rendering ────────────────────────────────────────────── */
    it("renders with default primary variant", () => {
        render(_jsx(ButtonComponent, { children: "Click Me" }));
        const button = screen.getByRole("button", { name: "Click Me" });
        expect(button).toBeInTheDocument();
        expect(button).toHaveClass(/btn/i);
        expect(button).toHaveClass(/primary/i);
        expect(button).not.toBeDisabled();
    });
    it("renders children text within a label span", () => {
        const { container } = render(_jsx(ButtonComponent, { children: "Label Text" }));
        const label = container.querySelector('[class*="label"]');
        expect(label).toBeInTheDocument();
        expect(label.textContent).toBe("Label Text");
    });
    /* ── M3 Variants ───────────────────────────────────────────────── */
    it.each(["filled", "outlined", "text", "elevated", "tonal"])('renders M3 "%s" variant', (variant) => {
        render(_jsx(ButtonComponent, { variant: variant, children: variant }));
        const button = screen.getByRole("button", { name: variant });
        expect(button).toBeInTheDocument();
    });
    it.each(["primary", "secondary", "disabled", "destructive", "creative"])('renders legacy "%s" variant', (variant) => {
        render(_jsx(ButtonComponent, { variant: variant, children: variant }));
        const button = screen.getByRole("button", { name: variant });
        expect(button).toBeInTheDocument();
    });
    /* ── State layer ───────────────────────────────────────────────── */
    it("renders a state layer element", () => {
        const { container } = render(_jsx(ButtonComponent, { children: "With State Layer" }));
        const stateLayer = container.querySelector('[class*="stateLayer"]');
        expect(stateLayer).toBeInTheDocument();
    });
    /* ── Interaction ───────────────────────────────────────────────── */
    it("triggers onClick when clicked", async () => {
        const handleClick = vi.fn();
        render(_jsx(ButtonComponent, { onClick: handleClick, children: "Click Me" }));
        const button = screen.getByRole("button", { name: "Click Me" });
        await userEvent.click(button);
        expect(handleClick).toHaveBeenCalledTimes(1);
    });
    it("does not trigger onClick when disabled", async () => {
        const handleClick = vi.fn();
        render(_jsx(ButtonComponent, { disabled: true, onClick: handleClick, children: "Disabled" }));
        const button = screen.getByRole("button", { name: "Disabled" });
        await userEvent.click(button);
        expect(handleClick).not.toHaveBeenCalled();
    });
    /* ── Disabled ──────────────────────────────────────────────────── */
    it("is disabled when disabled prop is true", () => {
        render(_jsx(ButtonComponent, { disabled: true, children: "Disabled Btn" }));
        const button = screen.getByRole("button", { name: "Disabled Btn" });
        expect(button).toBeDisabled();
    });
    /* ── Loading ───────────────────────────────────────────────────── */
    it("is disabled and shows spinner when loading prop is true", () => {
        const { container } = render(_jsx(ButtonComponent, { loading: true, children: "Loading Btn" }));
        const button = screen.getByRole("button", { name: "Loading Btn" });
        expect(button).toBeDisabled();
        expect(button).toHaveAttribute("aria-busy", "true");
        const spinner = container.querySelector('[class*="spinner"]');
        expect(spinner).toBeInTheDocument();
    });
    /* ── Full width ────────────────────────────────────────────────── */
    it("applies fullWidth class when fullWidth prop is true", () => {
        render(_jsx(ButtonComponent, { fullWidth: true, children: "Full Width" }));
        const button = screen.getByRole("button", { name: "Full Width" });
        expect(button).toHaveClass(/fullWidth/i);
    });
    /* ── Icon support ──────────────────────────────────────────────── */
    it("renders an icon if provided", () => {
        const MockIcon = () => _jsx("svg", { "data-testid": "mock-icon" });
        render(_jsx(ButtonComponent, { icon: MockIcon, children: "With Icon" }));
        const icon = screen.getByTestId("mock-icon");
        expect(icon).toBeInTheDocument();
    });
    it("applies hasIcon class when icon and label are both present", () => {
        const MockIcon = () => _jsx("svg", { "data-testid": "mock-icon" });
        render(_jsx(ButtonComponent, { icon: MockIcon, children: "With Icon" }));
        const button = screen.getByRole("button", { name: "With Icon" });
        expect(button).toHaveClass(/hasIcon/i);
    });
    it("applies iconOnly class when icon present but no children", () => {
        const MockIcon = () => _jsx("svg", { "data-testid": "mock-icon" });
        render(_jsx(ButtonComponent, { icon: MockIcon, "aria-label": "Icon Only" }));
        const button = screen.getByRole("button", { name: "Icon Only" });
        expect(button).toHaveClass(/iconOnly/i);
    });
    /* ── Sizes ─────────────────────────────────────────────────────── */
    it("applies small size class", () => {
        render(_jsx(ButtonComponent, { size: "small", children: "Small" }));
        const button = screen.getByRole("button", { name: "Small" });
        expect(button).toHaveClass(/small/i);
    });
    it("applies large size class", () => {
        render(_jsx(ButtonComponent, { size: "large", children: "Large" }));
        const button = screen.getByRole("button", { name: "Large" });
        expect(button).toHaveClass(/large/i);
    });
    /* ── Link-as-button ────────────────────────────────────────────── */
    it("renders as an <a> tag when href is provided", () => {
        render(_jsx(ButtonComponent, { href: "/test", children: "Link Button" }));
        const link = screen.getByRole("button", { name: "Link Button" });
        expect(link.tagName).toBe("A");
        expect(link).toHaveAttribute("href", "/test");
    });
    it("does not render as <a> when disabled even with href", () => {
        render(_jsx(ButtonComponent, { href: "/test", disabled: true, children: "Disabled Link" }));
        const button = screen.getByRole("button", { name: "Disabled Link" });
        expect(button.tagName).toBe("BUTTON");
        expect(button).toBeDisabled();
    });
    /* ── Submit variant ────────────────────────────────────────────── */
    it('renders type="submit" for submit variant', () => {
        render(_jsx(ButtonComponent, { variant: "submit", children: "Go" }));
        const button = screen.getByRole("button", { name: "Go" });
        expect(button).toHaveAttribute("type", "submit");
    });
    it("applies submitGenerating class when generating", () => {
        const MockIcon = () => _jsx("svg", { "data-testid": "stop-icon" });
        render(_jsx(ButtonComponent, { variant: "submit", isGenerating: true, icon: MockIcon }));
        const button = screen.getByRole("button");
        expect(button).toHaveClass(/submitGenerating/i);
    });
    /* ── Accessibility ─────────────────────────────────────────────── */
    it('defaults to type="button" for non-submit variants', () => {
        render(_jsx(ButtonComponent, { children: "Default" }));
        const button = screen.getByRole("button", { name: "Default" });
        expect(button).toHaveAttribute("type", "button");
    });
});
//# sourceMappingURL=ButtonComponent.test.js.map