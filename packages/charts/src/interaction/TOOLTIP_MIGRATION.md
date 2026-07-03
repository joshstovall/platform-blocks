# Tooltip / interaction migration — legacy crosshair → unified hit-test engine

**Goal:** move every chart off the legacy `registerSeries` + `setCrosshair` →
`useTooltipAggregator` → `ChartPopover` pipeline and onto the hit-test engine
(`register({geometry})` → `useChartPointer({tester})` → `activeTarget`/`activeSlice`
→ `ChartActiveTooltip`), then delete the legacy code and stop double-mounting both
tooltip renderers on every chart.

Reference implementation (already migrated): **ScatterChart**
(`components/ScatterChart/ScatterChart.tsx` — see the `register('scatter', …)` block
and `useChartPointer({ tester, … })`).

Status legend: ☐ not started · ◐ in progress · ☑ done

---

## Phase 0 — Foundation (blockers; land before migrating any chart)

- ☑ **0.1 Tooltip content parity.** *(done)* `Mark` + `ActiveTarget` now carry
  `formattedValue`, `customTooltip`, and per-mark `label`/`color`; `toActiveTarget`
  propagates them (per-mark overrides beat series defaults). `ChartActiveTooltip` is
  at parity with `ChartPopover`: multi-row slice with `renderHeader`, `sortEntries`
  (default nearest-first), `filterEntry`, `maxEntries` (defaults to
  `config.aggregatorMaxSeries`), `renderEntry`, and first-class `customTooltip`
  rendering. ScatterChart wired as the reference (emits `formattedValue`).
  *Remaining per-chart:* each chart maps its `tooltip` render prop into per-mark
  `customTooltip` while building marks (done during that chart's own migration).
- ☐ **0.2 Crosshair line.** Shared crosshair renderer (or an `onPointer` contract)
  that draws the vertical guide from `activeTarget.pixel.x` so charts stop calling
  `setCrosshair`. ~20 charts currently draw it from legacy `crosshair.pixelX`.
- ☐ **0.3 Segment/flow tester.** `TargetKind='segment'` + `MarkExtent.polygon`
  exist in `core/hittest/types.ts` but there is **no tester** and `GeometrySpec`
  omits `segment`. Add `SegmentHitTester` + extend registration. Needed for
  Sankey/Network (and maybe Funnel). *(Decision: flow charts may keep element-level
  hover instead — see Risks.)*
- ◐ **0.4 Migration harness.** *(jest transform fixed — see findings; shared
  `useHitTestRegistration` helper still TODO)* An interaction/snapshot test rig so each
  chart migration is verifiable. The component-test suite now runs (was 100% broken).
- ☑ **0.5 Decouple series-visibility from the tooltip registry.** *(done)* The legacy
  `series` registry did double duty (tooltip **and** legend-visibility). `store.updateSeriesVisibility`
  now **upserts** a visibility-only entry, so hit-test-migrated charts with a legend can
  drop `registerSeries` entirely and still toggle series (they read visibility back from
  `interaction.series`). Unblocks clean legacy removal for all legend-bearing charts.

---

## Phase 1+ — Per-chart migration (grouped by geometry archetype)

Per-chart shape: build container-origin `HitSeries[]` marks → `register(geometry)` →
replace custom pointer handling with `useChartPointer({tester})` → rewire crosshair
line to `activeTarget` → delete `registerSeries` / `setCrosshair` / `useNearestPoint`.
Effort scales with how tangled the chart's existing pointer/pan/zoom code is.

### point (`PointSeriesHitTester`, has `slice()`)
- ☑ ScatterChart — *reference, already migrated*
- ☑ SparklineChart — *first validation migration; registers point geometry +
  `useChartPointer`, emits `formattedValue`, deletes `useSparklineSeriesRegistration`
  + the custom `findNearestPoint`/crosshair feed. tsc clean.*
- ☐ AreaChart — **free**: pure passthrough to LineChart/StackedAreaChart; migrates
  automatically when those do (no own interaction).
- ☑ StackedAreaChart — *first multi-series migration; one point hit-series per layer,
  `slice()` drives the multi-series tooltip. Dropped `registerSeries` (visibility now via
  the 0.5 upsert), the crude per-area hover, and the crosshair feed. Render test asserts
  `activeSlice.length === layers` with formatted values. tsc clean.*
- ☑ LineChart — *the canonical point chart. **Low-risk engine-swap** (not an overlay
  rewrite): replaced `useNearestPoint` with a `PointSeriesHitTester` built from the
  rendered series, called inside the existing `evaluateNearestPoint`; the entire bespoke
  gesture layer (native PanResponder pan/pinch/brush/zoom/double-tap + web mouse) is
  **untouched**. Tooltip output moved off legacy crosshair/`ChartPopover` to
  `activeTarget`/`activeSlice` (multi → shared `ChartActiveTooltip`) while keeping the
  built-in single-point tooltip (`selectedPoint`, gated on `!multiTooltip`) — no double.
  Dropped `registerSeries`/`setCrosshair`/`useNearestPoint`. Smoke test + tsc clean;
  **gestures need app-side runtime verification** (PanResponder isn't fireable in jest).
  This engine-swap pattern unlocks Bubble/Combo/Pareto/Area.*
- ☑ BubbleChart — *engine-swap. No pan/zoom, so kept the radius-aware closest-bubble loop
  and gesture surface intact; only swapped the tooltip **output**: build an `ActiveTarget`
  from the resolved bubble (container-origin pixel + formattedValue/customTooltip) and
  publish `setActiveTarget`/`setActiveSlice` instead of `setCrosshair`. Dropped
  `registerSeries` (deleted `useBubbleSeriesRegistration`). Smoke + pointer-feed test; tsc clean.*
- ☑ CandlestickChart — *engine-swap. Kept the bespoke responder gesture surface + the
  existing nearest-x candle resolver (no threshold); only swapped the tooltip **output**:
  `handlePointerUpdate` now builds an `ActiveTarget[]` slice from the resolved candles
  (container-origin pixel + OHLC `formattedValue` / `customTooltip` node) and publishes
  `setActiveTarget`/`setActiveSlice` instead of `setCrosshair`; leave clears both.
  Dropped `registerSeries` (deleted orphaned `useCandlestickSeriesRegistration`). Added
  `testID="candlestick-gesture-surface"`; smoke + responder-move test asserts a `point`
  target carrying the OHLC string. tsc + full suite (91/91) clean.*

### band (`BandCategoryHitTester`, has `slice()`)
- ☑ HistogramChart — *first band migration; each bin is a band mark carrying its bar
  `extent.rect` (container-origin) + bin-index category key. Tester resolves rect
  membership → nearest-category. Drops `registerSeries` and the web-only `onMouseMove`
  crosshair feed; the `activeBinIndex` bar-highlight is now driven by `useChartPointer`'s
  `onPointer`, and the chart gains native (responder) support it lacked. Render test
  asserts a `band` target with `formattedValue`. tsc clean.*
- ☑ StackedBarChart — *first multi-series band migration; one hit-series per stack
  series, each segment a band mark with its `extent.rect` + category-index key. Rect
  membership resolves the hovered segment; `slice()` returns the whole stack (all series
  at the category). Replaced the per-`<Rect>` DOM hover/press handlers with a single
  gesture overlay + `useChartPointer` (press re-routed through `onPress`); dropped
  `registerSeries` (visibility via 0.5 upsert). `AnimatedStackedSegment` is now a pure
  visual. Render test asserts `activeSlice.length === series`. tsc clean.*
- ☑ GroupedBarChart — *grouped columns; one hit-series per series, each bar a band
  mark. Replaced per-`<Rect>` handlers **and** the manual rect-hit-test overlay loop
  with a single `useChartPointer` overlay. `slice()` returns every series' bar at the
  category (grouped tooltip). Render test asserts `activeSlice.length === series`.
  Removed dead code (manual `handlePointer`, `categoryCenters`, `toNativePointerEvent`).
  tsc clean.*
- ☑ BarChart — *the canonical band chart. One hit-series per data series, each bar a band
  mark with its container-origin rect + category key; band axis is x (vertical) or y
  (horizontal). Replaced per-bar handlers + the manual rect-hit-test overlay loop with a
  `useChartPointer` overlay; the bar-highlight scale (`hoveredIndex`) is driven from
  `onPointer`, press via `onPress`. Dropped `registerSeries`/crosshair/`updatePointerState`.
  Render test asserts grouped `activeSlice.length === series`. tsc clean.*
- ☑ RidgeChart — *band-summary migration (per user choice). Each ridge is ONE band mark
  spanning its horizontal row (orientation 'y'); hover resolves which ridge + shows its
  summary (median). Note: this simplifies the legacy density-at-hovered-value tooltip to a
  per-distribution summary. Dropped `useRidgeSeriesRegistration` + crosshair. Test asserts
  distinct ridges by row. tsc clean.*
- ☑ ViolinChart — *band-summary migration. Each violin is ONE band mark spanning its
  category slot (orientation follows the category axis: 'x' vertical, 'y' horizontal); hover
  resolves which violin + summary. Same density-at-value → summary simplification. Dropped
  `useViolinSeriesRegistration` + crosshair. Test asserts distinct violins by column. tsc clean.*
  **Trade-off logged:** if the density-at-value tooltip is wanted back, both need the fuller
  point-slice model (marks per density sample).

### slice / angular (`AngularSliceHitTester`)
- ☑ RadialBarChart — *first angular migration; each ring is a single annular-sector
  mark (`extent.slice` = full-track arc at the ring radius ± thickness/2). The angular
  tester resolves ring membership by angle+radius. Replaced per-ring `onMouseEnter`
  hover with a `useChartPointer` overlay; dropped `registerSeries`/crosshair (visibility
  via 0.5 upsert). Render test asserts a `slice` target + the outside-all-rings→null
  case. tsc clean. NB: the angular tester has no `slice()` — single-target hover only,
  which is correct for radial/pie; press stays on native SVG for pixel-perfect wedges.*
- ☑ DonutChart — *every visible slice (across rings) is an angular-sector mark. Overlay
  drives the tooltip + enables the previously-dormant center-label focus (`focusedSliceId`
  was only ever reset before). Press routes through `handleSlicePress` (isolate-on-click).
  Dropped `registerSeries`; kept the per-`<Path>` onPress so standalone (no-provider) press
  still works. Render test asserts slice resolution + the center-hole → null case.*
- ☑ PieChart — *largest chart. Every slice → angular mark; the overlay drives PieChart's
  own `hoveredSlice` state (highlight + built-in tooltip) and press. Uses `feedStore: false`
  so the shared `ChartActiveTooltip` doesn't double up with the built-in tooltip — `onPointer`
  manually feeds `setPointer` (for tooltip position) + `handleHover`. Dropped `registerSeries`
  and the web-only `onMouseMove` pointer feed; removed per-slice `onHoverIn/onHoverOut`.
  Replaced the stale mock-based test. NB: Donut/Pie share `AnimatedPieSlice`.*
- ☑ FunnelChart — *engine-swap. Tapered stacked funnel; interaction is direct per-segment
  hover, so each hovered segment → one `kind:'cell'` `ActiveTarget` (value + cumulative-
  conversion `customTooltip`, series-qualified label when multi-series). `handleSegmentHover`
  now publishes `setActiveTarget`/`setActiveSlice([target])` (null clears both) instead of
  `setCrosshair`; deleted the `registerSeries` effect. Added native `onPressIn/Out` + a
  `testID="funnel-segment-<id>"` to the segment `<G>` (was web-`onMouseEnter`-only) so touch
  works and it's testable. Test fires a step `pressIn` → single cell target. tsc + full
  suite (97/97) clean.*

### cell (`CellGridHitTester`)
- ☑ HeatmapChart — *opens (and completes) the cell archetype. Every cell is a rect mark
  carrying its container-origin rectangle + `{ row, col }`; the tester resolves the hovered
  cell by rect membership. Overlay replaces the web-only `onMouseMove`; the row/column
  highlight + in-cell value label still read the (engine-fed) pointer via `hoverCell`.
  Dropped `registerSeries` (deleted `useHeatmapSeriesRegistration`) + crosshair. Render
  test asserts `cell === {row,col}` + outside-grid → null. tsc clean.*
- ☑ MarimekkoChart — *engine-swap. Variable-width stacked mosaic; interaction is direct
  per-segment hover (not a crosshair), so each hovered segment maps cleanly to a single
  `kind:'cell'` `ActiveTarget` (share-of-total/-category `customTooltip`, segment color).
  `handleHoverIn/Out` now publish `setActiveTarget`/`setActiveSlice([target])` instead of
  `setCrosshair`; dropped `registerSeries` (legend visibility rides the 0.5 upsert). Added
  `testID="marimekko-segment-<catId>-<segId>"`; test fires a segment `pressIn` and asserts
  a single cell target with the share tooltip. tsc + full suite (95/95) clean.*

### radar axis (`RadarAxisHitTester`)
- ☑ RadarChart — *opens the axis archetype. One hit-series per data series, one mark per
  spoke encoding its canonical angle (`dataX`) + `extent.axisIndex`. The tester resolves
  the nearest spoke by angle. **Added `slice()` to `RadarAxisHitTester`** (it only had
  `hit()`) so a hover returns every series' value at that spoke — the multi-series radar
  tooltip. Overlay replaces the web-only `onMouseMove`; the spoke-highlight visual still
  reads the (now engine-fed) pointer. Dropped `registerSeries`/crosshair. Render test
  asserts `activeSlice.length === series`. tsc + hit-test unit tests clean.*

### mixed geometry (register N testers under distinct keys)
- ☑ ComboChart — *engine-swap. Multi-layer (bar + line/area/density, dual-axis). Kept the
  bespoke per-bar hover/press + web pointer surface; only swapped tooltip **output**:
  `updatePointerFromPlotCoords` now builds an `ActiveTarget[]` slice — one mark per visible
  layer snapped to its nearest data point at the pointer x, each pixel via the layer's own
  target-axis scale, `formattedValue` via that axis's `labelFormatter` — and publishes
  `setActiveTarget` (anchored to the closest layer) / `setActiveSlice` instead of
  `setCrosshair`. Dropped `registerSeries` (legend visibility now rides the 0.5 upsert).
  Added `testID="combo-bar-<id>"`; test fires a bar `pressIn` and asserts a 2-mark slice
  (bar + line). tsc + full suite (93/93) clean.*
- ☑ ParetoChart — *no work: it's a thin wrapper that renders `<ComboChart>` (bar + cumulative
  line), so it inherited the engine-swap for free. Builds its own `customTooltip` strings and
  passes them through.*

### flow / segment (element-hover → direct ActiveTarget; no segment tester needed)
- ☑ SankeyChart — *engine-swap. Element-hover flow (nodes + links); we skipped Phase 0.3's
  segment tester and instead publish a direct `ActiveTarget` per hovered element (like
  Funnel/Marimekko). `handleNodeHover` → `kind:'cell'` target anchored at the node's rect
  center (value + in/out `customTooltip`); `handleLinkHover` → target at the link mid-span
  (`source → target`, flow value). Deleted the inline `registerSeries` node-dump memo/effect
  + the raw-pointer-only tooltip reliance. Nodes/links already had native `onPressIn`; added
  `testID="sankey-node-<id>"`. Test fires a node `pressIn` → single cell target. tsc + full
  suite clean.*
- ☑ NetworkChart — *engine-swap. Force/coordinate graph; the node `<G>` already emitted
  `onFocus`/`onBlur` on hover+press, so we wired those to publish a `kind:'point'`
  `ActiveTarget` at the node's container-origin center (label + value), clearing on blur —
  and kept firing the user's `onNodeFocus/Blur` callbacks. Deleted
  `useNetworkSeriesRegistration` (the last `registerSeries` caller) + its file; added a
  `testID` passthrough to `AnimatedNode`. The rAF-throttled force renderer never advances in
  jsdom (nodes never mount — same untestable class as LineChart's PanResponder), so the test
  is a smoke + store-level assertion that NO `network-nodes` series is registered. tsc +
  full suite clean.*
- Also inlined ScatterChart's `ScatterChartSeriesRegistration` type + **deleted the dead
  `useScatterSeriesRegistration.ts`** (ScatterChart migrated to `register`/`useChartPointer`
  long ago and only imported the type — the hook's `registerSeries` call was unreachable).

---

## Phase Final — Retirement & cleanup

**Done now (safe subset):**
- ☑ Delete **dead** `interaction/ChartTooltip.tsx` (~221 LOC — was never imported/rendered).
- ☑ Fixed the stale `ChartPopover` "No data" test → **full suite green (87/87)**.
- ☑ `GlobalChartsRoot` wrapper already re-enabled in docs (earlier).

**🎉 EVERY chart is migrated — the retirement blockers are gone.** No component calls
`setCrosshair` **or** `registerSeries` anymore (verified: `grep -rn 'registerSeries|setCrosshair'
src/components` returns only comments). Full suite **101/101**. All 20+ charts publish
`ActiveTarget`/`ActiveSlice` and render through `ChartActiveTooltip`.

**⚠️ Do NOT strip `series` from the store.** The new visibility system reuses the `series`
registry via `updateSeriesVisibility`'s **0.5 upsert** (`{id, visible, points:[]}`) — legend
toggles in Combo/Marimekko/Funnel/StackedBar/GroupedBar/etc. read `interaction.series`. Only
the *legacy tooltip* plumbing (`registerSeries`, `setCrosshair`, `crosshair`, the popover +
aggregator) is dead. `RegisteredSeries.points` is now vestigial (always `[]`) but the type/
field can stay until a follow-up trims it.

Retirement — **DONE** (this pass):
- ☑ Deleted `interaction/ChartPopover.tsx` (~444 LOC) + its exclusive test/mock
  (`ChartPopover.test.tsx`, `__mocks__/useTooltipAggregator.ts`).
- ☑ Deleted `hooks/useTooltipAggregator.ts` (~199 LOC) + `useTooltipAggregator.integration.test.tsx`.
- ☑ Deleted `hooks/useNearestPoint.ts` (logic already absorbed into `core/hittest/point.ts`).
- ☑ Removed the 3 exports from `index.ts`; refreshed docs (README hooks table, docs-site
  hook list) to advertise `useChartPointer` instead of the retired hooks.
- ☑ Stopped double-mounting: `ChartBase.tsx` + `ChartsProvider.tsx` now render only
  `<ChartActiveTooltip/>`; dropped the `popoverProps` plumbing (ChartBase + ScatterChart).
- **Net: ~730 LOC of source + ~13 legacy tests removed. tsc 0 errors, suite 88/88 green.**

Retirement — store strip **DONE** (chose option (a): reconnect the guide line, then strip):
- ☑ **Reconnected the `enableCrosshair` guide line to the hit-test engine.** `LineChart` now
  draws it from its plot-coord `highlightPoint` (set in both single + multi mode);
  `GroupedBarChart` draws it from `interaction.activeTarget.pixel.x`. Same container-origin
  coordinate space as the old `crosshair.pixelX`, so it's a drop-in — the guide line is back.
- ☑ Stripped `crosshair`, `selectedPoints`, `registerSeries`, `setCrosshair` + the entire
  crosshair-rAF machinery (`resolveCrosshairValue`/`applyCrosshairUpdate`/`flushCrosshair`/
  refs) from `ChartInteractionContext.tsx`, plus the now-dead config fields (`crosshairRAF`,
  `crosshairPixelThreshold`, `stickyCrosshair`, `popoverFollowMode`).
- ☑ **KEPT** `series` + `updateSeriesVisibility` (legend visibility rides them; `points` is
  vestigial `[]`) and `aggregatorMaxSeries` (ChartActiveTooltip caps slice rows with it).
- ☑ Rewrote the two store tests that exercised removed APIs (`registerSeries` →
  `updateSeriesVisibility` upsert; `crosshairRAF` scheduling → `setActiveTarget` store).
- **The interaction store is now hit-test-engine only. tsc 0 errors, suite 88/88 green.**

**✅ Tooltip migration + full retirement COMPLETE.** No `ChartPopover`, no
`useTooltipAggregator`/`useNearestPoint`, no `registerSeries`/`setCrosshair`/`crosshair` in
the store. Every chart runs on `useChartPointer`/`register` → `activeTarget`/`activeSlice` →
`ChartActiveTooltip`, and the `enableCrosshair` guide line is engine-driven.

---

## Risks & watch-items

- **Pan/zoom entanglement** (Line/Bubble/Bar/Pie): custom gesture code is interleaved
  with the crosshair feed. `useChartPointer` covers wheel/press; bespoke pan/brush is
  the highest-risk part of the L charts.
- **Multi-geometry charts** (Combo, Pareto): one chart, two geometries — register two
  testers under distinct keys; verify `slice()` merges across them.
- **Tooltip regressions**: per-series formatting/custom content is the most likely
  visible regression → Phase 0.1 must be solid with snapshot coverage.
- **Native parity**: `useChartPointer` already handles the web/native responder split;
  verify on both per archetype.
- **Flow charts**: if element-level hover UX is sufficient, consider leaving
  Sankey/Network on direct hover and simply not mounting a tooltip for them — cheaper
  than building the segment tester (Phase 0.3).

### Findings from the SparklineChart spike
- **Series registry does double duty.** The legacy `series` registry (`registerSeries`)
  feeds both the `ChartPopover` tooltip **and** series-visibility (charts read
  `interaction.series[].visible` for shared-legend toggling). The hit-test `register`
  only covers hit-testing; `HitSeries.visible` carries per-series visibility into the
  tester (respected by point/band `hit`/`slice`), but any chart driven by a *shared
  legend* that toggles the registry needs that visibility routed into its `HitSeries`
  build. Sparkline was safe (no legend → defaults visible). **Watch this on
  Bar/Line/Stacked charts that pair with a legend.**
- **Per-chart tooltip gating moves to store config.** `liveTooltip` is preserved by
  gating `useChartPointer({ hover })`; `multiTooltip` (vertical slice) is now governed
  by the shared `store.config.multiTooltip`, not a per-chart prop. Confirm demos that
  set these per-chart still behave as intended.
- **Test harness — FIXED.** `tests/components/*` were 100% broken (all failed at
  `@testing-library/react-native` import — `SyntaxError: Cannot use import statement
  outside a module`). Root cause was pnpm: real paths are
  `node_modules/.pnpm/<virtual>/node_modules/<pkg>/…`, which the old
  `transformIgnorePatterns` allowlist never matched. Fixed by mirroring
  `packages/ui`'s pnpm-aware pattern (`(?:\.pnpm/[^/]+/node_modules/)?` prefix) and
  adding `@testing-library`. Suite now runs: **64/65 pass**. SparklineChart's test was
  rewritten to assert the new engine (`ctx.hitTest` / `activeTarget` / `formattedValue`
  via the `sparkline-gesture-surface` overlay).
- **Pre-existing red (not from this work):** `ChartPopover.test.tsx` "shows no data
  message" fails — an uncommitted working-tree edit to `ChartPopover.tsx` gated
  `shouldShow` on `hasLegacyContent`, so it now stays silent for empty entries instead
  of rendering "No data". The test (unchanged from HEAD) still expects the old box. The
  broken harness had masked this drift. Update the test (or revert the guard) when
  touching legacy popover retirement.

## Rough sizing

- Phase 0: ~5–7 dev-days (critical path).
- Per-chart: ~22–28 dev-days (S≈0.5, M≈1–1.5, L≈2–3).
- Retirement: ~2–3 dev-days. Net removal ≈ 900–1000 LOC.
- **Total ≈ 30–40 dev-days**, heavily parallelizable across charts once Phase 0 lands.
