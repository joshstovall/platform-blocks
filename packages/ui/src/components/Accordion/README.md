## `<Accordion>`

Purpose: Collapsible content panels for grouping related information with single or multiple expansion modes.

### Accessibility
Headers behave as logical buttons (accessibilityRole="button") and expose expanded state. On web, each header receives `aria-controls` pointing to its panel and the panel uses `role="region"` with `aria-labelledby` referencing the header id. Reduced motion preferences are respected: animations are skipped when users opt out.

Keyboard recommendations (web):
- Tab focuses headers normally
- Space / Enter toggles
- (Future) Arrow Up/Down to move focus between headers; Home / End jump to first / last

### Performance
Expansion height is now driven by the shared `Collapse` primitive, giving us deterministic Animated-based transitions (honoring the `animated` prop for duration/easing) without bespoke measurement logic per item. We still measure each panel once to persist height, and expanded keys can optionally persist via the fast hash store.

### Theming
Variant + density token maps allow theme overrides. Supports size, radius, spacing, density (compact/comfortable/spacious) and chevron position.

### Public API Highlights
`animated`, `onItemToggle`, `chevronPosition`, `density`, compound export (`AccordionNamespace`), ref controls (`expandAll`, `collapseAll`, `toggle`, `getExpanded`).

### Future Work
Focus roving & arrow navigation, lazy unmount strategy, a11y announcements, spring motion option, meta schema enforcement in CI.
