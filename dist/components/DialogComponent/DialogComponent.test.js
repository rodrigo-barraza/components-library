import { jsx as _jsx } from "react/jsx-runtime";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import DialogComponent from "./DialogComponent.js";
describe("DialogComponent", () => {
    let user;
    beforeEach(() => {
        user = userEvent.setup();
    });
    afterEach(() => {
        // Cleanup body overflow style
        document.body.style.overflow = "";
    });
    // ── Rendering ─────────────────────────────────────────
    it("does not render when open is false", () => {
        render(_jsx(DialogComponent, { open: false, onClose: vi.fn(), children: "Hidden content" }));
        expect(screen.queryByRole("alertdialog")).not.toBeInTheDocument();
    });
    it("renders when open is true", () => {
        render(_jsx(DialogComponent, { open: true, onClose: vi.fn(), children: "Visible content" }));
        expect(screen.getByRole("alertdialog")).toBeInTheDocument();
        expect(screen.getByText("Visible content")).toBeInTheDocument();
    });
    it("renders headline when provided", () => {
        render(_jsx(DialogComponent, { open: true, onClose: vi.fn(), headline: "Delete item?", children: "Are you sure?" }));
        expect(screen.getByText("Delete item?")).toBeInTheDocument();
    });
    it("renders icon when provided", () => {
        const MockIcon = () => _jsx("svg", { "data-testid": "dialog-icon" });
        render(_jsx(DialogComponent, { open: true, onClose: vi.fn(), icon: _jsx(MockIcon, {}), children: "Content" }));
        expect(screen.getByTestId("dialog-icon")).toBeInTheDocument();
    });
    it("renders default OK/Cancel button labels", () => {
        render(_jsx(DialogComponent, { open: true, onClose: vi.fn(), children: "Content" }));
        expect(screen.getByRole("button", { name: "OK" })).toBeInTheDocument();
        expect(screen.getByRole("button", { name: "Cancel" })).toBeInTheDocument();
    });
    it("renders custom button labels", () => {
        render(_jsx(DialogComponent, { open: true, onClose: vi.fn(), confirmLabel: "Delete", cancelLabel: "Keep", children: "Content" }));
        expect(screen.getByRole("button", { name: "Delete" })).toBeInTheDocument();
        expect(screen.getByRole("button", { name: "Keep" })).toBeInTheDocument();
    });
    it("hides cancel button when hideCancel is true", () => {
        render(_jsx(DialogComponent, { open: true, onClose: vi.fn(), hideCancel: true, children: "Acknowledge" }));
        expect(screen.getByRole("button", { name: "OK" })).toBeInTheDocument();
        expect(screen.queryByRole("button", { name: "Cancel" })).not.toBeInTheDocument();
    });
    // ── ARIA attributes ───────────────────────────────────
    it("applies correct ARIA attributes", () => {
        render(_jsx(DialogComponent, { open: true, onClose: vi.fn(), headline: "Confirm action", id: "test-dialog", children: "Are you sure?" }));
        const dialog = screen.getByRole("alertdialog");
        expect(dialog).toHaveAttribute("aria-modal", "true");
        expect(dialog).toHaveAttribute("aria-labelledby", "test-dialog-headline");
        expect(dialog).toHaveAttribute("aria-describedby", "test-dialog-body");
    });
    // ── Interactions ──────────────────────────────────────
    it("calls onConfirm when confirm button is clicked", async () => {
        const handleConfirm = vi.fn();
        render(_jsx(DialogComponent, { open: true, onClose: vi.fn(), onConfirm: handleConfirm, children: "Content" }));
        await user.click(screen.getByRole("button", { name: "OK" }));
        expect(handleConfirm).toHaveBeenCalledTimes(1);
    });
    it("disables confirm button when confirmDisabled is true", () => {
        render(_jsx(DialogComponent, { open: true, onClose: vi.fn(), confirmDisabled: true, children: "Content" }));
        expect(screen.getByRole("button", { name: "OK" })).toBeDisabled();
    });
    // ── Body scroll lock ──────────────────────────────────
    it("locks body scroll when open", () => {
        render(_jsx(DialogComponent, { open: true, onClose: vi.fn(), children: "Content" }));
        expect(document.body.style.overflow).toBe("hidden");
    });
    it("restores body scroll on unmount", () => {
        document.body.style.overflow = "auto";
        const { unmount } = render(_jsx(DialogComponent, { open: true, onClose: vi.fn(), children: "Content" }));
        expect(document.body.style.overflow).toBe("hidden");
        unmount();
        expect(document.body.style.overflow).toBe("auto");
    });
});
//# sourceMappingURL=DialogComponent.test.js.map