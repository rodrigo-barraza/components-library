# @rodrigo-barraza/components-library

Shared React component library for the service ecosystem. Provides a standardized set of UI primitives, layout components, hooks, and providers used across all client applications (`prism-client`, `portal-client`, `ledger-client`, `lights-client`, `messages-client`, `clock-crew-client`).

## Installation

```bash
npm install @rodrigo-barraza/components-library
```

**Peer dependencies:** `react >= 18.0.0`, `react-dom >= 18.0.0`, `lucide-react >= 0.300.0`, `luxon >= 3.0.0`

## Setup

Import the component styles in your app's root layout or entry point:

```js
import "@rodrigo-barraza/components-library/base.css";
```

Wrap your app with the providers:

```jsx
import { ThemeProvider, ComponentsProvider } from "@rodrigo-barraza/components-library";

function RootLayout({ children }) {
  return (
    <ThemeProvider storageKey="portal:theme" defaultTheme="dark">
      <ComponentsProvider sound>
        {children}
      </ComponentsProvider>
    </ThemeProvider>
  );
}
```

## Directory Structure

```
components-library/
├── src/
│   ├── components/
│   ├── hooks/
│   ├── services/
│   └── utils/
├── tests/
```

## Components (72)

The library provides a comprehensive set of premium, high-performance UI components, built from the ground up for optimal responsiveness, styling consistency, accessibility, and modern aesthetics.

### Layout (15)

| Component | Description |
|-----------|-------------|
| `NavigationSidebarComponent` | Collapsible left navigation bar with links, logo, theme toggle, and persistent `localStorage` state. |
| `LayoutHeaderComponent` | Dynamic page-header container wrapping titles, page actions, and customizable widgets. |
| `MobileHeaderComponent` | Compact, responsive header layout with slide-out sidebar triggers for mobile viewports. |
| `TopAppBarComponent` | Fixed or sticky top-of-screen header container for primary navigation options. |
| `BottomAppBarComponent` | Sticky bottom navigation bar for quick mobile shortcuts and contextual actions. |
| `NavigationDrawerComponent` | Full-height off-canvas slide-out menu drawer providing navigation options on smaller screens. |
| `NavigationRailComponent` | Minimalist vertical navigation side-rail showing clean icon-based shortcuts. |
| `PageHeaderComponent` | Standard page header displaying nested breadcrumbs, page title, and primary CTA buttons. |
| `PageLayoutComponent` | Unified layout template coordinating sidebars, headers, and standard content sections. |
| `CardComponent` | Versatile, themeable layout card serving as clean content container. |
| `ModalComponent` | Accessible dialog modal overlay with custom backdrop, focus-trap, and Escape-to-close behavior. |
| `DrawerComponent` | General-purpose slide-out panel container matching layout drawers. |
| `DividerComponent` | Flexible horizontal/vertical dividing line supporting custom margin styles. |
| `CollapsibleBlockComponent` | Animated expandable/collapsible accordion container block. |
| `EmptyStateComponent` | Placeholder UI for blank views complete with custom icon, CTA, title, and descriptions. |

### Form Controls (17)

| Component | Description |
|-----------|-------------|
| `ButtonComponent` | Color-tailored button with distinct presets (`primary`, `secondary`, `destructive`, `creative`, `submit`), dynamic sizing, active-press animations, and loading states. |
| `IconButtonComponent` | Compact circular button enclosing standalone custom SVG icons. |
| `SplitButtonComponent` | Dual-function button binding a main action to the left, and a contextual option dropdown to the right. |
| `InputComponent` | Accessible single-line input field supporting custom types and reactive states. |
| `TextFieldComponent` | High-premium single-line input complete with dynamic floating labels, validation states, helper text, and icons. |
| `TextAreaComponent` | Resizable multi-line text input featuring auto-height adjustments and standard labels. |
| `SelectComponent` | Accessible drop-down selector wrapper styling native system options. |
| `MultiSelectComponent` | Modern multi-value selector featuring tag bubble chips, value searches, and interactive drop-downs. |
| `CheckboxComponent` | Fully styled checkbox element with dynamic state ticks and helper labels. |
| `RadioComponent` | Standardized custom radio selector buttons for single-choice option sets. |
| `SwitchComponent` | Modern iOS-styled binary toggling slider switch. |
| `ToggleComponent` | Accessible state switch button matching switch controls. |
| `SliderComponent` | Fluid range slider control for fine-grained numeric value inputs. |
| `SearchInputComponent` | Debounced text search box complete with animated leading search icon, loading spinners, and quick clear-action button. |
| `DatePickerComponent` | Contextual date and calendar range picker with smart preset shortcuts. |
| `SegmentedControlComponent` | Sleek tabbed choice selectors displaying active slider slides behind options. |
| `FormGroupComponent` | Unified helper wrapper tying labels, inputs, description text, and error bounds together. |

