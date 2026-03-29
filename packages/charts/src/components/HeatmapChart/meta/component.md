---
title: Heatmap Chart
tags: [chart, heatmap, matrix]
category: charts
order: 9
---
Color-coded matrix for intensity visualization across two dimensions.

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `values` | `number[][]` | random matrix | Explicit value matrix (row-major). Values >1 trigger normalization. |
| `title` | `string` | `"Heatmap"` | Title displayed above chart. |
| `rows` | `number` | inferred | Number of rows (e.g. 7 for a weekday calendar). |
| `cols` | `number` | inferred | Number of columns (e.g. 53 for weeks in a year). |
| `cellSize` | `number` | auto | Fixed cell size (px). Ignored when `responsive` sizing is recomputed. |
| `gap` | `number` | `2` | Gap (px) between cells. |
| `padding` | `number` | `20` | Inner padding for the SVG content. |
| `cellRadius` | `number` | `2` | Corner radius for each cell. |
| `palette` | `string[]` | gradient | Discrete color palette. When provided, value maps to index. |
| `valueToColor` | `(v:number)=>string` | gradient fn | Override color mapping completely. |
| `renderTooltip` | `(cell)=>ReactNode` | percent text | Custom tooltip renderer. Return `null` to suppress. |
| `onCellHover` | `(cell|null)=>void` | – | Callback when hovered cell changes. |
| `showWeekdayLabels` | `boolean` | `false` | Render weekday labels in a left gutter. |
| `showMonthLabels` | `boolean` | `false` | Render month abbreviations above first week of each month. |
| `weekdayLabelIndices` | `number[]` | `[0,2,4]` | Which weekday rows to label (indexes into rendered rows). |
| `calendarStartDate` | `Date` | derived | Anchor date for first column (aligned to Monday). |
| `labelColWidth` | `number` | `34` | Width of label gutter when weekday labels shown. |
| `weekdayNames` | `string[]` | locale derived | Override weekday short names (Monday-first ordering). |
| `locale` | `string` | `en-US` | Locale for automatic weekday/month labels. |
| `hideWeekend` | `boolean` | `false` | Hide Saturday/Sunday rows (if 7-row input). |
| `showLegend` | `boolean` | `false` | Display palette/gradient legend. |
| `legendExtremes` | `[string,string]` | `["Less","More"]` | Legend edge labels. |
| `responsive` | `boolean` | `false` | Enable auto cell sizing based on container width. |
| `minCellSize` | `number` | `8` | Minimum cell size in responsive mode. |
| `ariaLabel` | `string` | `"Heatmap chart"` | Accessible label for the grid. |
| `getCellAriaLabel` | `(cell)=>string` | auto | Custom per-cell aria-label builder. |
| `stickyTooltip` | `boolean` | `true` | Click to pin tooltip; Esc to dismiss. |

### Accessibility

The SVG root uses `role="grid"` with `aria-rowcount` and `aria-colcount`. Each cell is a `gridcell` with an `aria-label` describing its position and value. Keyboard navigation with arrow keys moves the focus and updates the tooltip. Press `Escape` to unpin a sticky tooltip.

### Keyboard Interaction

- Arrow keys: Move focus/tooltip between cells when a cell is focused or tooltip pinned.
- Enter/Click: Pin/unpin tooltip (when `stickyTooltip` enabled). 
- Escape: Dismiss pinned tooltip.
