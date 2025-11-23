---
title: Tree
category: Navigation
description: A hierarchical tree component for displaying nested data structures with expand/collapse functionality, selection, and filtering capabilities.
package: platform-blocks
since: 1.0.0
---

Tree component for displaying hierarchical data structures like file systems, navigation menus, or any nested content. Supports expansion/collapse, multiple selection modes, checkboxes, filtering, and custom rendering.

## Features

- **Hierarchical Display**: Show nested data with proper indentation and visual hierarchy
- **Expand/Collapse**: Interactive expansion with chevron indicators
- **Selection Modes**: Support for single, multiple, or no selection
- **Range Selection**: Shift-click to select ranges, Ctrl/Cmd-click for individual selection
- **Checkboxes**: Optional checkbox selection with cascading behavior
- **Filtering**: Built-in search/filter with highlighting support
- **Custom Icons**: Add icons to differentiate node types
- **Custom Rendering**: Complete control over node appearance
- **Controlled State**: External control over expansion and selection
- **Optional Animations**: Toggle `useAnimations` to animate branch expand/collapse via the Collapse helper
- **Accessibility**: Proper ARIA labels and keyboard navigation support

## Use Cases

- File system browsers
- Navigation menus
- Category hierarchies
- Organizational charts
- Decision trees
- Content management systems
- Settings panels

## API

### TreeNode

Individual node structure:

- `id: string` - Unique identifier
- `label: string` - Display text
- `children?: TreeNode[]` - Nested children
- `icon?: ReactNode` - Custom icon
- `disabled?: boolean` - Disable interaction
- `href?: string` - Navigation target
- `data?: any` - Custom data payload

## Accessibility

- Uses proper ARIA roles and labels
- Supports keyboard navigation
- Screen reader compatible
- Focus management for nested structures
- Accessible expand/collapse states
