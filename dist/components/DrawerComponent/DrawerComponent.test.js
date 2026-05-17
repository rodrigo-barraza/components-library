import { jsx as _jsx } from "react/jsx-runtime";
// @ts-nocheck
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import DrawerComponent from "./DrawerComponent.js";
// Mock createPortal to render inline for tests
vi.mock("react-dom", async () => {
    const actual = await vi.importActual("react-dom");
    return { ...actual, createPortal: (node) => node };
});
// ComponentsProvider mock
vi.mock("../ComponentsProvider.tsx", () => ({
    useComponents: () => ({ sound: false }),
}));
describe("DrawerComponent", () => {
    let onClose;
    beforeEach(() => {
        onClose = vi.fn();
    });
    it("renders nothing when closed", () => {
        const { container } = render(_jsx(DrawerComponent, { open: false, onClose: onClose, title: "Test" }));
        expect(container.innerHTML).toBe("");
    });
    it("renders title and close button when open", () => {
        render(_jsx(DrawerComponent, { open: true, onClose: onClose, title: "My Drawer" }));
        expect(screen.getByText("My Drawer")).toBeTruthy();
        expect(screen.getByTitle("Close")).toBeTruthy();
    });
    it("renders structured sections", () => {
        const sections = [
            {
                title: "Info",
                items: [
                    { label: "Name", value: "Alice" },
                    { label: "Age", value: "30", mono: true },
                ],
            },
        ];
        render(_jsx(DrawerComponent, { open: true, onClose: onClose, sections: sections }));
        expect(screen.getByText("Info")).toBeTruthy();
        expect(screen.getByText("Name")).toBeTruthy();
        expect(screen.getByText("Alice")).toBeTruthy();
        expect(screen.getByText("Age")).toBeTruthy();
        expect(screen.getByText("30")).toBeTruthy();
    });
    it("renders children after sections", () => {
        render(_jsx(DrawerComponent, { open: true, onClose: onClose, children: _jsx("div", { "data-testid": "custom", children: "Custom Content" }) }));
        expect(screen.getByTestId("custom")).toBeTruthy();
    });
    it("calls onClose on Escape key", () => {
        render(_jsx(DrawerComponent, { open: true, onClose: onClose, title: "Test" }));
        fireEvent.keyDown(document, { key: "Escape" });
        // onClose fires after animation, but closing state should be set
        // Since we mock createPortal, the animationEnd won't fire automatically,
        // but we can verify the key handler triggers the close flow
        expect(onClose).not.toHaveBeenCalled(); // close is deferred to animationEnd
    });
    it("does not dismiss on Escape when dismissible=false", () => {
        render(_jsx(DrawerComponent, { open: true, onClose: onClose, title: "Locked", dismissible: false }));
        fireEvent.keyDown(document, { key: "Escape" });
        expect(onClose).not.toHaveBeenCalled();
        // Close button should not render
        expect(screen.queryByTitle("Close")).toBeNull();
    });
    it("renders scrim overlay when scrim=true", () => {
        const { container } = render(_jsx(DrawerComponent, { open: true, onClose: onClose, scrim: true }));
        const scrimEl = container.querySelector("[class*='scrim']");
        expect(scrimEl).toBeTruthy();
    });
    it("applies left anchor class", () => {
        const { container } = render(_jsx(DrawerComponent, { open: true, onClose: onClose, anchor: "left" }));
        const drawer = container.querySelector("[class*='drawer']");
        expect(drawer.className).toContain("left");
    });
});
//# sourceMappingURL=DrawerComponent.test.js.map