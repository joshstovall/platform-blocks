---
title: Spoiler
description: A component that collapses overflowing content beyond a specified height
source: ui/src/components/Spoiler
status: stable
category: Utilities
props:
  - name: children
    type: ReactNode
    description: Content to be shown/hidden
  - name: maxHeight
    type: number
    description: Maximum height before content is collapsed
    default: 100
  - name: showLabel
    type: string
    description: Text for the show more button
    default: Show more
  - name: hideLabel
    type: string
    description: Text for the show less button
    default: Show less
  - name: initiallyOpen
    type: boolean
    description: Whether the spoiler starts expanded
    default: false
  - name: transitionDuration
    type: number
    description: Animation duration in milliseconds
    default: 300
  - name: controlPosition
    type: string
    description: Position of the show/hide control
    default: center
examples:
  - basic
  - sizes
  - customControl
  - initiallyOpen
---

The Spoiler component automatically collapses content that exceeds a specified height, providing a show/hide toggle to reveal the full content.
