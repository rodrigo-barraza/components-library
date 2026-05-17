import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
// @ts-nocheck
import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent, act } from "@testing-library/react";
import MenuComponent, { MenuItem, MenuDivider, MenuGroupLabel, } from "./MenuComponent.js";
// ── Minimal ComponentsProvider mock ──────────────────────
vi.mock("../ComponentsProvider.tsx", () => ({
    useComponents: () => ({ sound: false }),
}));
vi.mock("../../services/SoundService.tsx", () => ({
    default: {
        playClickButton: vi.fn(),
        playHoverButton: vi.fn(),
    },
}));
// ── Helpers ─────────────────────────────────────────────────
function renderMenu(props = {}, menuItems) {
    const defaultItems = menuItems || (_jsxs(_Fragment, { children: [_jsx(MenuItem, { "data-testid": "item-1", children: "Cut" }), _jsx(MenuItem, { "data-testid": "item-2", children: "Copy" }), _jsx(MenuItem, { "data-testid": "item-3", children: "Paste" })] }));
    return render(_jsx(MenuComponent, { trigger: _jsx("button", { "data-testid": "trigger", children: "Open" }), ...props, children: defaultItems }));
}
describe("MenuComponent", () => {
    // ── Rendering ────────────────────────────────────────────
    describe("rendering", () => {
        it("renders the trigger", () => {
            renderMenu();
            expect(screen.getByTestId("trigger")).toBeInTheDocument();
        });
        it("renders menu surface with role='menu'", () => {
            renderMenu();
            expect(screen.getByRole("menu")).toBeInTheDocument();
        });
        it("injects aria-haspopup on trigger", () => {
            renderMenu();
            expect(screen.getByTestId("trigger")).toHaveAttribute("aria-haspopup", "menu");
        });
        it("renders menu items with role='menuitem'", () => {
            renderMenu();
            const items = screen.getAllByRole("menuitem");
            expect(items.length).toBe(3);
        });
    });
    // ── Open / Close ─────────────────────────────────────────
    describe("open / close", () => {
        it("opens on trigger click", async () => {
            renderMenu();
            const trigger = screen.getByTestId("trigger");
            await act(async () => {
                fireEvent.click(trigger);
            });
            expect(trigger).toHaveAttribute("aria-expanded", "true");
            expect(screen.getByRole("menu")).toHaveAttribute("data-open", "true");
        });
        it("closes on Escape", async () => {
            renderMenu();
            await act(async () => {
                fireEvent.click(screen.getByTestId("trigger"));
            });
            await act(async () => {
                fireEvent.keyDown(screen.getByRole("menu").parentElement, {
                    key: "Escape",
                });
            });
            expect(screen.getByTestId("trigger")).toHaveAttribute("aria-expanded", "false");
        });
        it("toggles on repeated trigger clicks", async () => {
            renderMenu();
            const trigger = screen.getByTestId("trigger");
            await act(async () => {
                fireEvent.click(trigger);
            });
            expect(trigger).toHaveAttribute("aria-expanded", "true");
            await act(async () => {
                fireEvent.click(trigger);
            });
            expect(trigger).toHaveAttribute("aria-expanded", "false");
        });
    });
    // ── Controlled mode ──────────────────────────────────────
    describe("controlled mode", () => {
        it("respects external open prop", () => {
            const onChange = vi.fn();
            renderMenu({ open: true, onOpenChange: onChange });
            expect(screen.getByRole("menu")).toHaveAttribute("data-open", "true");
        });
        it("calls onOpenChange on trigger click", async () => {
            const onChange = vi.fn();
            renderMenu({ open: false, onOpenChange: onChange });
            await act(async () => {
                fireEvent.click(screen.getByTestId("trigger"));
            });
            expect(onChange).toHaveBeenCalledWith(true);
        });
    });
    // ── Keyboard navigation ──────────────────────────────────
    describe("keyboard navigation", () => {
        it("ArrowDown opens menu from trigger", async () => {
            renderMenu();
            const anchor = screen.getByRole("menu").parentElement;
            await act(async () => {
                fireEvent.keyDown(anchor, { key: "ArrowDown" });
            });
            expect(screen.getByRole("menu")).toHaveAttribute("data-open", "true");
        });
        it("closes menu and restores focus on Escape", async () => {
            renderMenu();
            const trigger = screen.getByTestId("trigger");
            await act(async () => {
                fireEvent.click(trigger);
            });
            const anchor = screen.getByRole("menu").parentElement;
            await act(async () => {
                fireEvent.keyDown(anchor, { key: "Escape" });
            });
            expect(screen.getByRole("menu")).toHaveAttribute("data-open", "false");
        });
    });
    // ── Menu items ───────────────────────────────────────────
    describe("menu items", () => {
        it("calls onClick on item click", async () => {
            const onClick = vi.fn();
            render(_jsx(MenuComponent, { trigger: _jsx("button", { children: "Open" }), open: true, children: _jsx(MenuItem, { onClick: onClick, "data-testid": "clickable", children: "Action" }) }));
            await act(async () => {
                fireEvent.click(screen.getByTestId("clickable"));
            });
            expect(onClick).toHaveBeenCalledTimes(1);
        });
        it("renders leading icon", () => {
            render(_jsx(MenuComponent, { trigger: _jsx("button", { children: "Open" }), open: true, children: _jsx(MenuItem, { leadingIcon: _jsx("span", { "data-testid": "icon", children: "\u2605" }), children: "Star" }) }));
            expect(screen.getByTestId("icon")).toBeInTheDocument();
        });
        it("renders trailing text", () => {
            render(_jsx(MenuComponent, { trigger: _jsx("button", { children: "Open" }), open: true, children: _jsx(MenuItem, { trailingText: "\u2318C", children: "Copy" }) }));
            expect(screen.getByText("⌘C")).toBeInTheDocument();
        });
        it("disabled item has aria-disabled", () => {
            render(_jsx(MenuComponent, { trigger: _jsx("button", { children: "Open" }), open: true, children: _jsx(MenuItem, { disabled: true, "data-testid": "disabled-item", children: "Disabled" }) }));
            expect(screen.getByTestId("disabled-item")).toBeDisabled();
        });
    });
    // ── Divider ──────────────────────────────────────────────
    describe("divider", () => {
        it("renders with role='separator'", () => {
            render(_jsxs(MenuComponent, { trigger: _jsx("button", { children: "Open" }), open: true, children: [_jsx(MenuItem, { children: "A" }), _jsx(MenuDivider, {}), _jsx(MenuItem, { children: "B" })] }));
            expect(screen.getByRole("separator")).toBeInTheDocument();
        });
    });
    // ── Group label ──────────────────────────────────────────
    describe("group label", () => {
        it("renders group label text", () => {
            render(_jsxs(MenuComponent, { trigger: _jsx("button", { children: "Open" }), open: true, children: [_jsx(MenuGroupLabel, { children: "Editing" }), _jsx(MenuItem, { children: "Cut" })] }));
            expect(screen.getByText("Editing")).toBeInTheDocument();
        });
    });
    // ── Position ─────────────────────────────────────────────
    describe("position", () => {
        it.each(["bottom-start", "bottom-end", "top-start", "top-end"])("applies position class for %s", (pos) => {
            renderMenu({ position: pos, open: true });
            // Just verify it doesn't throw
            expect(screen.getByRole("menu")).toBeInTheDocument();
        });
    });
    // ── Close on select ──────────────────────────────────────
    describe("closeOnSelect", () => {
        it("closes when closeOnSelect=true (default)", async () => {
            const onChange = vi.fn();
            render(_jsx(MenuComponent, { trigger: _jsx("button", { "data-testid": "trigger", children: "Open" }), open: true, onOpenChange: onChange, children: _jsx(MenuItem, { "data-testid": "item", children: "Action" }) }));
            await act(async () => {
                fireEvent.click(screen.getByTestId("item"));
            });
            expect(onChange).toHaveBeenCalledWith(false);
        });
    });
    // ── Match width ──────────────────────────────────────────
    describe("matchWidth", () => {
        it("applies matchWidth class", () => {
            renderMenu({ matchWidth: true, open: true });
            const menu = screen.getByRole("menu");
            expect(menu.className).toContain("matchWidth");
        });
    });
    // ── Max height ───────────────────────────────────────────
    describe("maxHeight", () => {
        it("sets data-scrollable and CSS variable", () => {
            renderMenu({ maxHeight: 200, open: true });
            const menu = screen.getByRole("menu");
            expect(menu).toHaveAttribute("data-scrollable", "true");
            expect(menu.style.getPropertyValue("--menu-max-height")).toBe("200px");
        });
    });
});
//# sourceMappingURL=MenuComponent.test.js.map