---
title: GaugeChart
component: GaugeChart
category: feedback
---

Visualises progress toward a bounded target using a semicircular gauge with configurable ranges, ticks, labels, and animated needle. Ported from the UI Gauge component to the charts package so it can slot into chart demos, interaction providers, and theming helpers.

The chart also supports `markers` for spotlighting thresholds (for example SLO limits or compliance baselines). Markers can render as secondary ticks or complementary needles, emit focus callbacks, and feed into the legend so demos can narrate multiple guardrails on the same gauge.

Additional niceties include gradient range fills, `innerRadiusRatio` for donut style layouts, and interaction hooks (`onValueChange`, `onMarkerFocus`) so dashboards can synchronise copy or annotations as the gauge updates.
