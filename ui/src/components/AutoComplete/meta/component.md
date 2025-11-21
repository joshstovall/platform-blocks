---
name: AutoComplete
title: AutoComplete
category: inputs
tags: [input, search, typeahead, autocomplete, suggestions]
---
The AutoComplete component provides search functionality with suggestions, supporting single/multi-select, async data loading, and rich content display.

It now integrates with the shared keyboard management system: wrap your screen in `KeyboardManagerProvider` (and optionally `KeyboardAwareLayout`) to keep focused inputs visible when the on-screen keyboard is active. Use the new `refocusAfterSelect` prop to control whether the field regains focus after a suggestion is chosen—single-select defaults to dismissing the keyboard on native while multi-select keeps the input focused for rapid entry.
