---
title: Tooltip
description: A contextual information overlay that appears on hover, focus, or press to provide additional details without cluttering the interface.
source: "@platform-blocks/ui"
status: "stable"
category: "Overlay"
accessibility: "Supports keyboard navigation, ARIA attributes, focus management, and screen readers"
variants:
  - name: "simple"
    description: "Basic tooltip with minimal styling and content"
  - name: "basic"
    description: "Standard tooltip with different trigger events (hover, focus, touch)"
  - name: "positions"
    description: "Various positioning options with smart edge detection"
  - name: "advanced"
    description: "Advanced features like custom content, delays, and styling"
  - name: "debug"
    description: "Debug mode for development and positioning testing"
dependencies:
  - "@platform-blocks/core"
  - "@floating-ui/react" 
related:
  - "Popover"
  - "Menu"
  - "Dialog"
props:
  - name: "label"
    type: "string | React.ReactNode"
    description: "Content to display in the tooltip"
  - name: "position"
    type: "'top' | 'bottom' | 'left' | 'right' | 'top-start' | 'top-end' | 'bottom-start' | 'bottom-end'"
    description: "Position of tooltip relative to trigger element"
  - name: "events"
    type: "{ hover?: boolean, focus?: boolean, touch?: boolean }"
    description: "Which events trigger the tooltip"
  - name: "withArrow"
    type: "boolean"
    description: "Whether to show an arrow pointing to the trigger"
  - name: "delay"
    type: "number | { show?: number, hide?: number }"
    description: "Delay in milliseconds before showing/hiding"
  - name: "offset"
    type: "number"
    description: "Distance from trigger element in pixels"
  - name: "disabled"
    type: "boolean"
    description: "Whether the tooltip is disabled"
  - name: "children"
    type: "React.ReactElement"
    description: "Trigger element that shows the tooltip"
---

Tooltip provides contextual information without disrupting the user's workflow. It supports multiple trigger events, smart positioning, and accessibility features for an inclusive experience.
