---
title: Knob
category: input
tags: [knob, dial, rotary, gesture, input]
---

The Knob component provides a rotary control for adjusting values with touch, mouse, and keyboard input. It supports snapping to marks, internal value labels, and accessible field headers for external labels.

## Usage Notes

- Reserve for compact adjustments where a rotary metaphor feels natural (audio, lighting, fine tuning).
- Switch to `Slider` when a linear track communicates progress more clearly.
- Combine `marks` with `restrictToMarks` to snap the knob to preset stops.
- Enable `withLabel` and supply `formatLabel` to render formatted values inside the knob surface.
- Set `mode="endless"` for rotary-encoder style controls that accumulate turns without bounds.
- Use `label`, `description`, and `labelPosition` to integrate with form layouts and accessibility semantics.