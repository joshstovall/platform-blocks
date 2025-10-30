---
title: ColorPicker
description: A color selection component with various input methods and preset swatches
source: ui/src/components/ColorPicker
status: stable
category: Input
props:
  - name: value
    type: string
    description: Current color value in hex format (controlled)
  - name: defaultValue
    type: string
    description: Initial color value for uncontrolled usage
  - name: onChange
    type: function
    description: Callback when color changes
  - name: placeholder
    type: string
    description: Placeholder text for the input
  - name: label
    type: string
    description: Label for the color picker
  - name: helperText
    type: string
    description: Additional help text
  - name: disabled
    type: boolean
    description: Whether the picker is disabled
    default: false
  - name: withSwatches
    type: boolean
    description: Whether to show color swatches
    default: true
  - name: swatches
    type: string[]
    description: Custom color swatches array
  - name: size
    type: string
    description: Size variant
    default: md
  - name: variant
    type: string
    description: Visual variant
    default: default
  - name: error
    type: string
    description: Error message to display
examples:
  - basic
  - swatches
  - states
  - variants
---

The ColorPicker component provides an intuitive interface for selecting colors through various input methods including color wheel, hex input, and preset swatches.

## Features

- Interactive color wheel and sliders
- Hex color input field
- Preset color swatches
- Custom swatch palettes
- Multiple size variants
- Error and disabled states
- Accessible keyboard navigation
- Real-time color preview
- Controlled and uncontrolled usage patterns

## Usage

### Controlled

```tsx
import { useState } from 'react';
import { ColorPicker } from '@platform-blocks/ui';

function MyComponent() {
  const [color, setColor] = useState('#FF6B6B');
  
  return (
    <ColorPicker
      value={color}
      onChange={setColor}
      label="Choose Color"
      placeholder="Select a color"
    />
  );
}
```

### Uncontrolled

```tsx
import { ColorPicker } from '@platform-blocks/ui';

<ColorPicker
  defaultValue="#FF6B6B"
  onChange={(color) => console.log('Selected:', color)}
  label="Choose Color"
  placeholder="Select a color"
/>
```
