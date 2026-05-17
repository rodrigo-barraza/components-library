// @ts-nocheck
// ── Render tests for all previously untested components ──────────
// Each component gets at least one render test verifying it mounts
// without crashing, per the testing-standards minimum coverage contract.

import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";

// ── Global mocks for ComponentsProvider + SoundService ─────────
vi.mock(
  "@/components/ComponentsProvider.tsx",
  () => ({
    useComponents: () => ({ sound: false }),
  }),
);

vi.mock("@/services/SoundService.tsx", () => ({
  default: {
    playHoverButton: vi.fn(),
    playClickButton: vi.fn(),
    playHoverTab: vi.fn(),
    playClickTab: vi.fn(),
    playToggleOn: vi.fn(),
    playToggleOff: vi.fn(),
    playHoverChip: vi.fn(),
    playClickChip: vi.fn(),
    playOpen: vi.fn(),
    playClose: vi.fn(),
    playNavClick: vi.fn(),
    playNavHover: vi.fn(),
    playSlider: vi.fn(),
    playCheckOn: vi.fn(),
    playCheckOff: vi.fn(),
    playRadioSelect: vi.fn(),
  },
}));

// ── Import all untested components ─────────────────────────────
import AvatarComponent from "@/components/AvatarComponent/AvatarComponent.tsx";
import CardComponent from "@/components/CardComponent/CardComponent.tsx";
import CheckboxComponent from "@/components/CheckboxComponent/CheckboxComponent.tsx";
import ChipComponent from "@/components/ChipComponent/ChipComponent.tsx";
import CloseButtonComponent from "@/components/CloseButtonComponent/CloseButtonComponent.tsx";
import EmptyStateComponent from "@/components/EmptyStateComponent/EmptyStateComponent.tsx";
import IconButtonComponent from "@/components/IconButtonComponent/IconButtonComponent.tsx";
import InputComponent from "@/components/InputComponent/InputComponent.tsx";
import LoadingIndicatorComponent from "@/components/LoadingIndicatorComponent/LoadingIndicatorComponent.tsx";
import ModalComponent from "@/components/ModalComponent/ModalComponent.tsx";
import ProgressBarComponent from "@/components/ProgressBarComponent/ProgressBarComponent.tsx";
import RadioComponent from "@/components/RadioComponent/RadioComponent.tsx";
import SearchInputComponent from "@/components/SearchInputComponent/SearchInputComponent.tsx";
import SelectComponent from "@/components/SelectComponent/SelectComponent.tsx";
import SkeletonComponent from "@/components/SkeletonComponent/SkeletonComponent.tsx";
import SliderComponent from "@/components/SliderComponent/SliderComponent.tsx";
import SwitchComponent from "@/components/SwitchComponent/SwitchComponent.tsx";
import TabBarComponent from "@/components/TabBarComponent/TabBarComponent.tsx";
import TextAreaComponent from "@/components/TextAreaComponent/TextAreaComponent.tsx";
import TextFieldComponent from "@/components/TextFieldComponent/TextFieldComponent.tsx";
import ToggleComponent from "@/components/ToggleComponent/ToggleComponent.tsx";
import TooltipComponent from "@/components/TooltipComponent/TooltipComponent.tsx";
import ToolbarComponent from "@/components/ToolbarComponent/ToolbarComponent.tsx";

// ── Badge variants ─────────────────────────────────────────────
import AddressBadgeComponent from "@/components/AddressBadgeComponent/AddressBadgeComponent.tsx";
import CountBadgeComponent from "@/components/CountBadgeComponent/CountBadgeComponent.tsx";
// DateTimeBadgeComponent excluded — requires luxon (not in devDependencies)
import DeviceBadgeComponent from "@/components/DeviceBadgeComponent/DeviceBadgeComponent.tsx";
import DomainBadgeComponent from "@/components/DomainBadgeComponent/DomainBadgeComponent.tsx";
import PortBadgeComponent from "@/components/PortBadgeComponent/PortBadgeComponent.tsx";
import RepositoryBadgeComponent from "@/components/RepositoryBadgeComponent/RepositoryBadgeComponent.tsx";
import ResponseTimeBadgeComponent from "@/components/ResponseTimeBadgeComponent/ResponseTimeBadgeComponent.tsx";
import StatusBadgeComponent from "@/components/StatusBadgeComponent/StatusBadgeComponent.tsx";
import VisibilityBadgeComponent from "@/components/VisibilityBadgeComponent/VisibilityBadgeComponent.tsx";

