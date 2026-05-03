---
name: useHover
title: useHover
category: hooks
status: stable
since: 1.0.0
tags: [hook, hover, pressable]
---

Returns `[hovered, handlers]`. Spread `handlers` onto any `<Pressable>` / `<View>` to toggle the hover state.

Both RN-style (`onHoverIn` / `onHoverOut`) and DOM-style (`onMouseEnter` / `onMouseLeave`) handler names are exposed so it works regardless of which prop your target component listens for.

## Signature

```ts
const [hovered, { onHoverIn, onHoverOut, onMouseEnter, onMouseLeave }] = useHover();
```

## In the wild

`<ListGroup.Item>` uses this hook for its hover background — replaces the manual `useState` + `useCallback` pair we previously had inline.
