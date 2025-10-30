---
title: Stepper
description: A component for displaying step-by-step navigation and progress
source: ui/src/components/Stepper
status: stable
category: Navigation
props:
  - name: active
    type: number
    description: Index of the currently active step
    default: 0
  - name: children
    type: ReactNode
    description: Stepper.Step components
  - name: orientation
    type: string
    description: Stepper orientation
    default: horizontal
  - name: size
    type: string
    description: Size variant
    default: md
  - name: allowSelectClick
    type: boolean
    description: Allow clicking on steps to navigate
    default: false
  - name: onStepClick
    type: function
    description: Callback when a step is clicked
  - name: color
    type: string
    description: Color theme for active step
    default: primary
examples:
  - basic
  - vertical
  - sizes
  - loading
  - customIcons
  - allowSelect
---

The Stepper component provides a step-by-step navigation interface, perfect for multi-step forms, wizards, and progress tracking.

## Features

- Horizontal and vertical orientations
- Multiple size variants
- Custom icons for steps
- Loading states
- Clickable steps for navigation
- Color themes
- Progress tracking

## Usage

```tsx
import { Stepper } from '@platform-blocks/ui';

<Stepper active={1}>
  <Stepper.Step title="Step 1">First step content</Stepper.Step>
  <Stepper.Step title="Step 2">Second step content</Stepper.Step>
  <Stepper.Step title="Step 3">Third step content</Stepper.Step>
</Stepper>
```
