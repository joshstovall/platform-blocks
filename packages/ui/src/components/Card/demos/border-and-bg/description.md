---
title: Border & background
order: 30
tags: [withBorder, borderColor, bg, customization]
highlightLines: []
status: stable
since: 1.0.0
hidden: false
---

`withBorder` adds a 1px theme border on top of *any* variant — so `<Card variant="elevated" withBorder>` works without forcing you into the `outline` variant. `borderColor` and `borderWidth` override the defaults. `bg` accepts a CSS color or a theme palette name (`'primary' | 'gray' | …`) which resolves to that palette's subtle shade. `padding` now accepts the size tokens (`xs` → `3xl`) in addition to a pixel number, matching the rest of the size system.
