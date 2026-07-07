# NabhaVerse Studio — Sprint 3: Design System

**Version:** 1.0  
**Sprint:** 3  
**Status:** Architecture Phase — Documentation Only  
**Prerequisite:** Sprint 2 Database Architecture (Approved)  
**Target:** Design system architecture complete before any application feature UI is built

---

## Sprint Goal

Establish a complete, documented, and component-driven design system that serves as the single source of truth for every visual and interactive element in NabhaVerse Studio. No application feature UI begins until this design system is reviewed and approved.

---

## Deliverables

| # | Deliverable | Status |
|---|---|---|
| 1 | Design Tokens | Documented |
| 2 | Color System | Documented |
| 3 | Typography | Documented |
| 4 | Spacing | Documented |
| 5 | Icons | Documented |
| 6 | Themes (Light / Dark) | Documented |
| 7 | Component Architecture | Documented |
| 8 | Button System | Documented |
| 9 | Form System | Documented |
| 10 | Table System | Documented |
| 11 | Navigation | Documented |
| 12 | Layout Grid | Documented |
| 13 | Motion Guidelines | Documented |
| 14 | Accessibility Standards | Documented |
| 15 | Storybook Architecture | Documented |

---

## 1. Design Tokens

### Overview
Design tokens are the atomic, platform-agnostic values that drive every visual decision. They are the contract between design and code. In NabhaVerse Studio, tokens are defined as CSS custom properties in the `:root` scope and consumed via Tailwind CSS utility classes.

### Token Hierarchy

```
Global Tokens (raw values)
  └── Semantic Tokens (contextual aliases)
        └── Component Tokens (component-scoped overrides)
```

### Token Categories

| Category | Examples |
|---|---|
| Color | `--color-brand-500`, `--color-neutral-100` |
| Typography | `--font-size-lg`, `--font-weight-semibold` |
| Spacing | `--spacing-4`, `--spacing-8` |
| Radius | `--radius-sm`, `--radius-lg`, `--radius-full` |
| Shadow | `--shadow-sm`, `--shadow-card`, `--shadow-overlay` |
| Motion | `--duration-fast`, `--easing-standard` |
| Z-Index | `--z-modal`, `--z-tooltip`, `--z-overlay` |
| Breakpoint | `--bp-sm`, `--bp-md`, `--bp-lg`, `--bp-xl` |

### Token File Structure

```
apps/web/src/styles/
├── tokens/
│   ├── colors.css          # Raw color palette
│   ├── semantic-colors.css # Theme-mapped semantic aliases
│   ├── typography.css      # Font size, weight, line-height, letter-spacing
│   ├── spacing.css         # Spacing scale
│   ├── radius.css          # Border radius scale
│   ├── shadows.css         # Box shadow scale
│   ├── motion.css          # Duration and easing
│   └── z-index.css         # Z-index scale
├── globals.css             # Imports all token files
└── themes/
    ├── light.css
    └── dark.css
```

### Token Naming Convention

```
--{category}-{scale|role}-{variant?}

Examples:
  --color-brand-500
  --color-success-foreground
  --font-size-xl
  --spacing-6
  --radius-md
  --shadow-card
  --duration-fast
  --z-modal
```

---

## 2. Color System

### Brand Palette

NabhaVerse Studio uses a deep cosmic palette — dark backgrounds with vibrant accent colors inspired by animation, storytelling, and the night sky.

| Token | Hex | Role |
|---|---|---|
| `--color-brand-50` | `#f0f4ff` | Lightest tint |
| `--color-brand-100` | `#dce8ff` | Surface hover |
| `--color-brand-200` | `#baccff` | Border active |
| `--color-brand-300` | `#8ca8ff` | Icon accent |
| `--color-brand-400` | `#5b7ef8` | Interactive hover |
| `--color-brand-500` | `#3b5bdb` | Primary action |
| `--color-brand-600` | `#2f4bbf` | Primary pressed |
| `--color-brand-700` | `#2339a0` | Dark variant |
| `--color-brand-800` | `#1a2a7c` | Deeper variant |
| `--color-brand-900` | `#111d5e` | Darkest brand |
| `--color-brand-950` | `#080e35` | Near-black brand |

### Neutral Palette

