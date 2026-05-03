---
name: Radio
description: A radio button component for single-choice selection from a group of options
category: Input System
subcategory: Form Controls
tags: [input, form, selection, choice]
status: stable
playground: true
since: 1.0.0
platform:
  web: true
  ios: true
  android: true
accessibility:
  - Keyboard navigation support
  - Screen reader compatible
  - ARIA attributes
related:
  - Checkbox
  - Switch
  - Select
examples:
  basic: Basic radio button usage
  variants: Different visual variants
  orientations: Horizontal and vertical layouts
  forms: Integration with form controls
  label-customization: Override label and description Text props (labelProps, descriptionProps)
---

Radio buttons allow users to select a single option from a group of mutually exclusive choices.

## RadioGroup variants

`RadioGroup` accepts a `variant` prop to switch between four visual styles:

- `default` — classic stacked radio dots with labels (uses `<Radio>` under the hood)
- `card` — each option is a bordered, padded surface; the selected card gets a colored border, tinted background, and a check icon
- `segmented` — joined buttons sharing borders, like an iOS/macOS segmented control (always horizontal)
- `chip` — compact rounded pills that wrap onto multiple lines; great for filters and tag pickers

`orientation` is honored by `default` only — `segmented` is always horizontal and `chip` always wraps.

## Label position

Both `Radio` and `RadioGroup` accept `labelPosition: 'left' | 'right'` (default `'right'`, meaning the label sits on the right of the radio bubble). Setting `'left'` puts the bubble on the right edge with the label on the left. This only applies to the `default` variant — the other variants are self-contained pressable surfaces.
