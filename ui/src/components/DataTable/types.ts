import React from 'react';
import { SpacingProps } from '../../core/utils';

// Core type aliases
export type SortDirection = 'asc' | 'desc' | null;
export type FilterType = 'text' | 'number' | 'select' | 'date' | 'boolean';
export type ColumnDataType = 'text' | 'number' | 'date' | 'boolean' | 'currency' | 'percentage';

export interface DataTableColumn<T = any> {
  /** Unique identifier for the column */
  key: string;
  /** Display header for the column */
  header: React.ReactNode;
  /** Accessor function or key path */
  accessor: keyof T | ((row: T) => any);
  /** Custom cell renderer */
  cell?: (value: any, row: T, index: number) => React.ReactNode;
  /** Whether column is sortable */
  sortable?: boolean;
  /** Optional custom comparison function overriding default sorting */
  compare?: (a: any, b: any, rowA: T, rowB: T) => number;
  /** Whether column is filterable */
  filterable?: boolean;
  /** Filter type for this column */
  filterType?: FilterType;
  /** Filter options for select filter type */
  filterOptions?: Array<{ label: string; value: any }>;
  /** Preferred width */
  width?: number | string;
  /** Minimum width */
  minWidth?: number;
  /** Maximum width */
  maxWidth?: number;
  /** Whether the user can resize this column */
  resizable?: boolean;
  /** Whether cells in this column are editable (when table in edit mode) */
  editable?: boolean;
  /** Validation function returning an error message or null */
  validate?: (value: any) => string | null;
  /** Data type for formatting & validation */
  dataType?: ColumnDataType;
  /** Text alignment */
  align?: 'left' | 'center' | 'right';
  /** Sticky positioning */
  sticky?: 'left' | 'right';
}

export interface DataTableFilter {
  column: string;
  value: any;
  operator: 'eq' | 'ne' | 'lt' | 'lte' | 'gt' | 'gte' | 'contains' | 'startsWith' | 'endsWith';
}

export interface DataTableSort {
  column: string;
  direction: SortDirection;
}

export interface DataTablePagination {
  page: number;
  pageSize: number;
  total: number;
}