| Token | Hex | Role |
|---|---|---|
| `--color-neutral-0` | `#ffffff` | Pure white |
| `--color-neutral-50` | `#f8fafc` | Canvas light |
| `--color-neutral-100` | `#f1f5f9` | Surface light |
| `--color-neutral-200` | `#e2e8f0` | Border light |
| `--color-neutral-300` | `#cbd5e1` | Border default |
| `--color-neutral-400` | `#94a3b8` | Muted text |
| `--color-neutral-500` | `#64748b` | Secondary text |
| `--color-neutral-600` | `#475569` | Primary text dark |
| `--color-neutral-700` | `#334155` | Surface dark |
| `--color-neutral-800` | `#1e293b` | Background dark |
| `--color-neutral-900` | `#0f172a` | Canvas dark |
| `--color-neutral-950` | `#020617` | Deepest dark |

### Semantic Status Colors

| Token | Hex | Usage |
|---|---|---|
| `--color-success-500` | `#22c55e` | Success state |
| `--color-warning-500` | `#f59e0b` | Warning state |
| `--color-error-500` | `#ef4444` | Error/destructive |
| `--color-info-500` | `#3b82f6` | Informational |

### Semantic Token Mapping (Light Theme)

```css
:root[data-theme="light"] {
  --color-background:         var(--color-neutral-50);
  --color-foreground:         var(--color-neutral-900);
  --color-surface:            var(--color-neutral-0);
  --color-surface-muted:      var(--color-neutral-100);
  --color-border:             var(--color-neutral-200);
  --color-border-strong:      var(--color-neutral-300);
  --color-text-primary:       var(--color-neutral-900);
  --color-text-secondary:     var(--color-neutral-600);
  --color-text-muted:         var(--color-neutral-400);
  --color-text-inverse:       var(--color-neutral-0);
  --color-primary:            var(--color-brand-500);
  --color-primary-hover:      var(--color-brand-600);
  --color-primary-foreground: var(--color-neutral-0);
  --color-destructive:        var(--color-error-500);
  --color-focus-ring:         var(--color-brand-300);
}
```

### Semantic Token Mapping (Dark Theme)

```css
:root[data-theme="dark"] {
  --color-background:         var(--color-neutral-950);
  --color-foreground:         var(--color-neutral-50);
  --color-surface:            var(--color-neutral-900);
  --color-surface-muted:      var(--color-neutral-800);
  --color-border:             var(--color-neutral-700);
  --color-border-strong:      var(--color-neutral-600);
  --color-text-primary:       var(--color-neutral-50);
  --color-text-secondary:     var(--color-neutral-400);
  --color-text-muted:         var(--color-neutral-500);
  --color-text-inverse:       var(--color-neutral-900);
  --color-primary:            var(--color-brand-400);
  --color-primary-hover:      var(--color-brand-300);
  --color-primary-foreground: var(--color-neutral-950);
  --color-destructive:        var(--color-error-500);
  --color-focus-ring:         var(--color-brand-400);
}
```

---

## 3. Typography

### Font Stack

| Role | Font | Fallback |
|---|---|---|
| Display / Headings | `Inter` (variable) | `system-ui`, `sans-serif` |
| Body | `Inter` (variable) | `system-ui`, `sans-serif` |
| Mono / Code | `JetBrains Mono` | `ui-monospace`, `monospace` |

### Type Scale

| Token | Size (rem) | px equivalent | Usage |
|---|---|---|---|
| `--font-size-xs` | `0.75rem` | 12px | Labels, captions |
| `--font-size-sm` | `0.875rem` | 14px | Secondary body, table cells |
| `--font-size-base` | `1rem` | 16px | Primary body |
| `--font-size-lg` | `1.125rem` | 18px | Large body, card text |
| `--font-size-xl` | `1.25rem` | 20px | H5 headings |
| `--font-size-2xl` | `1.5rem` | 24px | H4 headings |
| `--font-size-3xl` | `1.875rem` | 30px | H3 headings |
| `--font-size-4xl` | `2.25rem` | 36px | H2 headings |
| `--font-size-5xl` | `3rem` | 48px | H1 headings |
| `--font-size-6xl` | `3.75rem` | 60px | Display |
| `--font-size-7xl` | `4.5rem` | 72px | Hero |

### Font Weights

| Token | Value | Usage |
|---|---|---|
| `--font-weight-regular` | `400` | Body, secondary |
| `--font-weight-medium` | `500` | Labels, interactive |
| `--font-weight-semibold` | `600` | Subheadings, emphasis |
| `--font-weight-bold` | `700` | Headings, strong |
| `--font-weight-extrabold` | `800` | Display text |

### Line Heights

