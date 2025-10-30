---
title: HoverCard
group: Overlays
status: beta
description: Lightweight contextual panel shown on hover or click, useful for previews and supplemental info.
---

The `HoverCard` component displays rich content when users hover (web) or tap/click a target element. It is more substantial than a tooltip and suited for previewing user profiles, link summaries, or supplementary UI controls.

## Features

- Hover or click trigger modes
- Open/close delays to reduce flicker
- Optional arrow and basic positional support (top, bottom, left, right)
- Supports touch (tap toggles)
- Can be kept mounted for transition strategies

## Usage

```tsx
<HoverCard
  target={<Button variant="outline" size="sm">Hover me</Button>}
  position="top"
  withArrow
>
  <Text weight="semibold">Card title</Text>
  <Text variant="caption" colorVariant="muted" style={{ marginTop: 4 }}>Supplemental detail</Text>
</HoverCard>
```

## When to use

Use `HoverCard` for content too rich for a tooltip but not essential enough to be always visible. Avoid placing critical actions exclusively inside it.

## Accessibility

Provide keyboard-accessible alternatives for actions inside the card; hover-triggered content may not appear for keyboard-only users. Consider adding a focus trigger variant in future iterations.

## Roadmap

- Portal rendering & collision avoidance
- Focus / keyboard triggers
- Transition animations
- Smart positioning fallback