// ── Layout & Navigation ────────────────────────────────────────
import BreadcrumbComponent from "@/components/BreadcrumbComponent/BreadcrumbComponent.tsx";
import CollapsibleBlockComponent from "@/components/CollapsibleBlockComponent/CollapsibleBlockComponent.tsx";
import CopyButtonComponent from "@/components/CopyButtonComponent/CopyButtonComponent.tsx";
import FormGroupComponent from "@/components/FormGroupComponent/FormGroupComponent.tsx";
import PageHeaderComponent from "@/components/PageHeaderComponent/PageHeaderComponent.tsx";
import PaginationComponent from "@/components/PaginationComponent/PaginationComponent.tsx";
import StatsCardComponent from "@/components/StatsCardComponent/StatsCardComponent.tsx";
import ThemeToggleButtonComponent from "@/components/ThemeToggleButtonComponent/ThemeToggleButtonComponent.tsx";
import TopAppBarComponent from "@/components/TopAppBarComponent/TopAppBarComponent.tsx";

// ═══════════════════════════════════════════════════════════════
// Tests
// ═══════════════════════════════════════════════════════════════

// ── Form Controls ──────────────────────────────────────────────

describe("CheckboxComponent", () => {
  it("renders without crashing", () => {
    render(<CheckboxComponent label="Accept terms" />);
    expect(screen.getByText("Accept terms")).toBeInTheDocument();
  });
});

describe("InputComponent", () => {
  it("renders without crashing", () => {
    render(<InputComponent placeholder="Type here" />);
    expect(screen.getByPlaceholderText("Type here")).toBeInTheDocument();
  });
});

describe("RadioComponent", () => {
  it("renders without crashing", () => {
    render(<RadioComponent label="Option A" name="radio-test" value="a" />);
    expect(screen.getByText("Option A")).toBeInTheDocument();
  });
});

describe("SearchInputComponent", () => {
  it("renders without crashing", () => {
    render(<SearchInputComponent placeholder="Search..." />);
    expect(screen.getByPlaceholderText("Search...")).toBeInTheDocument();
  });
});

describe("SelectComponent", () => {
  it("renders without crashing", () => {
    render(
      <SelectComponent
        placeholder="Pick one"
        options={[
          { label: "A", value: "a" },
          { label: "B", value: "b" },
        ]}
      />,
    );
    expect(screen.getByText("Pick one")).toBeInTheDocument();
  });
});

describe("SliderComponent", () => {
  it("renders without crashing", () => {
    const { container } = render(<SliderComponent min={0} max={100} value={50} />);
    expect(container.firstChild).toBeTruthy();
  });
});

describe("SwitchComponent", () => {
  it("renders without crashing", () => {
    render(<SwitchComponent label="Dark mode" />);
    expect(screen.getByText("Dark mode")).toBeInTheDocument();
  });
});

describe("TextAreaComponent", () => {
  it("renders without crashing", () => {
    render(<TextAreaComponent placeholder="Write something" />);
    expect(screen.getByPlaceholderText("Write something")).toBeInTheDocument();
  });
});

describe("TextFieldComponent", () => {
  it("renders without crashing", () => {
    render(<TextFieldComponent label="Email" placeholder="you@email.com" />);
    expect(screen.getByPlaceholderText("you@email.com")).toBeInTheDocument();
  });
});

describe("ToggleComponent", () => {
  it("renders without crashing", () => {
    const { container } = render(<ToggleComponent />);
    expect(container.firstChild).toBeTruthy();
  });
});

// ── Display Components ─────────────────────────────────────────

