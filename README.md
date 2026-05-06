# @rodrigo-barraza/components

Shared React component library for the Sun ecosystem. Provides a standardized set of UI primitives, layout components, hooks, and providers used across all client applications (`prism-client`, `portal-client`, `ledger-client`, `lights-client`, `buzzer-client`, `messages-client`, `clock-crew-client`).

## Installation

```bash
npm install @rodrigo-barraza/components
```

**Peer dependencies:** `react >= 18.0.0`, `react-dom >= 18.0.0`, `lucide-react >= 0.300.0`

## Setup

Import the component styles in your app's root layout or entry point:

```js
import "@rodrigo-barraza/components/styles";
```

Wrap your app with the providers:

```jsx
import { ThemeProvider, ComponentsProvider } from "@rodrigo-barraza/components";

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

## Components (30)

### Layout

| Component | Description |
|-----------|-------------|
| `NavigationSidebarComponent` | Collapsible left nav with links, logo, theme toggle, and `localStorage` persistence |
| `PageHeaderComponent` | Top-of-page header bar with title, breadcrumbs, and actions |
| `CardComponent` | General-purpose content card container |
| `ModalComponent` | Dialog overlay with backdrop, focus trap, and Escape-to-close |
| `CollapsibleBlockComponent` | Expandable/collapsible content section |
| `EmptyStateComponent` | Placeholder UI for empty data — icon, title, description, optional CTA |

### Form Controls

| Component | Description |
|-----------|-------------|
| `ButtonComponent` | Themeable button with variants (`primary`, `secondary`, `destructive`, `creative`, `submit`, `disabled`), sizes, loading spinner, and icon support |
| `IconButtonComponent` | Compact icon-only button |
| `InputComponent` | Standard text input with label and validation |
| `TextAreaComponent` | Multi-line text input |
| `SelectComponent` | Dropdown select menu |
| `CheckboxComponent` | Styled checkbox with label |
| `ToggleComponent` | On/off toggle switch |
| `SliderComponent` | Range slider control |
| `SearchInputComponent` | Input with search icon and debounced change handling |
| `DatePickerComponent` | Date range selector with presets |
| `FormGroupComponent` | Label + input layout wrapper (also exports `formGroupStyles`) |

### Data Display

| Component | Description |
|-----------|-------------|
| `TableComponent` | Sortable, paginated data table with column definitions |
| `PaginationComponent` | Page navigation controls |
| `TabBarComponent` | Horizontal tab strip (also exports `tabBarStyles`) |
| `BadgeComponent` | Color-coded label pill |
| `CountBadgeComponent` | Numeric badge indicator |
| `StatsCardComponent` | Animated stat card — icon, value, label, trend indicator |
| `ResponseTimeBadgeComponent` | Color-coded latency badge (green < 50ms, yellow < 100ms, red > 100ms) |
| `VisibilityBadgeComponent` | Public/private visibility indicator |
| `LoadingStateComponent` | Skeleton/spinner loading placeholder |

### Feedback

| Component | Description |
|-----------|-------------|
| `ToastComponent` | Toast notification overlay with semantic icons and animated entries (also exports `useToast` hook) |
| `TooltipComponent` | Hover/focus tooltip with configurable placement |
| `CopyButtonComponent` | Copy-to-clipboard button with success feedback |
| `CloseButtonComponent` | Standardized close/dismiss button |

### Specialized

| Component | Description |
|-----------|-------------|
| `DiscordChatComponent` | Discord-style message feed renderer |

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

## License

MIT