export interface DataTableProps<T = any> extends SpacingProps {
  /** Stable id for user preference persistence */
  id?: string;
  /** Data rows */
  data: T[];
  /** Column definitions */
  columns: DataTableColumn<T>[];
  /** Loading state */
  loading?: boolean;
  /** Error message (when defined overrides table body) */
  error?: string | null;
  /** Message to display when there is no data */
  emptyMessage?: string;
  /** Enable global search input */
  searchable?: boolean;
  /** Placeholder text for global search */
  searchPlaceholder?: string;
  /** Controlled global search value */
  searchValue?: string;
  /** Global search change handler */
  onSearchChange?: (value: string) => void;
  /** Current sorting state */
  sortBy?: DataTableSort[];
  /** Sorting change callback */
  onSortChange?: (sort: DataTableSort[]) => void;
  /** Active column filters */
  filters?: DataTableFilter[];
  /** Filter change callback */
  onFilterChange?: (filters: DataTableFilter[]) => void;
  /** Pagination state */
  pagination?: DataTablePagination;
  /** Pagination change handler */
  onPaginationChange?: (pagination: DataTablePagination) => void;
  /** Enable row selection */
  selectable?: boolean;
  /** Selected row identifiers */
  selectedRows?: (string | number)[];
  /** Selection change handler */
  onSelectionChange?: (selected: (string | number)[]) => void;
  /** Function to extract a stable id for each row */
  getRowId?: (row: T, index: number) => string | number;
  /** Row click handler */
  onRowClick?: (row: T, index: number) => void;
  /** Whether table is in edit mode */
  editMode?: boolean;
  /** Edit mode toggle callback */
  onEditModeChange?: (editMode: boolean) => void;
  /** Commit cell edit */
  onCellEdit?: (rowIndex: number, columnKey: string, newValue: any) => void;
  /** Bulk action definitions */
  bulkActions?: Array<{
    /** Unique key */
    key: string;
    /** Button label */
    label: string;
    /** Optional icon */
    icon?: React.ReactNode;
    /** Action invoked with selected row ids & full data */
    action: (selectedRows: (string | number)[], data: T[]) => void;
  }>;
  /** Visual table variant */
  variant?: 'default' | 'striped' | 'bordered';
  /** Row density */
  density?: 'compact' | 'normal' | 'comfortable';
  /** Fixed table height (enables internal scroll) */
  height?: number;
  /** Enable FlashList-powered virtualization for large datasets */
  virtual?: boolean;
  /** Container style override */
  style?: any;
  /** Enable interactive column resizing */
  enableColumnResizing?: boolean;
  /** Per-row feature overrides */
  rowFeatureToggle?: (row: T, index: number) => ({
    selectable?: boolean;
    editable?: boolean;
    sortable?: boolean;
    filterable?: boolean;
    searchable?: boolean;
  } | null | undefined);
  /** Initially hidden column keys */
  initialHiddenColumns?: string[];
  /** Hidden column change callback */
  onColumnVisibilityChange?: (hidden: string[]) => void;
  /** Column settings action callback */
  onColumnSettings?: (columnKey: string) => void;
  /** Show built-in column visibility manager button */
  showColumnVisibilityManager?: boolean;
  /** Pagination size choices */
  rowsPerPageOptions?: number[];
  /** Show rows-per-page selector */
  showRowsPerPageControl?: boolean;
  /** Per-row action icon buttons (renders trailing actions column when provided) */
  rowActions?: (row: T, index: number) => Array<{
    /** Unique action key */
    key: string;
    /** Icon to display (icon-only buttons recommended) */
    icon?: React.ReactNode;
    /** Optional text label (not typically shown in compact cell) */
    label?: string;
    /** Action handler */
    onPress?: (row: T, index: number) => void;
    /** Disable this action */
    disabled?: boolean;
    /** Whether to hide this action */
    hidden?: boolean;
    /** Optional tooltip text (future enhancement; currently ignored) */
    tooltip?: string;
  }>;
  /** Width of the actions column */
  actionsColumnWidth?: number;
  /** Force striped row backgrounds regardless of variant */
  striped?: boolean;
  
  // Enhanced styling options
  /** Custom header background color */
  headerBackgroundColor?: string;
  /** Show enhanced loading skeletons instead of basic loading text */
  enhancedLoading?: boolean;
  /** Show enhanced empty state with icon and description */
  enhancedEmptyState?: boolean;
  /** Enable enhanced hover effects */
  enhancedHover?: boolean;
  /** Custom row hover color */
  hoverColor?: string;
  /** Enable enhanced selection styling */
  enhancedSelection?: boolean;
  /** Show row dividers */
  showRowDividers?: boolean;
  /** Custom border color for enhanced styling */
  borderColor?: string;
  /** Enable simple row background hover highlight */
  hoverHighlight?: boolean;
  /** Make table take full width of container */
  fullWidth?: boolean;
  
  // Border styling options
  /** Custom row border width */
  rowBorderWidth?: number;
  /** Custom row border color */
  rowBorderColor?: string;
  /** Row border style */
  rowBorderStyle?: 'solid' | 'dashed' | 'dotted';
  /** Custom column border width */
  columnBorderWidth?: number;
  /** Custom column border color */
  columnBorderColor?: string;
  /** Column border style */
  columnBorderStyle?: 'solid' | 'dashed' | 'dotted';
  /** Whether to show outer border around entire table */
  showOuterBorder?: boolean;
  /** Outer border width */
  outerBorderWidth?: number;
  /** Outer border color */
  outerBorderColor?: string;
  
  // Expandable rows
  /** Function to render expanded row content */
  expandableRowRender?: (row: T, index: number) => React.ReactNode;
  /** Initially expanded row identifiers */
  initialExpandedRows?: (string | number)[];
  /** Controlled expanded rows */
  expandedRows?: (string | number)[];
  /** Expanded rows change handler */
  onExpandedRowsChange?: (expanded: (string | number)[]) => void;
  /** Allow multiple rows to be expanded at once */
  allowMultipleExpanded?: boolean;
  /** Custom expand/collapse icons */
  expandIcon?: React.ReactNode;
  collapseIcon?: React.ReactNode;
}
