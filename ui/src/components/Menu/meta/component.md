---
title: Menu
description: A dropdown menu component for navigation and actions
source: ui/src/components/Menu
status: stable
category: Navigation
props:
  - name: children
    type: ReactNode
    description: Menu items and content
  - name: trigger
    type: ReactNode
    description: Element that triggers the menu
  - name: placement
    type: string
    description: Menu position relative to trigger
    default: bottom-start
  - name: offset
    type: number
    description: Distance between trigger and menu
    default: 4
  - name: closeOnSelect
    type: boolean
    description: Whether to close menu when item is selected
    default: true
  - name: disabled
    type: boolean
    description: Whether the menu is disabled
    default: false
examples:
  - basic
  - context
  - positioning
---

The Menu component provides a dropdown interface for navigation links, actions, and contextual options. It supports flexible positioning, keyboard navigation, and customizable triggers.

## Features

- Dropdown menu with customizable trigger
- Flexible positioning and offset
- Keyboard navigation support
- Menu items with icons and descriptions
- Menu dividers for grouping
- Context menu support
- Automatic focus management

## Usage

```tsx
import { Menu, MenuItem, MenuDivider, Button } from '@platform-blocks/ui';

<Menu trigger={<Button>Open Menu</Button>}>
  <MenuItem>Profile</MenuItem>
  <MenuItem>Settings</MenuItem>
  <MenuDivider />
  <MenuItem>Logout</MenuItem>
</Menu>
```