| Token | Value |
|---|---|
| `--line-height-none` | `1` |
| `--line-height-tight` | `1.25` |
| `--line-height-snug` | `1.375` |
| `--line-height-normal` | `1.5` |
| `--line-height-relaxed` | `1.625` |
| `--line-height-loose` | `2` |

### Semantic Typography Styles

| Style Name | Size | Weight | Line Height | Usage |
|---|---|---|---|---|
| `display-xl` | 7xl | extrabold | tight | Hero sections |
| `display-lg` | 6xl | bold | tight | Page heroes |
| `heading-1` | 5xl | bold | tight | Page titles |
| `heading-2` | 4xl | bold | snug | Section headings |
| `heading-3` | 3xl | semibold | snug | Card headings |
| `heading-4` | 2xl | semibold | normal | Sub-sections |
| `heading-5` | xl | semibold | normal | Widget titles |
| `heading-6` | lg | semibold | normal | List headings |
| `body-lg` | lg | regular | relaxed | Feature body |
| `body-base` | base | regular | normal | Standard body |
| `body-sm` | sm | regular | normal | Secondary body |
| `label-lg` | base | medium | none | Button labels, large |
| `label-base` | sm | medium | none | Button labels |
| `label-sm` | xs | medium | none | Tags, badges |
| `caption` | xs | regular | normal | Captions, metadata |
| `code` | sm | regular | normal | Code, mono |

---

## 4. Spacing

NabhaVerse uses a **4px base unit** (0.25rem) spacing scale, compatible with Tailwind's default.

| Token | Value (rem) | px | Tailwind Class |
|---|---|---|---|
| `--spacing-0` | `0` | 0 | `p-0` |
| `--spacing-1` | `0.25rem` | 4 | `p-1` |
| `--spacing-2` | `0.5rem` | 8 | `p-2` |
| `--spacing-3` | `0.75rem` | 12 | `p-3` |
| `--spacing-4` | `1rem` | 16 | `p-4` |
| `--spacing-5` | `1.25rem` | 20 | `p-5` |
| `--spacing-6` | `1.5rem` | 24 | `p-6` |
| `--spacing-8` | `2rem` | 32 | `p-8` |
| `--spacing-10` | `2.5rem` | 40 | `p-10` |
| `--spacing-12` | `3rem` | 48 | `p-12` |
| `--spacing-16` | `4rem` | 64 | `p-16` |
| `--spacing-20` | `5rem` | 80 | `p-20` |
| `--spacing-24` | `6rem` | 96 | `p-24` |
| `--spacing-32` | `8rem` | 128 | `p-32` |

### Semantic Spacing

| Token | Maps To | Usage |
|---|---|---|
| `--space-component-xs` | `--spacing-1` | Inline icon gap |
| `--space-component-sm` | `--spacing-2` | Input padding y |
| `--space-component-md` | `--spacing-3` | Input padding x |
| `--space-component-lg` | `--spacing-4` | Card inner padding |
| `--space-layout-xs` | `--spacing-4` | Between tightly related elements |
| `--space-layout-sm` | `--spacing-6` | Between components |
| `--space-layout-md` | `--spacing-8` | Between sections |
| `--space-layout-lg` | `--spacing-12` | Between major sections |
| `--space-layout-xl` | `--spacing-16` | Page section gaps |
| `--space-layout-2xl` | `--spacing-24` | Page top/bottom padding |

---

## 5. Icons

### Icon Library

**Primary:** `lucide-react` (MIT licensed, consistent stroke-based style)  
**Secondary:** Custom SVG icons in `packages/ui/src/icons/` for NabhaVerse-specific symbols.

### Icon Sizes

| Size Token | px | Usage |
|---|---|---|
| `icon-xs` | 12px | Inline text icon |
| `icon-sm` | 16px | Button icon, badge |
| `icon-md` | 20px | Default UI icon |
| `icon-lg` | 24px | Navigation icon |
| `icon-xl` | 32px | Feature icon |
| `icon-2xl` | 48px | Empty state illustration |

### Icon Usage Rules

- Icons must always have an accessible `aria-label` or be paired with visible text.
- Decorative icons use `aria-hidden="true"`.
- Icon color inherits from `currentColor` — never hardcode icon colors.
- Icons paired with text maintain a `gap-2` (8px) separation.
- Interactive icons (buttons, links) must have a minimum 44×44px touch target.

### Custom Icon Namespace

