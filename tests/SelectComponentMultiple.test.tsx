// Multi-select chips sit inside the trigger <button>. Their remove control
// must not be a <button> too: a button inside a button is invalid HTML, and
// every server-rendered app with a multi-select failed hydration on it (React
// then rebuilt the whole page on the client).

import React from "react";
import { fireEvent, render } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import SelectComponent from "@/components/SelectComponent/SelectComponent.tsx";

const OPTIONS = [
  { label: "Alpha", value: "a" },
  { label: "Beta", value: "b" },
  { label: "Gamma", value: "c" },
];

function renderMultiple(props: Partial<React.ComponentProps<typeof SelectComponent>> = {}) {
  const onChange = vi.fn();
  const view = render(<SelectComponent multiple options={OPTIONS} value={["a", "b"]} onChange={onChange} {...props} />);
  const alphaChip = [...view.container.querySelectorAll("[class*='chip-element']")].find(
    (chip) => chip.textContent === "Alpha",
  )!;
  const removeAlpha = alphaChip.querySelector("[class*='chip-remove-button']")!;
  const trigger = view.container.querySelector("button[class*='trigger']")!;
  return { ...view, onChange, removeAlpha, trigger };
}

describe("SelectComponent multiple", () => {
  it("never nests an interactive button inside the trigger button", () => {
    const { container } = renderMultiple();
    expect(container.querySelectorAll("button button")).toHaveLength(0);
  });

  it("removes a chip's value without opening the menu", () => {
    const { onChange, removeAlpha, trigger } = renderMultiple();
    fireEvent.click(removeAlpha);
    expect(onChange).toHaveBeenCalledWith(["b"]);
    expect(trigger.className).not.toMatch(/trigger-open/);
  });

  it("ignores chip removal while disabled", () => {
    const { onChange, removeAlpha } = renderMultiple({ disabled: true });
    fireEvent.click(removeAlpha);
    expect(onChange).not.toHaveBeenCalled();
  });
});