describe("AvatarComponent", () => {
  it("renders with fallback initials", () => {
    render(<AvatarComponent name="John Doe" />);
    expect(screen.getByText(/J/i)).toBeInTheDocument();
  });
});

describe("CardComponent", () => {
  it("renders children", () => {
    render(<CardComponent>Card Content</CardComponent>);
    expect(screen.getByText("Card Content")).toBeInTheDocument();
  });
});

describe("ChipComponent", () => {
  it("renders label text", () => {
    render(<ChipComponent>Active</ChipComponent>);
    expect(screen.getByText("Active")).toBeInTheDocument();
  });
});

describe("EmptyStateComponent", () => {
  it("renders title and subtitle", () => {
    render(<EmptyStateComponent title="No data" subtitle="Try again later" />);
    expect(screen.getByText("No data")).toBeInTheDocument();
    expect(screen.getByText("Try again later")).toBeInTheDocument();
  });
});

describe("LoadingIndicatorComponent", () => {
  it("renders without crashing", () => {
    const { container } = render(<LoadingIndicatorComponent />);
    expect(container.firstChild).toBeTruthy();
  });
});

describe("ModalComponent", () => {
  it("renders when open", () => {
    render(
      <ModalComponent open onClose={() => {}}>
        <div>Modal Content</div>
      </ModalComponent>,
    );
    expect(screen.getByText("Modal Content")).toBeInTheDocument();
  });
});

describe("ProgressBarComponent", () => {
  it("renders with value", () => {
    const { container } = render(<ProgressBarComponent value={75} />);
    expect(container.firstChild).toBeTruthy();
  });
});

describe("SkeletonComponent", () => {
  it("renders without crashing", () => {
    const { container } = render(<SkeletonComponent />);
    expect(container.firstChild).toBeTruthy();
  });
});

describe("TooltipComponent", () => {
  it("renders trigger content", () => {
    render(
      <TooltipComponent content="Tooltip text">
        <span>Hover me</span>
      </TooltipComponent>,
    );
    expect(screen.getByText("Hover me")).toBeInTheDocument();
  });
});

// ── Buttons & Actions ──────────────────────────────────────────

describe("CloseButtonComponent", () => {
  it("renders without crashing", () => {
    const { container } = render(<CloseButtonComponent onClick={() => {}} />);
    expect(container.querySelector("button")).toBeInTheDocument();
  });
});

describe("CopyButtonComponent", () => {
  it("renders without crashing", () => {
    const { container } = render(<CopyButtonComponent text="copy me" />);
    expect(container.querySelector("button")).toBeInTheDocument();
  });
});

describe("IconButtonComponent", () => {
  it("renders without crashing", () => {
    const { container } = render(<IconButtonComponent icon="★" aria-label="Action" />);
    expect(container.querySelector("button")).toBeInTheDocument();
  });
});

describe("ThemeToggleButtonComponent", () => {
  it("renders without crashing", () => {
    const { container } = render(<ThemeToggleButtonComponent />);
    expect(container.querySelector("button")).toBeInTheDocument();
  });
});

// ── Badge Variants ─────────────────────────────────────────────

describe("AddressBadgeComponent", () => {
  it("renders address text", () => {
    render(<AddressBadgeComponent address="123 Main St" />);
    expect(screen.getByText(/123 Main St/)).toBeInTheDocument();
  });
});

describe("CountBadgeComponent", () => {
  it("renders count value", () => {
    render(<CountBadgeComponent count={42} />);
    expect(screen.getByText("42")).toBeInTheDocument();
  });
});

// DateTimeBadgeComponent test excluded — see import comment above

describe("DeviceBadgeComponent", () => {
  it("renders device name", () => {
    render(<DeviceBadgeComponent device="Desktop" />);
    expect(screen.getByText(/Desktop/i)).toBeInTheDocument();
  });
});

describe("DomainBadgeComponent", () => {
  it("renders domain text", () => {
    render(<DomainBadgeComponent domain="example.com" />);
    expect(screen.getByText(/example\.com/)).toBeInTheDocument();
  });
});