```
packages/ui/src/icons/
├── NabhaVerseIcon.tsx    # Logo mark
├── StudioIcon.tsx        # Studio workspace
├── CharacterIcon.tsx     # Character module
├── EpisodeIcon.tsx       # Episode module
├── WorldIcon.tsx         # World/location module
├── AIStudioIcon.tsx      # AI studio module
└── index.ts              # Barrel export
```

---

## 6. Themes (Light / Dark)

### Theme Architecture

Themes are implemented via a `data-theme` attribute on the `<html>` element. CSS custom properties defined in `themes/light.css` and `themes/dark.css` override the semantic token values. Components reference only semantic tokens — never raw palette values — so they respond to theme changes automatically.

### Theme Provider

```
apps/web/src/providers/ThemeProvider.tsx
```

- Reads user preference from `localStorage` key `nabhaverse_theme`.
- Falls back to system preference via `prefers-color-scheme`.
- Default theme: **dark** (to match the cosmic brand aesthetic).
- Provides `useTheme()` hook returning `{ theme, setTheme, toggleTheme }`.
- Applies `data-theme="light"|"dark"` to `document.documentElement`.
- Avoids FOUC (Flash of Unstyled Content) via a blocking inline script in `<head>`.

### Theme Toggle Component

- Located at `packages/ui/src/components/ThemeToggle/`.
- Uses `Sun` / `Moon` icons from `lucide-react`.
- Animated transition using Framer Motion.
- Always visible in the top navigation bar.
- Persists across sessions via `localStorage`.

### shadcn/ui Integration

shadcn/ui components use CSS variables that align directly with NabhaVerse semantic tokens. The `tailwind.config.ts` maps Tailwind color utilities to the same CSS variable names:

```ts
// tailwind.config.ts
theme: {
  extend: {
    colors: {
      background:  'hsl(var(--color-background))',
      foreground:  'hsl(var(--color-foreground))',
      primary:     { DEFAULT: 'hsl(var(--color-primary))', foreground: 'hsl(var(--color-primary-foreground))' },
      muted:       { DEFAULT: 'hsl(var(--color-surface-muted))', foreground: 'hsl(var(--color-text-muted))' },
      border:      'hsl(var(--color-border))',
      // ...
    }
  }
}
```

---

## 7. Component Architecture

### Monorepo Package Structure

```
packages/ui/
├── src/
│   ├── components/          # All shared UI components
│   │   ├── primitives/      # Atoms: Button, Input, Label, Badge, Avatar...
│   │   ├── compounds/       # Molecules: FormField, SearchInput, DataTable...
│   │   ├── patterns/        # Organisms: PageHeader, SideNav, DataGrid...
│   │   └── layouts/         # Structural: AppShell, PageLayout, SplitPane...
│   ├── hooks/               # Shared React hooks
│   ├── icons/               # Custom icons
│   ├── tokens/              # Re-exported token constants (TypeScript)
│   ├── utils/               # cn(), formatDate(), etc.
│   └── index.ts             # Public API barrel export
├── .storybook/
├── package.json
└── tsconfig.json
```

### Component Layers (Atomic Design)

| Layer | Folder | Description | Examples |
|---|---|---|---|
| Primitives (Atoms) | `primitives/` | Single-responsibility, no business logic | Button, Input, Badge, Avatar, Spinner |
| Compounds (Molecules) | `compounds/` | Composed of primitives, light logic | FormField, SearchBar, StatCard, Tabs |
| Patterns (Organisms) | `patterns/` | Stateful, domain-aware compositions | CharacterCard, AssetGrid, EpisodeRow |
| Layouts | `layouts/` | Structural wrappers, responsive grids | AppShell, PageLayout, TwoColumn |

### Component File Structure (per component)

```
ComponentName/
├── ComponentName.tsx         # Component implementation
├── ComponentName.stories.tsx # Storybook stories
├── ComponentName.test.tsx    # Vitest unit tests
├── ComponentName.types.ts    # TypeScript interfaces / prop types
└── index.ts                  # Barrel export
```

### Component Contract Rules

1. Every component exports a named TypeScript interface for its props.
2. All props that accept string values use semantic token references or string literals defined in the component's `.types.ts`.
3. Components never import from application code (`apps/web/src/...`).
4. Components never fetch data — they receive data via props.
5. Side effects (click handlers, form submission) are always passed as props.
6. Every component has at least one Storybook story.
7. Every component has Vitest unit tests for critical rendering states.

---

## 8. Button System

### Variants

