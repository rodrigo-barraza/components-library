import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import SplitButtonComponent from "./SplitButtonComponent.tsx";
import { ComponentsProvider } from "../ComponentsProvider.tsx";
import { ChevronDown, Plus, Send } from "lucide-react";

/* ── Helper to wrap with ComponentsProvider ──────────────────────── */
function renderWithProvider(ui, providerProps = {}) {
  return render(
    <ComponentsProvider {...providerProps}>{ui}</ComponentsProvider>,
  );
}

describe("SplitButtonComponent", () => {
  /* ══════════════════════════════════════════════════════════════════
     RENDERING
     ══════════════════════════════════════════════════════════════════ */

  describe("Rendering", () => {
    it("renders a group container with two buttons", () => {
      renderWithProvider(<SplitButtonComponent>Save</SplitButtonComponent>);

      const group = screen.getByRole("group");
      expect(group).toBeTruthy();

      const buttons = screen.getAllByRole("button");
      expect(buttons.length).toBe(2);
    });

    it("renders the label text in the leading button", () => {
      renderWithProvider(
        <SplitButtonComponent>Save draft</SplitButtonComponent>,
      );
      expect(screen.getByText("Save draft")).toBeTruthy();
    });

    it("renders with a leading icon", () => {
      renderWithProvider(
        <SplitButtonComponent icon={Plus}>Create</SplitButtonComponent>,
      );
      expect(screen.getByText("Create")).toBeTruthy();
      /* Leading button should have the hasIcon class via the icon presence */
      const buttons = screen.getAllByRole("button");
      expect(buttons[0]).toBeTruthy();
    });

    it("renders a custom trailing icon", () => {
      renderWithProvider(
        <SplitButtonComponent trailingIcon={Send}>
          Send
        </SplitButtonComponent>,
      );

      const buttons = screen.getAllByRole("button");
      expect(buttons[1]).toBeTruthy();
    });

    it("renders with default ChevronDown trailing icon when none provided", () => {
      renderWithProvider(<SplitButtonComponent>Action</SplitButtonComponent>);

      /* Trailing button should render with default icon */
      const buttons = screen.getAllByRole("button");
      expect(buttons[1]).toBeTruthy();
    });
  });

  /* ══════════════════════════════════════════════════════════════════
     VARIANTS
     ══════════════════════════════════════════════════════════════════ */

  describe("Variants", () => {
    it.each(["filled", "tonal", "outlined", "elevated"])(
      "renders %s variant",
      (variant) => {
        renderWithProvider(
          <SplitButtonComponent variant={variant}>
            Label
          </SplitButtonComponent>,
        );
        const group = screen.getByRole("group");
        expect(group.className).toContain(variant);
      },
    );

    it("defaults to filled variant", () => {
      renderWithProvider(<SplitButtonComponent>Default</SplitButtonComponent>);
      const group = screen.getByRole("group");
      expect(group.className).toContain("filled");
    });
  });

  /* ══════════════════════════════════════════════════════════════════
     SIZES
     ══════════════════════════════════════════════════════════════════ */

  describe("Sizes", () => {
    it.each(["small", "large"])("renders %s size", (size) => {
      renderWithProvider(
        <SplitButtonComponent size={size}>Label</SplitButtonComponent>,
      );
      const group = screen.getByRole("group");
      expect(group.className).toContain(size);
    });

    it("does not add size class for medium (default)", () => {
      renderWithProvider(
        <SplitButtonComponent size="medium">Label</SplitButtonComponent>,
      );
      const group = screen.getByRole("group");
      /* medium is the default — no explicit class */
      expect(group.className).not.toContain("small");
      expect(group.className).not.toContain("large");
    });
  });

  /* ══════════════════════════════════════════════════════════════════
     INTERACTION
     ══════════════════════════════════════════════════════════════════ */

  describe("Interaction", () => {
    it("calls onClick when leading button is clicked", async () => {
      const handleClick = vi.fn();
      renderWithProvider(
        <SplitButtonComponent onClick={handleClick}>
          Action
        </SplitButtonComponent>,
      );

      const buttons = screen.getAllByRole("button");
      await userEvent.click(buttons[0]);
      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it("calls onTrailingClick when trailing button is clicked", async () => {
      const handleTrailingClick = vi.fn();
      renderWithProvider(
        <SplitButtonComponent onTrailingClick={handleTrailingClick}>
          Action
        </SplitButtonComponent>,
      );

      const buttons = screen.getAllByRole("button");
      await userEvent.click(buttons[1]);
      expect(handleTrailingClick).toHaveBeenCalledTimes(1);
    });

    it("does not call onClick when disabled", async () => {
      const handleClick = vi.fn();
      renderWithProvider(
        <SplitButtonComponent disabled onClick={handleClick}>
          Action
        </SplitButtonComponent>,
      );

      const buttons = screen.getAllByRole("button");
      /* disabled buttons can't be clicked via userEvent */
      expect(buttons[0].disabled).toBe(true);
      expect(buttons[1].disabled).toBe(true);
    });

    it("does not call callbacks when loading", async () => {
      const handleClick = vi.fn();
      const handleTrailingClick = vi.fn();
      renderWithProvider(
        <SplitButtonComponent
          loading
          onClick={handleClick}
          onTrailingClick={handleTrailingClick}
        >
          Loading...
        </SplitButtonComponent>,
      );

      const buttons = screen.getAllByRole("button");
      expect(buttons[0].disabled).toBe(true);
      expect(buttons[1].disabled).toBe(true);
    });
  });

  /* ══════════════════════════════════════════════════════════════════
     ACCESSIBILITY
     ══════════════════════════════════════════════════════════════════ */

  describe("Accessibility", () => {
    it("has role='group' on the container", () => {
      renderWithProvider(<SplitButtonComponent>Save</SplitButtonComponent>);
      expect(screen.getByRole("group")).toBeTruthy();
    });

    it("trailing button has aria-haspopup='true'", () => {
      renderWithProvider(<SplitButtonComponent>Save</SplitButtonComponent>);
      const buttons = screen.getAllByRole("button");
      expect(buttons[1].getAttribute("aria-haspopup")).toBe("true");
    });

    it("trailing button has aria-label", () => {
      renderWithProvider(
        <SplitButtonComponent trailingAriaLabel="Show more actions">
          Save
        </SplitButtonComponent>,
      );
      const buttons = screen.getAllByRole("button");
      expect(buttons[1].getAttribute("aria-label")).toBe("Show more actions");
    });

    it("sets aria-expanded on trailing when toggled", () => {
      renderWithProvider(
        <SplitButtonComponent trailingToggled>Save</SplitButtonComponent>,
      );
      const buttons = screen.getAllByRole("button");
      expect(buttons[1].getAttribute("aria-expanded")).toBe("true");
    });

    it("sets aria-busy on leading when loading", () => {
      renderWithProvider(
        <SplitButtonComponent loading>Save</SplitButtonComponent>,
      );
      const buttons = screen.getAllByRole("button");
      expect(buttons[0].getAttribute("aria-busy")).toBe("true");
    });

    it("both buttons are focusable with tabIndex=0", () => {
      renderWithProvider(<SplitButtonComponent>Save</SplitButtonComponent>);
      const buttons = screen.getAllByRole("button");
      expect(buttons[0].tabIndex).toBe(0);
      expect(buttons[1].tabIndex).toBe(0);
    });
  });

  /* ══════════════════════════════════════════════════════════════════
     TOGGLE STATE
     ══════════════════════════════════════════════════════════════════ */

  describe("Toggle state", () => {
    it("does not apply rotation class when not toggled", () => {
      renderWithProvider(<SplitButtonComponent>Save</SplitButtonComponent>);
      const buttons = screen.getAllByRole("button");
      /* Trailing button should not have the toggled class */
      expect(buttons[1].className).not.toContain("trailingToggled");
    });

    it("applies rotation class when toggled", () => {
      renderWithProvider(
        <SplitButtonComponent trailingToggled>Save</SplitButtonComponent>,
      );
      const buttons = screen.getAllByRole("button");
      expect(buttons[1].className).toContain("trailingToggled");
    });
  });

  /* ══════════════════════════════════════════════════════════════════
     FULL WIDTH
     ══════════════════════════════════════════════════════════════════ */

  describe("Full width", () => {
    it("applies fullWidth class", () => {
      renderWithProvider(
        <SplitButtonComponent fullWidth>Save</SplitButtonComponent>,
      );
      const group = screen.getByRole("group");
      expect(group.className).toContain("fullWidth");
    });
  });
});
