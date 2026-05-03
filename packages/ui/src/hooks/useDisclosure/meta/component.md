---
name: useDisclosure
title: useDisclosure
category: hooks
status: stable
since: 1.0.0
tags: [hook, state, toggle, open-close, modal, dialog]
---

`useDisclosure` is a boolean-state hook with `open` / `close` / `toggle` handlers — the canonical Mantine API. Returns a tuple `[opened, { open, close, toggle }]`.

Optional `onOpen` / `onClose` callbacks fire only on real transitions, never on no-op calls (calling `open()` when already open is a no-op and won't fire `onOpen`).

## Signature

```ts
const [opened, { open, close, toggle }] = useDisclosure(initialState, {
  onOpen: () => void,
  onClose: () => void,
});
```

## Common patterns

- **Dialog / modal toggle** — pair with `<Dialog visible={opened} onClose={close}>`.
- **Disclosure widget** — show/hide a panel on a button.
- **Drawer / popover** — open from a trigger, close on backdrop tap.

## See also

- `useClipboard` — copy-to-clipboard with auto-reset