| Variant | Usage | Default State | Hover State |
|---|---|---|---|
| `primary` | Main call to action | Brand fill | Darker brand fill |
| `secondary` | Supporting action | Muted fill | Border emphasis |
| `outline` | Ghost action | Border only | Light fill |
| `ghost` | Subtle action | No background | Muted fill |
| `destructive` | Irreversible action | Error fill | Darker error |
| `link` | Navigation in prose | Underline text | No underline |

### Sizes

| Size | Height | Padding X | Font Size | Icon Size |
|---|---|---|---|---|
| `xs` | 28px | 10px | sm | icon-xs |
| `sm` | 32px | 12px | sm | icon-sm |
| `md` | 40px | 16px | base | icon-md |
| `lg` | 48px | 20px | lg | icon-md |
| `xl` | 56px | 24px | xl | icon-lg |

### States

- `default` — base appearance
- `hover` — cursor:pointer + subtle color shift
- `focus-visible` — 2px focus ring using `--color-focus-ring` with 2px offset
- `active` / `pressed` — scale(0.98) + darker fill
- `disabled` — 40% opacity, cursor:not-allowed, pointer-events:none
- `loading` — spinner replaces or prefixes icon, click disabled

### Icon Buttons

- Icon-only buttons must have an `aria-label`.
- Use `size="icon"` variant: width equals height (square).
- Available sizes: `sm` (32px), `md` (40px), `lg` (48px).

### Button Group

- `ButtonGroup` component wraps multiple buttons in a segmented control layout.
- Borders collapse between adjacent buttons.
- First and last buttons receive appropriate border-radius.

---

## 9. Form System

### Form Architecture

Forms in NabhaVerse use:
- **React Hook Form** — form state management and validation orchestration
- **Zod** — schema-based validation (shared between client and server)
- **`packages/ui` Form primitives** — rendering layer

### Form Component Hierarchy

```
<Form>                    ← RHF FormProvider wrapper
  <FormField>             ← Connects label, input, error message
    <FormLabel />         ← Accessible <label> with optional required indicator
    <FormControl>         ← Renders the input element
      <Input />           ← or Select, Textarea, Checkbox, etc.
    </FormControl>
    <FormDescription />   ← Optional helper text
    <FormMessage />       ← Validation error message
  </FormField>
</Form>
```

### Input Variants

| Component | Usage |
|---|---|
| `Input` | Single-line text, email, number, password, search |
| `Textarea` | Multi-line text |
| `Select` | Single-choice dropdown |
| `MultiSelect` | Multi-choice with tags |
| `Combobox` | Search + select (autocomplete) |
| `Checkbox` | Binary toggle |
| `RadioGroup` | Exclusive choice from list |
| `Switch` | On/off toggle |
| `Slider` | Range value |
| `DatePicker` | Date selection |
| `DateRangePicker` | Date range selection |
| `FilePicker` | File upload with drag-and-drop |
| `ColorPicker` | Hex/HSL color selection |
| `TagInput` | Free-form tag entry |
| `RichTextEditor` | Prose content (TipTap) |

### Input States

- `default` — neutral border
- `hover` — border color intensifies
- `focus` — brand-colored focus ring + border
- `filled` — same as default (no special fill)
- `error` — error-colored border + error message below
- `disabled` — muted appearance, no interaction
- `read-only` — no border, cursor:default

### Form Layout Patterns

| Pattern | Description |
|---|---|
| `StackedForm` | Label above input, full-width — most common |
| `InlineForm` | Label left of input — dashboard filters |
| `GridForm` | CSS Grid for multi-column form sections |
| `WizardForm` | Multi-step form with progress indicator |
| `ModalForm` | Form inside a Dialog component |
| `InlineEditForm` | Click-to-edit pattern on data display |

---

## 10. Table System

### Component Hierarchy

```
<DataTable>
  <DataTableToolbar>     ← Search, filters, column visibility, bulk actions
  <DataTableHeader>      ← Column headers with sort indicators
  <DataTableBody>
    <DataTableRow>
      <DataTableCell />
    </DataTableRow>
  </DataTableBody>
  <DataTableFooter>      ← Pagination controls
</DataTable>
```

### Column Definition

```ts
interface ColumnDef<TData> {
  id: string;
  header: string | ReactNode;
  accessorKey?: keyof TData;
  cell?: (info: CellContext<TData>) => ReactNode;
  enableSorting?: boolean;
  enableFiltering?: boolean;
  enableHiding?: boolean;
  meta?: {
    align?: 'left' | 'center' | 'right';
    width?: string;
    sticky?: 'left' | 'right';
  };
}
```

