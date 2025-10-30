---
title: Histogram Chart
tags: [chart, histogram, distribution]
category: charts
order: 15
---
Distribution of continuous data split into bins.

## Interaction highlights

- Emits `HistogramBinSummary` via `onBinFocus` / `onBinBlur` so external UI can react to the active bin.
- Pointer metadata now includes cumulative counts, density ratios, and percentile—ideal for shared popovers.
