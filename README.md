# @rodrigo-barraza/components

Shared React component library.

## Installation

```bash
npm install @rodrigo-barraza/components
```

## Setup

Import the component styles in your app's root layout or entry point:

```js
import "@rodrigo-barraza/components/styles";
```

## Components

### ButtonComponent

A standardized, themeable button with multiple variants, sizes, and states.

```jsx
import { ButtonComponent } from "@rodrigo-barraza/components";
import { Send } from "lucide-react";

<ButtonComponent variant="primary" size="md" icon={Send}>
  Send Message
</ButtonComponent>
```

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `variant` | `"primary"` \| `"secondary"` \| `"disabled"` \| `"destructive"` \| `"creative"` \| `"submit"` | `"primary"` | Visual style variant |
| `size` | `"xs"` \| `"sm"` \| `"md"` \| `"lg"` | `"md"` | Button size |
| `icon` | `React.ComponentType` | — | Lucide-compatible icon component |
| `loading` | `boolean` | `false` | Shows spinner, disables interaction |
| `disabled` | `boolean` | `false` | Disables the button |
| `fullWidth` | `boolean` | `false` | Stretches to 100% width |
| `isGenerating` | `boolean` | `false` | Submit variant: conic rainbow spinner |
| `className` | `string` | `""` | Additional CSS classes |
| `ref` | `React.Ref` | — | Forwarded ref |

#### Required CSS Variables

The button relies on CSS custom properties from your app's global stylesheet:

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

## License

MIT