### Table Features

| Feature | Description |
|---|---|
| Sorting | Client-side and server-side, multi-column |
| Filtering | Per-column and global text search |
| Pagination | Server-side preferred; page size 10/25/50/100 |
| Row selection | Checkbox multi-select with bulk actions |
| Column visibility | User-controlled show/hide |
| Sticky columns | First/last column freeze |
| Row expand | Expandable detail panel per row |
| Loading state | Skeleton rows while fetching |
| Empty state | Contextual illustration + CTA |
| Virtual scrolling | For 1000+ row tables (TanStack Virtual) |

### Row Actions

Every data table row exposes:
- Inline action icons (max 3, overflow to `DropdownMenu`)
- Right-click context menu for power users
- Keyboard: `Enter` to open detail, `Space` to select

---

## 11. Navigation

### Navigation Architecture

```
AppShell
├── TopNav                ← Logo, global search, theme toggle, user menu
├── SideNav               ← Module navigation, collapsible
│   ├── NavSection        ← Grouped links with section header
│   │   └── NavItem       ← Icon + label, active indicator
│   └── NavFooter         ← Settings, help, user avatar
└── ContentArea
    ├── PageHeader        ← Title, breadcrumb, page-level actions
    └── PageContent       ← Main content region
```

### SideNav Behaviour

| State | Description |
|---|---|
| Expanded | 240px width, icon + label visible |
| Collapsed | 56px width, icon only (tooltip on hover) |
| Mobile | Hidden, triggered by hamburger, overlays as drawer |
| Persistent | State stored in `localStorage` |

### Navigation Items (MVP Modules)

| Icon | Label | Route |
|---|---|---|
| `LayoutDashboard` | Dashboard | `/` |
| `Users` | Characters | `/characters` |
| `Film` | Episodes | `/episodes` |
| `Globe` | World | `/world` |
| `FolderOpen` | Assets | `/assets` |
| `Wand2` | AI Studio | `/ai-studio` |
| `Settings` | Settings | `/settings` |

### Breadcrumbs

- Every page beyond the root level shows a breadcrumb trail.
- Breadcrumb items are links except the current page (plain text).
- Long breadcrumbs truncate from the middle, showing root and current.

### Top Navigation Contents

- Left: NabhaVerse logo + studio switcher
- Centre: Global command palette trigger (`Cmd+K`)
- Right: Notifications bell, theme toggle, user avatar + dropdown

---

## 12. Layout Grid

### Breakpoints

| Token | Min Width | Usage |
|---|---|---|
| `xs` | 0px | Mobile portrait |
| `sm` | 640px | Mobile landscape |
| `md` | 768px | Tablet |
| `lg` | 1024px | Laptop |
| `xl` | 1280px | Desktop |
| `2xl` | 1536px | Wide desktop |

### Page Layout

```
┌─────────────────────────────────────────────────────┐
│                     TopNav (64px)                   │
├──────────┬──────────────────────────────────────────┤
│ SideNav  │              ContentArea                 │
│ (240px)  │  ┌────────────────────────────────────┐  │
│          │  │  PageHeader (title + actions)      │  │
│          │  ├────────────────────────────────────┤  │
│          │  │                                    │  │
│          │  │  PageContent (max-width: 1440px)   │  │
│          │  │                                    │  │
│          │  └────────────────────────────────────┘  │
└──────────┴──────────────────────────────────────────┘
```

### Grid System

- **12-column grid** with configurable gap.
- Responsive column spans using Tailwind `grid-cols-*` utilities.
- Content area max-width: `1440px`, centered with `mx-auto`.
- Standard content padding: `px-6 py-6` (24px each side).

### Common Layout Patterns

| Pattern | Description | Columns |
|---|---|---|
| Full width | Single column spanning full content area | 12/12 |
| Two-thirds / One-third | Primary content + sidebar | 8 / 4 |
| Half / Half | Equal split panels | 6 / 6 |
| Three column | Cards or feature grid | 4 / 4 / 4 |
| Four column | Stat cards, icon grid | 3 each |
| Masonry | Variable height cards (CSS columns) | Auto |

---

## 13. Motion Guidelines

### Motion Philosophy

Motion in NabhaVerse Studio serves communication, not decoration. Every animation should:
1. Reinforce spatial relationships (items slide in from where they belong)
2. Confirm user intent (button press feedback)
3. Reduce perceived latency (skeletons, progress indicators)
4. Never block interaction

