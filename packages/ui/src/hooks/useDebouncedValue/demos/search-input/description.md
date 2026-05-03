---
title: Debounced search
category: basics
order: 10
tags: [debounce, search, input]
status: stable
since: 1.0.0
hidden: false
---

`useDebouncedValue` is the declarative pattern: derive a debounced copy of state and react to it from a `useEffect`. Best when the consumer is React-driven (renders, side-effects). For imperative event handlers, use `useDebouncedCallback`.
