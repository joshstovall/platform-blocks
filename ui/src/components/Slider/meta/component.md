---
title: Slider
category: input
tags: [slider, range, input, numeric, control]
---

The Slider component allows users to select a value or range of values by moving a handle along a track. Supports single values, ranges, and custom styling.

## Full Width Support

Use the `fullWidth` prop to make the slider stretch to fill its parent container:

- For horizontal sliders: stretches to parent width
- For vertical sliders: stretches to parent height

```tsx
// Horizontal full width
<Slider fullWidth value={50} onChange={setValue} />

// Vertical full height (parent must have defined height)
<View style={{ height: 300 }}>
  <Slider fullWidth orientation="vertical" value={50} onChange={setValue} />
</View>
```