### Duration Scale

| Token | Duration | Usage |
|---|---|---|
| `--duration-instant` | `0ms` | No animation (reduced-motion) |
| `--duration-fast` | `100ms` | Micro-interactions (hover fills, focus rings) |
| `--duration-normal` | `200ms` | Standard transitions (open/close, fade) |
| `--duration-moderate` | `300ms` | Panel slides, modal open |
| `--duration-slow` | `500ms` | Page transitions, complex reveals |
| `--duration-deliberate` | `700ms` | Onboarding, celebration states |

### Easing Functions

| Token | CSS Value | Usage |
|---|---|---|
| `--easing-linear` | `linear` | Progress bars |
| `--easing-standard` | `cubic-bezier(0.2, 0, 0, 1)` | Most UI transitions |
| `--easing-decelerate` | `cubic-bezier(0, 0, 0.2, 1)` | Elements entering screen |
| `--easing-accelerate` | `cubic-bezier(0.4, 0, 1, 1)` | Elements leaving screen |
| `--easing-spring` | Framer Motion `spring` | Playful, bouncy interactions |

### Animation Catalogue

| Pattern | Duration | Easing | Trigger |
|---|---|---|---|
| Fade in | normal | decelerate | Mount |
| Fade out | fast | accelerate | Unmount |
| Slide in from right | moderate | decelerate | Page navigation |
| Slide out to left | moderate | accelerate | Page navigation |
| Scale in (modal) | moderate | spring | Open |
| Scale out (modal) | normal | accelerate | Close |
| Skeleton shimmer | 1500ms | linear, loop | Loading |
| Button press | fast | standard | Click |
| Success check | deliberate | spring | Completion |
| Toast enter | normal | decelerate | Mount |
| Toast exit | normal | accelerate | Unmount |

### `prefers-reduced-motion`

All animations must respect the `prefers-reduced-motion: reduce` media query. When set, transitions use `--duration-instant` and position changes are removed (opacity-only transitions allowed at max 150ms).

```ts
// In Framer Motion
const motionProps = prefersReducedMotion
  ? {}
  : { initial: { opacity: 0 }, animate: { opacity: 1 }, transition: { duration: 0.2 } };
```

---

## 14. Accessibility Standards

### Target Compliance

**WCAG 2.1 Level AA** across all components and pages.

### Colour Contrast Requirements

| Context | Minimum Ratio |
|---|---|
| Normal text (< 18pt) | 4.5:1 |
| Large text (≥ 18pt or bold ≥ 14pt) | 3:1 |
| UI components and graphical objects | 3:1 |
| Focus indicator | 3:1 against adjacent colours |

All semantic token pairings (background/foreground, primary/primary-foreground, etc.) must be validated to meet or exceed these ratios in both light and dark themes.

### Keyboard Navigation

- All interactive elements reachable via `Tab`.
- Logical focus order matches visual reading order.
- `Escape` closes modals, drawers, dropdowns.
- Arrow keys navigate within menus, tabs, radio groups.
- `Enter` and `Space` activate buttons and links.
- Custom keyboard shortcuts documented and conflict-free.

### ARIA Requirements

| Component | Required ARIA |
|---|---|
| Modal | `role="dialog"`, `aria-modal="true"`, `aria-labelledby` |
| Navigation | `<nav>` with `aria-label` |
| Form fields | `aria-describedby` linking to description/error |
| Loading states | `aria-live="polite"` or `aria-busy="true"` |
| Tables | `<caption>` or `aria-label`; `scope` on headers |
| Icons (decorative) | `aria-hidden="true"` |
| Icons (informative) | `aria-label` |
| Status messages | `role="status"` or `role="alert"` |
| Tooltip | `role="tooltip"` with `aria-describedby` on trigger |

### Focus Management

- Modals trap focus within the dialog while open.
- Focus returns to the trigger element on modal close.
- Toasts and alerts do not steal focus.
- Skip navigation link at top of page: "Skip to main content".

### Screen Reader Support

- Semantic HTML used at all times (`<main>`, `<nav>`, `<header>`, `<aside>`, `<section>`).
- `<h1>`–`<h6>` headings follow strict hierarchy per page.
- Dynamic content changes announced via `aria-live` regions.
- Images require meaningful `alt` text; decorative images use `alt=""`.

### Testing Requirements

- Automated: `axe-core` integrated into Vitest/Playwright.
- Manual: Keyboard-only walkthrough per feature.
- Screen reader: VoiceOver (macOS) + NVDA (Windows) spot-check before merge.

