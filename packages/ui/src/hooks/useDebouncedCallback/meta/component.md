---
name: useDebouncedCallback
title: useDebouncedCallback
category: hooks
status: stable
since: 1.0.0
tags: [hook, debounce, callback, performance]
---

`useDebouncedCallback` returns a stable wrapper that delays invocation of a function by `wait` ms. Mantine API.

## Signature

```ts
const wrapped = useDebouncedCallback(fn, wait);
wrapped(...args);  // schedules
wrapped.cancel();  // drop pending invocation
wrapped.flush();   // run now with the most recent args
```

## Differences from `useDebouncedValue`

- **`useDebouncedValue`** — derives a debounced copy of state. Use for declarative React patterns (`useEffect` watching the debounced value).
- **`useDebouncedCallback`** — wraps a function. Use for imperative event handlers that should fire a request after a quiet period.

## In the wild

`<AutoComplete>` uses this hook internally for its search debounce — pass `searchDelay` and the search will fire after the user stops typing for that long.
