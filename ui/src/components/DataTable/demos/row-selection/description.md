# Enhanced Row Selection

A comprehensive demonstration of DataTable's advanced row selection capabilities, featuring:

## Features Demonstrated

- **Multi-row Selection**: Click checkboxes to select individual rows
- **Header Select All**: Header checkbox with indeterminate state support
- **Enhanced Visual Feedback**: Clear visual indicators for selected rows
- **Bulk Actions**: Contextual actions that appear when rows are selected
- **Persistent Selection**: Selection state maintained across pagination and filtering
- **Selection State Management**: Clear selection and select all functionality

## Selection Features

### Header Checkbox States
- **Unchecked**: No rows selected
- **Indeterminate**: Some (but not all) rows selected
- **Checked**: All visible rows selected

### Bulk Actions
When rows are selected, bulk action buttons become available:
- Activate Users
- Deactivate Users  
- Export to CSV
- Delete Users

### Visual Enhancements
- Selected rows have enhanced visual styling
- Selection count badge shows number of selected items
- Quick action buttons for common selection operations

## Technical Implementation

This demo showcases the `useRowSelection` hook integration with DataTable, providing:
- Centralized selection state management
- Event handling for row selection
- Computed properties for selection states (isAllSelected, isIndeterminate)
- Bulk operation support with selected row data

The implementation demonstrates best practices for enterprise-grade data table selection workflows.