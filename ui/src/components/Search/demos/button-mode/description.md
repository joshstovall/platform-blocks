---
title: Button Mode
description: Search component in button mode that triggers actions instead of text input, with support for right-side components like keyboard shortcuts.
---

Demonstrates the `Search` component with `buttonMode={true}` that renders as a pressable button instead of a text input. When pressed, it can either call a custom `onPress` handler or open the Spotlight by default.

The `rightComponent` prop allows you to display additional content on the right side of the search button, such as keyboard shortcuts using `KeyCap` components.

- **Button mode with CMD+K shortcut**: Shows KeyCap components for keyboard shortcuts
- **Button mode with custom onPress**: Shows how to handle custom press actions with different shortcuts  
- **Button mode with default behavior**: Opens Spotlight when pressed
- **Normal input mode**: Standard search input for comparison