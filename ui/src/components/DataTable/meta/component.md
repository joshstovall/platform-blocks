---
title: DataTable
description: A powerful data table component with sorting, pagination, and selection
source: ui/src/components/DataTable
status: stable
category: Data Display
props:
  - name: data
    type: any[]
    description: Array of data objects to display
  - name: columns
    type: DataTableColumn[]
    description: Column configuration array
  - name: sortBy
    type: DataTableSort[]
    description: Current sort configuration
  - name: onSortChange
    type: function
    description: Callback when sort changes
  - name: pagination
    type: DataTablePagination
    description: Pagination configuration
  - name: onPaginationChange
    type: function
    description: Callback when pagination changes
  - name: selectedRows
    type: (string|number)[]
    description: Array of selected row IDs
  - name: onRowSelectionChange
    type: function
    description: Callback when row selection changes
  - name: loading
    type: boolean
    description: Whether table is in loading state
    default: false
  - name: striped
    type: boolean
    description: Whether to show striped rows
    default: false
  - name: highlightOnHover
    type: boolean
    description: Whether to highlight rows on hover
    default: true
  - name: verticalSpacing
    type: string
    description: Vertical spacing between rows
    default: md
examples:
  - basic
  - comprehensive
---

The DataTable component provides a feature-rich interface for displaying tabular data with sorting, pagination, row selection, and customizable columns.
