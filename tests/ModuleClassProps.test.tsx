import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import type { ReactElement } from "react";
import StatusDotComponent from "../src/components/StatusDotComponent/StatusDotComponent.js";
import AvatarComponent from "../src/components/AvatarComponent/AvatarComponent.js";
import ProgressBarComponent from "../src/components/ProgressBarComponent/ProgressBarComponent.js";
import CarouselComponent from "../src/components/CarouselComponent/CarouselComponent.js";
import SkeletonComponent from "../src/components/SkeletonComponent/SkeletonComponent.js";
import StatsCardComponent from "../src/components/StatsCardComponent/StatsCardComponent.js";
import BadgeComponent from "../src/components/BadgeComponent/BadgeComponent.js";

// Regression: cb3bd97 renamed the size/layout classes to kebab-case while the
// components kept looking the raw prop up (`styles[size]`), so status dots
// rendered 0×0, progress tracks had no height and avatars no size — and
// nothing reported it, because a missing CSS-module key is just undefined.
// Vitest hands CSS modules back as a proxy that hashes ANY key
// (`_size-medium_d146b7`, but also `_md_d146b7`), so these assert the exact
// class name each token must resolve to; the fall-back-when-missing path is
// covered with a plain map in src/utils/moduleClasses.test.ts.

function classesOf(element: ReactElement, selector?: string): string {
  const { container } = render(element);
  const node = selector ? container.querySelector(selector) : container.firstElementChild;
  return node?.className.toString() ?? "";
}

describe("size, variant and layout props apply their CSS classes", () => {
  it.each([
    ["sm", "size-small"],
    ["md", "size-medium"],
    ["lg", "size-large"],
  ])("StatusDotComponent size=%s", (size, expected) => {
    expect(classesOf(<StatusDotComponent size={size} />)).toContain(`_${expected}_`);
  });

  it.each([
    ["xs", "size-extra-small"],
    ["md", "size-medium"],
    ["xl", "size-extra-large"],
  ] as const)("AvatarComponent size=%s", (size, expected) => {
    expect(classesOf(<AvatarComponent name="Ada Lovelace" size={size} />)).toContain(`_${expected}_`);
  });

  it("ProgressBarComponent draws a track height and a fill for every variant", () => {
    expect(classesOf(<ProgressBarComponent value={40} />, "[class*='_track_']")).toContain("_size-medium_");
    expect(classesOf(<ProgressBarComponent value={40} size="xs" />, "[class*='_track_']")).toContain("_size-extra-small_");
    expect(classesOf(<ProgressBarComponent value={40} variant="error" />, "[class*='_bar_']")).toContain("_danger_");
  });

  it.each([
    ["multiBrowse", "multi-browse"],
    ["fullWidth", "full-width"],
    ["hero", "hero"],
  ])("CarouselComponent layout=%s", (layout, expected) => {
    expect(classesOf(<CarouselComponent layout={layout} items={[]} />)).toContain(`_${expected}_`);
  });

  it.each([
    ["rect", "rectangular"],
    ["card", "rectangular"],
    ["avatar", "circular"],
    ["text", "text"],
  ])("SkeletonComponent variant=%s", (variant, expected) => {
    expect(classesOf(<SkeletonComponent variant={variant} />)).toContain(`_${expected}_`);
  });

  it("StatsCardComponent and BadgeComponent accept both danger and error", () => {
    const Icon = () => <svg />;
    expect(classesOf(<StatsCardComponent label="CPU" value="99%" icon={Icon} variant="error" />, "[class*='_icon_']")).toContain("_danger_");
    expect(classesOf(<BadgeComponent variant="danger">down</BadgeComponent>)).toContain("_error_");
  });
});
