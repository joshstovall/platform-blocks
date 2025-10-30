---
title: Donut Chart
tags: [chart, donut, circular]
category: charts
order: 20
---
Circular proportional chart with a hollow center (variant of pie chart).

### Highlights
- Supports single-ring and multi-ring layouts via the `rings` prop, enabling inner overlays for secondary metrics.
- `ringGap`, `primaryRingIndex`, and `legendRingIndex` provide fine-grained control over spacing, center value sourcing, and legend mapping.
- Integrates with chart interaction context for slice isolation, hover feedback, and shared legends across dashboards.
- `renderCenterContent` unlocks fully custom KPI stacks inside the donut, while keeping built-in fallbacks.
- Rich `labels` configuration adds outside callouts with leader lines or inner annotations per ring.