### Data Display (16)

| Component | Description |
|-----------|-------------|
| `TableComponent` | High-performance sortable and paginated tabular data grid displaying columns dynamically. |
| `PaginationComponent` | Premium page navigator with direct page jumping. |
| `TabBarComponent` | Modern horizontal sub-navigation tabs. |
| `BadgeComponent` | Rounded color-coded pill tags showing semantic category names. |
| `CountBadgeComponent` | Floating circular counter badge designed to show alert/message updates above icons. |
| `ChipComponent` | Small interactive tags supporting click actions and quick delete icons. |
| `AvatarComponent` | Spherical user or model profile images complete with initials fallbacks and status dots. |
| `StatsCardComponent` | Micro-animated KPI statistics card showing current values, trend directions, and contextual icons. |
| `ResponseTimeBadgeComponent` | Latency indicator color-coded based on response limits (green < 50ms, yellow < 100ms, red > 100ms). |
| `VisibilityBadgeComponent` | Encrypted status pill rendering public/private visibility states. |
| `StatusDotComponent` | Tiny reactive color dot indicating live/offline state. |
| `LoadingIndicatorComponent` | Clean animated loading ring. |
| `LoadingStateComponent` | Consolidated backdrop spinner block for async views. |
| `SkeletonComponent` | Sleek shimmer-animated content placeholders supporting circles, text lines, and rounded rectangular blocks. |
| `ProgressBarComponent` | Clean linear progress bar with GPU-optimized width animations. |
| `ChartLineComponent` | Lightweight SVG line chart for inline stats preview. |

### Feedback & Errors (8)

| Component | Description |
|-----------|-------------|
| `ToastComponent` | Non-obtrusive overlay message notifications with sliding entries and dynamic timers. |
| `TooltipComponent` | Micro-delayed hover card explaining icon functions. |
| `SnackbarComponent` | Temporary floating alerts anchored at the page bottom. |
| `DialogComponent` | Structured confirmation dialogue prompt requesting user approvals. |
| `CopyButtonComponent` | Action button triggering direct clipboard copy with active feedback states. |
| `CloseButtonComponent` | Reusable standard close button for overlay alerts. |
| `ErrorBoundaryComponent` | React error boundary capturing nested component crashes. |
| `ErrorFallbackComponent` | Beautiful fallback screen detailing app crashes and offering quick reload actions. |

### Specialized / Chat & Themes (16)

| Component | Description |
|-----------|-------------|
| `ChatComponent` | Rich conversational stream container holding interactive inputs and dynamic bubbles. |
| `ChatInputComponent` | Responsive multiline prompt composer equipped with upload actions and send handlers. |
| `ChatMessageComponent` | Render blocks parsing Markdown contents, code blocks, syntax highlighting, and collapsible reasoning states. |
| `ChatPanelComponent` | Drawer workspace container showing prompt settings and system details. |
| `ChatLauncherComponent` | Circular floating action launcher presenting quick overlay chat prompts. |
| `DiscordChatComponent` | Pixel-perfect Discord channel mockup stream showing message lists and avatar details. |
| `SessionTrackerComponent` | Execution progress flow tracing agent actions. |
| `ToolCardComponent` | Detailed cards visualizing agent tool metadata, call counters, description text, and toggles. |
| `ThemePickerComponent` | Theme selection grids displaying preset choices. |
| `ThemeToggleButtonComponent` | Quick theme toggler button switching active presets. |
| `CustomThemeBootComponent` | Lightweight component executing initial theme configurations. |

## Providers (2)

