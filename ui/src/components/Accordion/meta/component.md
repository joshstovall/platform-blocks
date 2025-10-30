---
name: Accordion
title: Accordion
description: Collapsible content panels for organizing related information with single or multiple expansion modes and visual variants.
status: stable
since: 0.4.0
category: layout
subcategories: [layout, disclosure]
tags: [collapse, expand, panel, ui, content-grouping]
a11yKeyboard: Arrow keys / Home / End navigate headers; Enter or Space toggles; focus returns to header after collapse.
a11yRoles: Headers behave as buttons; panels use region role with aria-labelledby referencing header id.
theming: [radius, spacing, variant-colors, divider-opacity]
performanceNotes: Content lazily rendered only when expanded (optional); animations respect ReducedMotionProvider.
---

The Accordion component groups related content into expandable sections. It supports:

- Single and multiple expansion modes
- Three visual variants (default, separated, bordered)
- Theming hooks for size, radius, spacing, color intent (reserved), and divider styling
- Reduced motion compliance (skips animated height transitions when the user prefers reduced motion)
- Accessible semantics on web (button headers with aria-expanded and region panels)

Future improvements may include lazy rendering strategies, animation tokens, and richer a11y announcements.