---

## 15. Storybook Architecture

### Purpose

Storybook serves as:
1. The living component library documentation
2. The visual regression testing baseline
3. The design-developer collaboration tool
4. The accessibility audit environment

### Package Location

```
packages/ui/
├── .storybook/
│   ├── main.ts            # Storybook config, addons, stories glob
│   ├── preview.ts         # Global decorators, theme provider, CSS imports
│   └── manager.ts         # Storybook UI customization
```

### Story File Convention

```ts
// ComponentName.stories.tsx
import type { Meta, StoryObj } from '@storybook/react';
import { ComponentName } from './ComponentName';

const meta = {
  title: 'Primitives/ComponentName',  // Category/ComponentName
  component: ComponentName,
  tags: ['autodocs'],
  argTypes: { /* ... */ },
} satisfies Meta<typeof ComponentName>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { args: { /* default props */ } };
export const Loading: Story = { args: { loading: true } };
export const Disabled: Story = { args: { disabled: true } };
```

### Story Categories

| Category | Description |
|---|---|
| `Tokens` | Visual documentation of all design tokens |
| `Primitives` | Atoms: Button, Input, Badge, Avatar... |
| `Compounds` | Molecules: FormField, SearchBar, StatCard... |
| `Patterns` | Organisms: DataTable, CharacterCard... |
| `Layouts` | Structural: AppShell, PageLayout... |
| `Icons` | All icons in the icon library |
| `Themes` | Light and dark theme previews |
| `Accessibility` | A11y showcase with axe audit results |

### Required Addons

| Addon | Purpose |
|---|---|
| `@storybook/addon-docs` | Auto-generated docs from JSDoc + ArgTypes |
| `@storybook/addon-a11y` | axe-core accessibility audit per story |
| `@storybook/addon-themes` | Live theme switching (light/dark) |
| `@storybook/addon-viewport` | Responsive breakpoint preview |
| `@storybook/addon-interactions` | Play function interaction testing |
| `@chromatic-com/storybook` | Visual regression CI integration |

### Required Stories Per Component

Every component in `packages/ui` must have stories covering:
- `Default` — basic working state
- `Loading` — if the component has a loading state
- `Disabled` — if the component can be disabled
- `Error` — if the component has an error state
- `Empty` — if the component renders empty data
- `DarkTheme` — explicit dark theme rendering
- `Mobile` — smallest supported viewport

---

## Implementation Notes

### Package Initialisation Order

1. Install and configure Tailwind CSS with the token-aligned config
2. Set up `packages/ui` with Storybook
3. Implement and document tokens (CSS variables + TypeScript constants)
4. Implement primitives (Button, Input, Badge, Avatar, Spinner)
5. Implement compounds (FormField, DataTable skeleton, NavItem)
6. Implement layouts (AppShell, PageLayout)
7. Write Storybook stories for all components
8. Run accessibility audit on all stories
9. Submit for design review

### Technology Versions

| Tool | Version |
|---|---|
| Next.js | 16.x |
| React | 19.x |
| TypeScript | 5.x (strict) |
| Tailwind CSS | 4.x |
| shadcn/ui | Latest |
| Framer Motion | 11.x |
| Storybook | 8.x |
| lucide-react | Latest |
| React Hook Form | 7.x |
| Zod | 3.x |

---

## Review Checklist

Before Sprint 3 is marked complete and Sprint 4 (Authentication) begins, all of the following must be confirmed:

- [ ] All design tokens defined and documented
- [ ] Color system covers brand, neutral, semantic status, and both themes
- [ ] Typography scale covers all usage levels
- [ ] Spacing scale aligned with Tailwind defaults
- [ ] Icon library chosen and custom icons created
- [ ] Light and dark themes fully mapped via CSS custom properties
- [ ] Component architecture folder structure established
- [ ] Button system documented (all variants, sizes, states)
- [ ] Form system documented (all input types, states, layout patterns)
- [ ] Table system documented (all features)
- [ ] Navigation structure documented with all MVP routes
- [ ] Layout grid documented (breakpoints, columns, max-widths)
- [ ] Motion guidelines documented (durations, easings, `prefers-reduced-motion`)
- [ ] Accessibility standards documented (WCAG 2.1 AA, keyboard, ARIA, screen reader)
- [ ] Storybook architecture documented (addons, story categories, story requirements)
- [ ] Chief Architect review complete
- [ ] Approved to begin Sprint 4
