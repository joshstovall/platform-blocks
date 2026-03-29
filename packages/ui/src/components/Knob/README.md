# Knob

Comprehensive rotary input supporting preset variants, value labels, split progress, and the new tick-layer system.

## Tick layers

Configure `appearance.ticks` with one or more layers derived from marks, steps, or explicit values:

- `source`: `'marks' | 'steps' | 'values'`
- `shape`: `'dot' | 'line' | 'icon' | 'custom'`
- `position`, `radiusOffset`, `length`, `width`: geometry controls
- `label`: show/format labels per tick
- `renderTick`: custom React output

Example:

```tsx
ticks: [
  { source: 'marks', shape: 'line', label: { show: true } },
  { source: 'steps', values: [0, 10, 20], shape: 'dot', radiusOffset: -8 },
]
```

## Compound parts

Use `Knob.Root` together with the exported statics to declaratively control every visual layer. Each child simply merges into the `appearance` map, so you can reorder, swap, or disable layers without rewriting the component internals.

```tsx
<Knob.Root value={value} onChange={setValue} appearance={{ arc: { startAngle: -120, sweepAngle: 240 } }}>
  <Knob.Fill color="#0f172a" />
  <Knob.Ring thickness={22} color="#1f2937" trailColor="#0f172a" />
  <Knob.Progress mode="split" thickness={12} roundedCaps />
  <Knob.TickLayer source="marks" shape="line" length={18} label={{ show: true }} />
  <Knob.Pointer visible length={72} width={3} color="#f8fafc" />
  <Knob.Thumb size={24} strokeWidth={2} strokeColor="#0f172a" />
  <Knob.ValueLabel position="center" formatter={(val) => `${Math.round(val)}%`} />
</Knob.Root>
```

Available parts:

- `Knob.Fill` – inner disk styling with solid colors and borders.
- `Knob.Ring` – primary stroke layer with independent thickness and colors.
- `Knob.Progress` – contiguous or split progress arc; set `visible={false}` to remove it.
- `Knob.TickLayer` – add one or more tick/label tiers derived from marks, steps, or explicit values.
- `Knob.Pointer` – clock-style hand anchored at the knob center.
- `Knob.Thumb` – rotary handle marker (can be hidden for pointer-driven designs).
- `Knob.ValueLabel` – center or external readouts, including secondary lines.

`Knob.Root` accepts all `Knob` props, so you can opt into the low-level API only when you need bespoke layouts.

## Interaction modes

Enable spin, slide, and scroll gestures through `appearance.interaction`:

- `modes`: opt into `'spin'`, `'vertical-slide'`, `'horizontal-slide'`, and `'scroll'` simultaneously.
- `lockThresholdPx` / `variancePx`: tune how quickly slide gestures lock to an axis.
- `slideDominanceRatio`: require that one axis exceeds the other (default ~1.35×) before committing to a slide, making circular spins easier.
- `slideRatio`: convert linear drag distance into rotary degrees.
- `spinStopAtLimits`: keep bounded knobs from wrapping when spinning so they behave like sliders with hard stops.
- `scroll`: `{ enabled, ratio, invert, preventPageScroll }` configures wheel behavior. `preventPageScroll` defaults to `true` so mouse wheels don’t bubble up to the parent `ScrollView`.

Example:

```tsx
appearance={{
  interaction: {
    modes: ['spin', 'vertical-slide', 'horizontal-slide', 'scroll'],
    lockThresholdPx: 32,
    slideRatio: 1.5,
    spinStopAtLimits: true,
    scroll: { enabled: true, ratio: 0.75, preventPageScroll: true },
  },
}}
```