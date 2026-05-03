---
name: useMediaQuery
title: useMediaQuery
category: hooks
status: stable
since: 1.0.0
tags: [hook, responsive, media-query, dimensions]
---

Cross-platform media query hook. Mantine API.

- **Web**: subscribes to `window.matchMedia(query)` and updates on every `change` event.
- **Native**: parses width/height queries (`(min-width: …)`, `(max-width: …)`, `(min-height: …)`, `(max-height: …)`) and re-evaluates on `Dimensions` change events. Other CSS features fall back to the supplied `initialValue`.

## Signature

```ts
const matches = useMediaQuery(query, initialValue?);
```
