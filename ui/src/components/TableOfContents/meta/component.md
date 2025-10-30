---
title: TableOfContents
category: navigation
description: Dynamic table of contents component with scroll-spy, deep-linking, variants, and customizable indentation.
package: platform-blocks
since: 1.0.0
---

# TableOfContents

The `TableOfContents` component automatically discovers headings on the page (h1–h6) and renders a navigable outline with active section tracking. It supports scroll‑spy highlighting, deep-link copying, custom initial data (SSR / virtual docs), indentation control, appearance variants, and external active state notifications.

## Features

- **Auto Discovery**: Scans the DOM (web) for heading elements via a configurable selector.
- **Scroll Spy**: Observes headings entering/leaving the viewport to update the active item.
- **Deep Linking**: Each entry can copy / update the URL hash for direct linking.
- **Variants**: `none`, `outline`, `ghost`, `filled` with optional `autoContrast` for legible text.
- **Custom Data**: Provide `initialData` to render structure before content mounts or in non-web contexts.
- **Indent Control**: Tune hierarchy spacing using `minDepthToOffset` & `depthOffset`.
- **Render Overrides**: `getControlProps` hook to inject props / replace children per item.
- **Reinitialization**: Imperative `reinitializeRef` for dynamic content (e.g., lazy-loaded markdown).
- **Accessible**: Buttons for entries, clear focus targets, and semantic navigation patterns.

## When to Use

Use a table of contents for long-form documentation, knowledge base articles, API references, design guidelines, or any content page where rapid intra-page navigation improves UX.

## Import

```tsx
import { TableOfContents } from '@platform-blocks/ui';
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `variant` | `'filled' | 'outline' | 'ghost' | 'none'` | `none` | Visual style skin. |
| `color` | `string` | theme primary | Base color for `filled` / `outline` variants. |
| `size` | `SizeValue` | `sm` | Text size mapping (`xs`..`xl`). |
| `radius` | radius token / number | theme md | Corner rounding. |
| `scrollSpyOptions` | `ScrollSpyOptions` | — | Customize selector, rootMargin, derive id/value/depth. |
| `getControlProps` | `(ctx) => object` | — | Inject/override Pressable props per item. Return `{ children }` to replace label. |
| `initialData` | `TocItem[]` | `[]` | Pre-seed items (SSR or non-web). |
| `minDepthToOffset` | `number` | `1` | Depth at which left indentation begins. |
| `depthOffset` | `number` | `20` | Pixels of indent per depth step. |
| `reinitializeRef` | `RefObject<() => void>` | — | Exposes a function to rescan headings. |
| `autoContrast` | `boolean` | `false` | Adjust text color automatically for filled backgrounds. |
| `onActiveChange` | `(id: string | null, item?: TocItem) => void` | — | Fired when active heading changes. |

## Basic Usage

```tsx
<TableOfContents variant="outline" radius="sm" />
```

## With Custom Initial Data

```tsx
const initial = [
  { id: 'intro', value: 'Introduction', depth: 1 },
  { id: 'install', value: 'Installation', depth: 2 },
  { id: 'api', value: 'API', depth: 1 },
];

<TableOfContents initialData={initial} variant="outline" />
```

## Overriding Item Rendering

```tsx
<TableOfContents
  getControlProps={({ data, active }) => ({
    style: ({ pressed }: any) => ({
      paddingVertical: 4,
      paddingHorizontal: 8,
      backgroundColor: active ? 'rgba(0,0,0,0.06)' : pressed ? 'rgba(0,0,0,0.04)' : 'transparent',
      borderLeftWidth: 3,
      borderLeftColor: active ? '#3b82f6' : 'transparent'
    })
  })}
/>
```

## Reinitializing After Dynamic Content

```tsx
const ref = React.useRef<() => void>(null);

<TableOfContents reinitializeRef={ref} />

// After injecting markdown
ref.current?.();
```

## Accessibility

Each entry is a Pressable with an accessible label. Headings receive ids (if missing) for hash linking. Scroll-spy updates do not trap focus, allowing assistive tech to navigate naturally. Ensure heading order is hierarchical for optimal semantics.

## Recommendations

- Avoid skipping heading levels (e.g., from h2 to h4) for proper outline clarity.
- Use `rootMargin` in `scrollSpyOptions` to tweak when sections are considered active.
- Combine with a sticky container for persistent navigation.

## Related

- `useScrollSpy` (hook powering this component)
- `Tabs` for segmented content
- `Breadcrumbs` for hierarchical navigation context
