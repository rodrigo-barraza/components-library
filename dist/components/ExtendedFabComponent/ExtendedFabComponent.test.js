import { jsx as _jsx } from "react/jsx-runtime";
// @ts-nocheck
import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import ExtendedFabComponent from "./ExtendedFabComponent.js";
// Mock the components provider
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
describe("ExtendedFabComponent", () => {
    // ── Rendering ───────────────────────────────────────────
    it("renders with default primary variant and label", () => {
        render(_jsx(ExtendedFabComponent, { children: "Create" }));
        const button = screen.getByRole("button", { name: "Create" });
        expect(button).toBeInTheDocument();
        expect(button).toHaveClass(/extendedFab/i);
        expect(button).toHaveClass(/primary/i);
        expect(button).not.toBeDisabled();
    });
    it("renders with an icon and label", () => {
        const MockIcon = (props) => _jsx("svg", { "data-testid": "fab-icon", ...props });
        render(_jsx(ExtendedFabComponent, { icon: MockIcon, children: "Compose" }));
        const icon = screen.getByTestId("fab-icon");
        expect(icon).toBeInTheDocument();
        expect(screen.getByText("Compose")).toBeInTheDocument();
    });
    it("renders icon with size=24 per M3 spec", () => {
        const MockIcon = (props) => (_jsx("svg", { "data-testid": "fab-icon", "data-size": props.size }));
        render(_jsx(ExtendedFabComponent, { icon: MockIcon, children: "New" }));
        const icon = screen.getByTestId("fab-icon");
        expect(icon).toHaveAttribute("data-size", "24");
    });
    // ── Variants ────────────────────────────────────────────
    it.each(["primary", "secondary", "tertiary", "surface"])("applies the %s variant class", (variant) => {
        render(_jsx(ExtendedFabComponent, { variant: variant, children: "Action" }));
        const button = screen.getByRole("button", { name: "Action" });
        expect(button).toHaveClass(new RegExp(variant, "i"));
    });
    // ── Interaction ─────────────────────────────────────────
    it("triggers onClick when clicked", async () => {
        const handleClick = vi.fn();
        render(_jsx(ExtendedFabComponent, { onClick: handleClick, children: "Click" }));
        const button = screen.getByRole("button", { name: "Click" });
        await userEvent.click(button);
        expect(handleClick).toHaveBeenCalledTimes(1);
    });
    it("does not fire onClick when disabled", async () => {
        const handleClick = vi.fn();
        render(_jsx(ExtendedFabComponent, { onClick: handleClick, disabled: true, children: "Click" }));
        const button = screen.getByRole("button", { name: "Click" });
        expect(button).toBeDisabled();
        await userEvent.click(button).catch(() => { });
        expect(handleClick).not.toHaveBeenCalled();
    });
    // ── Collapsed mode ──────────────────────────────────────
    it("applies collapsed class when collapsed prop is true", () => {
        const MockIcon = () => _jsx("svg", { "data-testid": "fab-icon" });
        render(_jsx(ExtendedFabComponent, { collapsed: true, icon: MockIcon, ariaLabel: "Create", children: "Create" }));
        const button = screen.getByRole("button", { name: "Create" });
        expect(button).toHaveClass(/collapsed/i);
    });
    // ── Lowered ─────────────────────────────────────────────
    it("applies lowered class when lowered prop is true", () => {
        render(_jsx(ExtendedFabComponent, { lowered: true, children: "Low" }));
        const button = screen.getByRole("button", { name: "Low" });
        expect(button).toHaveClass(/lowered/i);
    });
    // ── Fixed positioning ───────────────────────────────────
    it("applies fixed class when fixed prop is true", () => {
        render(_jsx(ExtendedFabComponent, { fixed: true, children: "Fixed" }));
        const button = screen.getByRole("button", { name: "Fixed" });
        expect(button).toHaveClass(/fixed/i);
    });
    // ── Accessibility ───────────────────────────────────────
    it("accepts aria-label for collapsed (icon-only) mode", () => {
        const MockIcon = () => _jsx("svg", { "data-testid": "fab-icon" });
        render(_jsx(ExtendedFabComponent, { collapsed: true, icon: MockIcon, ariaLabel: "New item", children: "New item" }));
        const button = screen.getByRole("button", { name: "New item" });
        expect(button).toBeInTheDocument();
    });
    it("marks icon as aria-hidden", () => {
        const MockIcon = () => _jsx("svg", { "data-testid": "fab-icon" });
        render(_jsx(ExtendedFabComponent, { icon: MockIcon, children: "Create" }));
        // The wrapping <span> should have aria-hidden
        const iconWrapper = screen.getByTestId("fab-icon").parentElement;
        expect(iconWrapper).toHaveAttribute("aria-hidden", "true");
    });
    // ── Ref forwarding ──────────────────────────────────────
    it("forwards ref to the button element", () => {
        const ref = React.createRef();
        render(_jsx(ExtendedFabComponent, { ref: ref, children: "Ref" }));
        expect(ref.current).toBeInstanceOf(HTMLButtonElement);
    });
});
//# sourceMappingURL=ExtendedFabComponent.test.js.map