| Provider | Hook | Description |
|----------|------|-------------|
| `ThemeProvider` | `useTheme()` | Centralized theme management with SSR-safe `localStorage` persistence. Sets `data-theme` on `<html>`. Supports `dark`, `light`, and `tropical` themes. Configurable `storageKey`, `defaultTheme`, and `attribute`. |
| `ComponentsProvider` | `useComponents()` | Library-wide config — enables optional features like procedural audio feedback via `SoundService` |

### ThemeProvider Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `storageKey` | `string` | `"app:theme"` | localStorage key for persistence |
| `defaultTheme` | `string` | `"dark"` | Fallback when nothing is stored |
| `themes` | `string[]` | `["dark", "light", "tropical"]` | Ordered list of valid theme names |
| `attribute` | `string` | `"data-theme"` | HTML attribute set on `<html>` |

### useTheme() Returns

| Field | Type | Description |
|-------|------|-------------|
| `theme` | `string` | Current active theme |
| `themes` | `string[]` | Available theme names |
| `mounted` | `boolean` | `true` after client-side hydration |
| `toggleTheme` | `() => void` | Cycle to next theme in list |
| `setTheme` | `(theme: string) => void` | Set theme directly |

## Hooks (11)

| Hook | Description |
|------|-------------|
| `useLocalStorage` | Persistent state backed by `localStorage` with SSR safety |
| `usePolling` | Periodic data fetching with configurable interval |
| `useFetch` | Declarative async data fetching with loading/error states |
| `useCrud` | Full CRUD operations with optimistic updates |
| `useDateRange` | Date range state management with preset support |
| `useSetToggle` | Set-based toggle state (add/remove/has) |
| `useDebounce` | Debounced value with configurable delay |
| `useClipboard` | Copy-to-clipboard with success/error feedback |
| `useClickOutside` | Detect clicks outside a ref target |
| `useKeyboard` | Keyboard shortcut binding |
| `useMediaQuery` | Reactive CSS media query matching |

## Services

| Service | Description |
|---------|-------------|
| `SoundService` | Procedural audio feedback engine using Web Audio API — generates spatial UI sounds for hover, click, toggle, and notification events |

## Utilities

| Export | Description |
|--------|-------------|
| `DATE_PRESETS` | Predefined date range options (Today, 7d, 30d, 90d, etc.) |
| `fmtDate` | Date formatting helper |
| `daysAgo` | Relative date calculation |
| `parseDateValue` | Parse date string into Date object |
| `formatDateDisplay` | Human-readable date display |
| `getActiveDatePreset` | Determine which preset matches a date range |

## Required CSS Variables

Components rely on CSS custom properties from your app's global stylesheet:

```css
:root {
  /* Colors */
  --accent-color: #6366f1;
  --accent-hover: #4f46e5;
  --accent-subtle: rgba(99, 102, 241, 0.1);
  --bg-primary: #0a0a0f;
  --bg-secondary: #13141c;
  --text-primary: #f8f8f8;
  --text-secondary: #8e95ae;
  --border-color: rgba(255, 255, 255, 0.06);
  --danger: #ef4444;
  --danger-subtle: rgba(239, 68, 68, 0.1);

  /* Layout */
  --border-radius-sm: 2px;

  /* Motion */
  --transition-fast: 150ms cubic-bezier(0.4, 0, 0.2, 1);

  /* Shadows */
  --shadow-glow: 0 0 20px rgba(99, 102, 241, 0.15);

  /* Prism (for submit generating state) */
  --prism-conic: conic-gradient(
    #ff0000, #ff8800, #ffff00, #00ff88,
    #0088ff, #8800ff, #ff0088, #ff0000
  );
}
```

## Testing

```bash
npm test           # Run all tests (Vitest + React Testing Library)
npm run test:watch # Watch mode
npm run test:ui    # Vitest UI
```

## Scripts

```bash
npm run lint            # Run ESLint
npm run format          # Format with Prettier
npm run format:check    # Check formatting
npm test                # Run tests (Vitest)
npm run test:watch      # Run tests in watch mode
npm run test:ui         # Run tests with Vitest UI
npm run prepublishOnly  # Run tests before publishing
```

## License

MIT