describe("PortBadgeComponent", () => {
  it("renders port number", () => {
    render(<PortBadgeComponent port={5590} />);
    expect(screen.getByText(/5590/)).toBeInTheDocument();
  });
});

describe("RepositoryBadgeComponent", () => {
  it("renders repo name", () => {
    render(<RepositoryBadgeComponent repo="prism-service" />);
    expect(screen.getByText(/prism-service/)).toBeInTheDocument();
  });
});

describe("ResponseTimeBadgeComponent", () => {
  it("renders time value", () => {
    render(<ResponseTimeBadgeComponent ms={120} />);
    expect(screen.getByText(/120/)).toBeInTheDocument();
  });
});

describe("StatusBadgeComponent", () => {
  it("renders healthy state", () => {
    render(<StatusBadgeComponent healthy />);
    expect(screen.getByText(/Healthy/i)).toBeInTheDocument();
  });
});

describe("VisibilityBadgeComponent", () => {
  it("renders external visibility", () => {
    const MockGlobe = () => <svg data-testid="globe" />;
    const MockLock = () => <svg data-testid="lock" />;
    render(<VisibilityBadgeComponent visibility="external" icons={{ Globe: MockGlobe, Lock: MockLock }} />);
    expect(screen.getByText("External")).toBeInTheDocument();
  });
});

// ── Layout & Navigation ────────────────────────────────────────

describe("BreadcrumbComponent", () => {
  it("renders breadcrumb items", () => {
    render(
      <BreadcrumbComponent
        items={[
          { label: "Home", href: "/" },
          { label: "Settings" },
        ]}
      />,
    );
    expect(screen.getByText("Home")).toBeInTheDocument();
    expect(screen.getByText("Settings")).toBeInTheDocument();
  });
});

describe("CollapsibleBlockComponent", () => {
  it("renders label", () => {
    render(
      <CollapsibleBlockComponent label="Details">
        <p>Content</p>
      </CollapsibleBlockComponent>,
    );
    expect(screen.getByText("Details")).toBeInTheDocument();
  });
});

describe("FormGroupComponent", () => {
  it("renders label and children", () => {
    render(
      <FormGroupComponent label="Name">
        <input placeholder="Enter name" />
      </FormGroupComponent>,
    );
    expect(screen.getByText("Name")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Enter name")).toBeInTheDocument();
  });
});

describe("PageHeaderComponent", () => {
  it("renders title", () => {
    render(<PageHeaderComponent title="Dashboard" />);
    expect(screen.getByText("Dashboard")).toBeInTheDocument();
  });
});

describe("PaginationComponent", () => {
  it("renders without crashing", () => {
    const { container } = render(
      <PaginationComponent
        currentPage={1}
        totalPages={5}
        onPageChange={() => {}}
      />,
    );
    expect(container.firstChild).toBeTruthy();
  });
});

describe("StatsCardComponent", () => {
  it("renders label and value", () => {
    render(<StatsCardComponent label="Total" value="1,234" />);
    expect(screen.getByText("Total")).toBeInTheDocument();
    expect(screen.getByText("1,234")).toBeInTheDocument();
  });
});

describe("TabBarComponent", () => {
  it("renders tab labels", () => {
    render(
      <TabBarComponent
        tabs={[
          { label: "Tab 1", value: "t1" },
          { label: "Tab 2", value: "t2" },
        ]}
        activeTab="t1"
        onTabChange={() => {}}
      />,
    );
    expect(screen.getByText("Tab 1")).toBeInTheDocument();
    expect(screen.getByText("Tab 2")).toBeInTheDocument();
  });
});

describe("ToolbarComponent", () => {
  it("renders children", () => {
    render(
      <ToolbarComponent>
        <button>Action</button>
      </ToolbarComponent>,
    );
    expect(screen.getByText("Action")).toBeInTheDocument();
  });
});

describe("TopAppBarComponent", () => {
  it("renders title", () => {
    render(<TopAppBarComponent title="My App" />);
    expect(screen.getByText("My App")).toBeInTheDocument();
  });
});
