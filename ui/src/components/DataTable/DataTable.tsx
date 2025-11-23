import React, { useState, useMemo, useCallback, useRef, useEffect } from 'react';
import { View, ScrollView, Pressable, TextInput as RNTextInput, Platform } from 'react-native';
import { FlashList } from '@shopify/flash-list';
import type { ListRenderItemInfo } from '@shopify/flash-list';

import { useTheme } from '../../core';
import { useDirection } from '../../core/providers/DirectionProvider';
import { SpacingProps, getSpacingStyles, extractSpacingProps } from '../../core/utils';
import { DESIGN_TOKENS } from '../../core/design-tokens';
import { Text } from '../Text';
import { Input } from '../Input';
import { Select } from '../Select';
import { Button } from '../Button';
import { Flex } from '../Flex';
import { Menu, MenuItem, MenuLabel, MenuDivider, MenuDropdown } from '../Menu';
import { Popover } from '../Popover';
import { Checkbox } from '../Checkbox';
import { ToggleButton, ToggleGroup } from '../Toggle';
import { Pagination } from '../Pagination';
import { Table, TableTh, TableTd, TableTr } from '../Table';
import { Icon } from '../Icon';
import { Collapse } from '../Collapse';
import { useRowSelection } from './hooks/useRowSelection';
import { useDataTableState } from './hooks/useDataTableState';
import { useColumnSettings } from './hooks/useColumnSettings';
import { AdvancedFilterControl } from './AdvancedFilterControl';
import type {
  DataTableProps,
  DataTableColumn,
  DataTableFilter,
  DataTableSort,
  DataTablePagination,
  SortDirection,
  FilterType,
  ColumnDataType
} from './types';
import { ComponentWithDisclaimer } from '../_internal/Disclaimer';
import { Row } from '../Layout';
export type { DataTableProps, DataTableColumn, DataTableFilter, DataTableSort, DataTablePagination, SortDirection, FilterType, ColumnDataType } from './types';

// Types moved to separate file (types.ts)

// Utility functions
const getValue = <T,>(row: T, accessor: keyof T | ((row: T) => any)): any => {
  if (typeof accessor === 'function') {
    return accessor(row);
  }
  return row[accessor];
};

const formatValue = (value: any, dataType: ColumnDataType = 'text'): string => {
  if (value === null || value === undefined) return '';
  
  switch (dataType) {
    case 'number':
      return typeof value === 'number' ? value.toLocaleString() : String(value);
    case 'currency':
      return typeof value === 'number' ? `$${value.toLocaleString()}` : String(value);
    case 'percentage':
      return typeof value === 'number' ? `${(value * 100).toFixed(1)}%` : String(value);
    case 'date':
      return value instanceof Date ? value.toLocaleDateString() : String(value);
    case 'boolean':
      return value ? 'Yes' : 'No';
    default:
      return String(value);
  }
};

const sortData = <T,>(data: T[], sortBy: DataTableSort[], columns: DataTableColumn<T>[]): T[] => {
  if (!sortBy.length) return data;

  return [...data].sort((a, b) => {
    for (const sort of sortBy) {
      const column = columns.find(col => col.key === sort.column);
      if (!column || !sort.direction) continue;

      const aValue = getValue(a, column.accessor);
      const bValue = getValue(b, column.accessor);

      let comparison = 0;
      
      if (aValue === null || aValue === undefined) comparison = 1;
      else if (bValue === null || bValue === undefined) comparison = -1;
      else if (column.compare) {
        try { comparison = column.compare(aValue, bValue, a, b); } catch { comparison = 0; }
      } else if (typeof aValue === 'string' && typeof bValue === 'string') comparison = aValue.localeCompare(bValue);
      else if (typeof aValue === 'number' && typeof bValue === 'number') comparison = aValue - bValue;
      else if (aValue instanceof Date && bValue instanceof Date) comparison = aValue.getTime() - bValue.getTime();
      else comparison = String(aValue).localeCompare(String(bValue));

      if (comparison !== 0) {
        return sort.direction === 'desc' ? -comparison : comparison;
      }
    }
    return 0;
  });
};

const filterData = <T,>(
  data: T[], 
  filters: DataTableFilter[], 
  columns: DataTableColumn<T>[],
  searchValue?: string,
  rowFeatureToggle?: DataTableProps<T>['rowFeatureToggle']
): T[] => {
  let filteredData = data;

  // Apply column filters
  if (filters.length > 0) {
    filteredData = filteredData.filter((row, idx) => {
      const rowFeatures = rowFeatureToggle?.(row, idx) || {} as any;
      // If row is marked non-filterable, always keep it
      if (rowFeatures.filterable === false) return true;
      return filters.every(filter => {
        const column = columns.find(col => col.key === filter.column);
        if (!column) return true;

        const value = getValue(row, column.accessor);
        const filterValue = filter.value;

        switch (filter.operator) {
          case 'eq':
            return value === filterValue;
          case 'ne':
            return value !== filterValue;
          case 'lt':
            return value < filterValue;
          case 'lte':
            return value <= filterValue;
          case 'gt':
            return value > filterValue;
          case 'gte':
            return value >= filterValue;
          case 'contains':
            return String(value).toLowerCase().includes(String(filterValue).toLowerCase());
          case 'startsWith':
            return String(value).toLowerCase().startsWith(String(filterValue).toLowerCase());
          case 'endsWith':
            return String(value).toLowerCase().endsWith(String(filterValue).toLowerCase());
          default:
            return true;
        }
      });
    });
  }

  // Apply global search
  if (searchValue && searchValue.trim()) {
    const searchTerm = searchValue.toLowerCase().trim();
    filteredData = filteredData.filter((row, idx) => {
      const rowFeatures = rowFeatureToggle?.(row, idx) || {} as any;
      if (rowFeatures.searchable === false) return true; // keep regardless of search
      return columns.some(column => {
        const value = getValue(row, column.accessor);
        return String(value).toLowerCase().includes(searchTerm);
      });
    });
  }

  return filteredData;
};

// DataTable component
export const DataTable = <T,>({
  id,
  data,
  columns,
  loading = false,
  error = null,
  emptyMessage = 'No data available',
  searchable = true,
  searchPlaceholder = 'Search...',
  searchValue: controlledSearchValue,
  onSearchChange,
  sortBy = [],
  onSortChange,
  filters = [],
  onFilterChange,
  pagination,
  onPaginationChange,
  selectable = false,
  selectedRows = [],
  onSelectionChange,
  getRowId = (_, index) => index,
  onRowClick,
  editMode = false,
  onEditModeChange,
  onCellEdit,
  bulkActions = [],
  variant = 'default',
  density = 'normal',
  height,
  virtual = false,
  style,
  hoverHighlight = true,
  enableColumnResizing = false,
  rowFeatureToggle,
  initialHiddenColumns = [],
  onColumnVisibilityChange,
  onColumnSettings,
  showColumnVisibilityManager = true,
  rowsPerPageOptions = [10, 25, 50, 100],
  showRowsPerPageControl = true,
  rowActions,
  actionsColumnWidth = 100,
  fullWidth = true,
  // Border styling props
  rowBorderWidth,
  rowBorderColor,
  rowBorderStyle = 'solid',
  columnBorderWidth,
  columnBorderColor,
  columnBorderStyle = 'solid',
  showOuterBorder = false,
  outerBorderWidth = 1,
  outerBorderColor,
  // Expandable rows props
  expandableRowRender,
  initialExpandedRows = [],
  expandedRows: controlledExpandedRows,
  onExpandedRowsChange,
  allowMultipleExpanded = true,
  expandIcon,
  collapseIcon,
  ...props
}: DataTableProps<T>) => {
  const { spacingProps, otherProps } = extractSpacingProps(props);
  const theme = useTheme();
  const { isRTL } = useDirection();
  
  // Local state
  const [internalSearchValue, setInternalSearchValue] = useState('');
  const [editingCell, setEditingCell] = useState<{ row: number; column: string } | null>(null);
  const [editValue, setEditValue] = useState<any>('');
  // Uncontrolled column filters state (used when onFilterChange not provided)
  const [internalFilters, setInternalFilters] = useState<DataTableFilter[]>([]);
  // Force re-render counter for portal components
  const [forceUpdateCounter, setForceUpdateCounter] = useState(0);

  const [tempHeaderEdits, setTempHeaderEdits] = useState<Record<string, string>>({});
  const [columnWidths, setColumnWidths] = useState<Record<string, number | string>>(() => {
    const initial: Record<string, number | string> = {};
    columns.forEach(c => { if (c.width) initial[c.key] = c.width; });
    return initial;
  });
  const [hiddenColumns, setHiddenColumns] = useState<string[]>(() => {
    if (typeof window !== 'undefined' && id) {
      try {
        const raw = window.localStorage.getItem(`datatable:${id}:hiddenColumns`);
        if (raw) return JSON.parse(raw);
      } catch {
        console.warn('Failed to access localStorage for hidden columns');
      }
    }
    return initialHiddenColumns;
  });
  const [internalExpandedRows, setInternalExpandedRows] = useState<(string | number)[]>(initialExpandedRows);
  const resizingColRef = useRef<string | null>(null);
  const resizeStartX = useRef(0);
  const resizeStartWidth = useRef<number>(0);

  const searchValue = controlledSearchValue !== undefined ? controlledSearchValue : internalSearchValue;
  const expandedRows = controlledExpandedRows !== undefined ? controlledExpandedRows : internalExpandedRows;

  // Process data
  // Determine active filters (controlled vs uncontrolled)
  const activeFilters = onFilterChange ? filters : internalFilters;

  const processedData = useMemo(() => {
    // 1. Filter & search (row-level overrides considered)
    const filtered = filterData(data, activeFilters, columns, searchValue, rowFeatureToggle);

    // 2. Apply sorting only to rows permitting it; preserve original order for non-sortable rows
    let sortableRows: { row: T; originalIndex: number }[] = [];
    let fixedRows: { row: T; originalIndex: number }[] = [];
    filtered.forEach((r, i) => {
      const features = rowFeatureToggle?.(r, i) || {} as any;
      if (features.sortable === false) fixedRows.push({ row: r, originalIndex: i });
      else sortableRows.push({ row: r, originalIndex: i });
    });

    let sortedPortion = sortableRows.map(s => s.row);
    if (sortBy.length) {
      sortedPortion = sortData(sortedPortion, sortBy, columns);
    }
    // Reattach fixed rows after sorted portion, preserving relative order
    const merged = [...sortedPortion, ...fixedRows.map(f => f.row)];

    if (pagination) {
      const startIndex = (pagination.page - 1) * pagination.pageSize;
      return merged.slice(startIndex, startIndex + pagination.pageSize);
    }
    return merged;
  }, [data, activeFilters, sortBy, searchValue, pagination, columns, rowFeatureToggle]);

  const totalFiltered = useMemo(() => {
    return filterData(data, activeFilters, columns, searchValue, rowFeatureToggle).length;
  }, [data, activeFilters, columns, searchValue, rowFeatureToggle]);

  // Persist hidden columns
  useEffect(() => {
    if (typeof window !== 'undefined' && id) {
      try {
        window.localStorage.setItem(`datatable:${id}:hiddenColumns`, JSON.stringify(hiddenColumns));
      } catch {
        console.warn('Failed to access localStorage for hidden columns');
      }
    }
    onColumnVisibilityChange?.(hiddenColumns);
  }, [hiddenColumns, id, onColumnVisibilityChange]);

  const visibleColumns = useMemo(() => columns.filter(c => !hiddenColumns.includes(c.key)), [columns, hiddenColumns]);

  // Handlers
  const handleSearchChange = useCallback((value: string) => {
    if (onSearchChange) {
      onSearchChange(value);
    } else {
      setInternalSearchValue(value);
    }
  }, [onSearchChange]);

  const handleSort = useCallback((columnKey: string) => {
    if (!onSortChange) return;

    const currentSort = sortBy.find(s => s.column === columnKey);
    let newDirection: SortDirection = 'asc';
    
    if (currentSort) {
      if (currentSort.direction === 'asc') {
        newDirection = 'desc';
      } else if (currentSort.direction === 'desc') {
        newDirection = null;
      }
    }

    const newSort = sortBy.filter(s => s.column !== columnKey);
    if (newDirection) {
      newSort.unshift({ column: columnKey, direction: newDirection });
    }

    onSortChange(newSort);
  }, [sortBy, onSortChange]);

  const handleRowExpand = useCallback((rowId: string | number) => {
    const newExpanded = [...expandedRows];
    const isExpanded = newExpanded.includes(rowId);
    
    if (isExpanded) {
      // Collapse the row
      const index = newExpanded.indexOf(rowId);
      newExpanded.splice(index, 1);
    } else {
      // Expand the row
      if (!allowMultipleExpanded) {
        newExpanded.length = 0; // Clear all other expanded rows
      }
      newExpanded.push(rowId);
    }
    
    if (onExpandedRowsChange) {
      onExpandedRowsChange(newExpanded);
    } else {
      setInternalExpandedRows(newExpanded);
    }
  }, [expandedRows, allowMultipleExpanded, onExpandedRowsChange]);

  const beginResize = (e: any, column: DataTableColumn<T>) => {
    if (!enableColumnResizing || !column.resizable) return;
    const clientX = e?.nativeEvent?.pageX || e?.clientX || 0;
    resizingColRef.current = column.key;
    resizeStartX.current = clientX;
    const currentWidth = columnWidths[column.key];
    const numeric = typeof currentWidth === 'number' ? currentWidth : (column.minWidth || 120);
    resizeStartWidth.current = numeric;
    const moveListener = (ev: any) => {
      if (!resizingColRef.current) return;
      const moveX = ev.pageX || ev.touches?.[0]?.pageX || 0;
      const delta = moveX - resizeStartX.current;
      const base = resizeStartWidth.current;
      let newW = base + delta;
      if (column.minWidth) newW = Math.max(column.minWidth, newW);
      if (column.maxWidth) newW = Math.min(column.maxWidth, newW);
      setColumnWidths(w => ({ ...w, [column.key]: Math.max(40, newW) }));
    };
    const upListener = () => {
      resizingColRef.current = null;
      document.removeEventListener('mousemove', moveListener as any);
      document.removeEventListener('mouseup', upListener as any);
      document.removeEventListener('touchmove', moveListener as any);
      document.removeEventListener('touchend', upListener as any);
    };
    document.addEventListener('mousemove', moveListener as any);
    document.addEventListener('mouseup', upListener as any);
    document.addEventListener('touchmove', moveListener as any);
    document.addEventListener('touchend', upListener as any);
  };

  // Get all row IDs for current page/view
  const allRowIds = useMemo(() => 
    processedData.map((row, index) => getRowId(row, index)),
    [processedData, getRowId]
  );

  // Enhanced row selection with shift-click and range selection
  const rowSelection = useRowSelection({
    allRowIds,
    selectedRows,
    onSelectionChange,
    persistAcrossPagination: true
  });

  // Portal-based column settings
  const columnSettings = useColumnSettings({
    columns,
    onColumnUpdate: (columnKey, updates) => {
      // Handle column header updates by updating temp state
      if (updates.header && typeof updates.header === 'string') {
        setTempHeaderEdits(prev => ({ ...prev, [columnKey]: updates.header as string }));
      }
    },
    onHideColumn: (columnKey) => {
      setHiddenColumns(prev => [...prev, columnKey]);
    }
  });

  const handleCellDoublePress = useCallback((rowIndex: number, columnKey: string) => {
    if (!editMode) return;
    
    const column = columns.find(col => col.key === columnKey);
    if (!column?.editable) return;

    const row = processedData[rowIndex];
    const currentValue = getValue(row, column.accessor);
    
    setEditingCell({ row: rowIndex, column: columnKey });
    setEditValue(currentValue);
  }, [editMode, columns, processedData]);

  const handleCellEditSave = useCallback(() => {
    if (!editingCell || !onCellEdit) return;

    const column = columns.find(col => col.key === editingCell.column);
    if (column?.validate) {
      const error = column.validate(editValue);
      if (error) {
        // Handle validation error
        return;
      }
    }

    onCellEdit(editingCell.row, editingCell.column, editValue);
    setEditingCell(null);
    setEditValue('');
  }, [editingCell, editValue, onCellEdit, columns]);

  const handleCellEditCancel = useCallback(() => {
    setEditingCell(null);
    setEditValue('');
  }, []);

  // Render functions
  const renderHeader = () => (
    <View style={{ 
      flexDirection: isRTL ? 'row-reverse' : 'row', 
      justifyContent: 'space-between', 
      alignItems: 'center',
      marginBottom: DESIGN_TOKENS.spacing.md,
      paddingHorizontal: DESIGN_TOKENS.spacing.xs
    }}>
      <Flex gap={DESIGN_TOKENS.spacing.md} align="center">
        {selectedRows.length > 0 && bulkActions.length > 0 && (
          <Flex gap={8}>
            <Text variant="small" colorVariant="muted">
              {selectedRows.length} selected
            </Text>
            {bulkActions.map(action => (
              <Button
                key={action.key}
                variant="outline"
                size="sm"
                startIcon={action.icon}
                onPress={() => action.action(selectedRows, data)}
              >
                {action.label}
              </Button>
            ))}
          </Flex>
        )}
      </Flex>

      <Flex gap={8}>
        {/* Search & Filter Popover */}
        {(searchable || columns.some(c => c.filterable)) && (
          <Popover position="bottom-end" offset={{ mainAxis: 12 }} width={320} trapFocus>
            <Popover.Target>
              <Button
                variant="outline"
                size="sm"
                startIcon={<Icon name="search" size={14} />}
              >
                Search
                {(searchValue || activeFilters.length > 0) && (
                  <View style={{
                    width: 6,
                    height: 6,
                    borderRadius: 3,
                    backgroundColor: theme.colors.primary[5],
                    marginLeft: 4
                  }} />
                )}
              </Button>
            </Popover.Target>
            <Popover.Dropdown>
              <Flex direction="column" gap={DESIGN_TOKENS.spacing.md} style={{ width: 320 }}>
                <Text variant="small" weight="semibold">
                  Search & Filter
                </Text>

                {searchable && (
                  <View
                    style={{
                      borderBottomWidth: 1,
                      borderBottomColor: theme.colors.gray[2],
                      paddingBottom: DESIGN_TOKENS.spacing.sm,
                    }}
                  >
                    <Flex direction="column" gap={DESIGN_TOKENS.spacing.xs}>
                      <Text variant="small" weight="semibold">
                        Search
                      </Text>
                      <Input
                        placeholder={searchPlaceholder}
                        value={searchValue}
                        onChangeText={handleSearchChange}
                        startSection={<Icon name="menu" size={16} />}
                        size="sm"
                      />
                    </Flex>
                  </View>
                )}

                {columns.some(c => c.filterable) && (
                  <Flex direction="column" gap={DESIGN_TOKENS.spacing.sm}>
                    <Flex direction="row" justify="space-between" align="center">
                      <Text variant="small" weight="semibold">
                        Filters
                      </Text>
                      {activeFilters.length > 0 && (
                        <Button
                          variant="ghost"
                          size="xs"
                          onPress={() => {
                            setInternalFilters([]);
                            setForceUpdateCounter(c => c + 1);
                          }}
                        >
                          Clear all
                        </Button>
                      )}
                    </Flex>

                    {activeFilters.length > 0 && (
                      <Flex
                        direction="column"
                        gap={DESIGN_TOKENS.spacing.xs}
                        style={{ marginBottom: DESIGN_TOKENS.spacing.sm }}
                      >
                        {activeFilters.map((filter, idx) => {
                          const column = columns.find(c => c.key === filter.column);
                          return (
                            <View
                              key={idx}
                              style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                                backgroundColor: theme.colors.primary[1],
                                paddingHorizontal: DESIGN_TOKENS.spacing.sm,
                                paddingVertical: DESIGN_TOKENS.spacing.xs,
                                borderRadius: DESIGN_TOKENS.radius.sm,
                                gap: DESIGN_TOKENS.spacing.xs
                              }}
                            >
                              <Text variant="small" style={{ color: theme.colors.primary[7] }}>
                                {column?.header || filter.column}: {filter.operator} "{filter.value}"
                              </Text>
                              <Pressable
                                onPress={() => {
                                  setInternalFilters(filters => filters.filter((_, i) => i !== idx));
                                  setForceUpdateCounter(c => c + 1);
                                }}
                              >
                                <Icon name="x" size={12} color={theme.colors.primary[6]} />
                              </Pressable>
                            </View>
                          );
                        })}
                      </Flex>
                    )}

                    <Flex direction="column" gap={DESIGN_TOKENS.spacing.sm}>
                      {columns.filter(c => c.filterable).map(column => {
                        const currentFilter = getColumnFilter(column.key);
                        return (
                          <View key={`${column.key}-${currentFilter?.value || 'no-filter'}`}>
                            {renderFilterControl(column)}
                          </View>
                        );
                      })}
                    </Flex>
                  </Flex>
                )}
              </Flex>
            </Popover.Dropdown>
          </Popover>
        )}
        
        {onEditModeChange && (
          <Button
            variant={editMode ? 'filled' : 'outline'}
            size="sm"
            onPress={() => onEditModeChange(!editMode)}
          >
            {editMode ? 'Exit Edit' : 'Edit'}
          </Button>
        )}
        {showColumnVisibilityManager && (
          <Popover position="bottom-end" offset={{ mainAxis: 12 }} width={280} trapFocus>
            <Popover.Target>
              <Button
                variant="outline"
                size="sm"
                startIcon={<Icon name="eye" size={14} />}
              >
                Columns
              </Button>
            </Popover.Target>
            <Popover.Dropdown>
              <View style={{ padding: 8, maxHeight: 300, width: 260 }}>
                <ComponentWithDisclaimer
                  disclaimer="Selected view determines the layout style"
                  disclaimerProps={{ colorVariant: 'muted', size: 'sm' }}
                >
                  <Row>
                    <Button
                      size="xs"
                      title="Deselect All"
                      variant={
                        hiddenColumns.length === columns.length ? 'filled' : 'outline'
                      }
                      onPress={() => setHiddenColumns(columns.map(c => c.key))}
                      style={{ marginBottom: 8 }}
                    />
                    <Button
                      size="xs"
                      title="Select All"
                      variant={
                        hiddenColumns.length === 0 ? 'filled' : 'outline'
                      }
                      onPress={() => setHiddenColumns([])}
                      style={{ marginBottom: 8 }}
                    />
                  </Row>
                </ComponentWithDisclaimer>

                <ScrollView style={{ maxHeight: 200 }}>
                  {columns.map(col => (
                    <Checkbox
                      key={col.key}
                      label={tempHeaderEdits[col.key] || col.header}
                      onChange={() => {
                        if (hiddenColumns.includes(col.key)) {
                          setHiddenColumns(prev => prev.filter(h => h !== col.key));
                        } else {
                          setHiddenColumns(prev => [...prev, col.key]);
                        }
                      }}
                      style={{ marginBottom: 4 }}
                    />
                  ))}
                </ScrollView>
              </View>
            </Popover.Dropdown>
          </Popover>
        )}
      </Flex>
    </View>
  );

  const renderCell = useCallback((column: DataTableColumn<T>, row: T, rowIndex: number) => {
    const value = getValue(row, column.accessor);
    const isEditing = editingCell?.row === rowIndex && editingCell?.column === column.key;

    if (isEditing && column.editable) {
      return (
        <RNTextInput
          value={String(editValue)}
          onChangeText={setEditValue}
          onBlur={handleCellEditSave}
          onSubmitEditing={handleCellEditSave}
          autoFocus
          style={{
            borderWidth: 1,
            borderColor: theme.colors.primary[5],
            borderRadius: 4,
            backgroundColor: theme.colors.gray[0],
            color: theme.text.primary,
            fontSize: DESIGN_TOKENS.typography.fontSize.sm
          }}
        />
      );
    }

    if (column.cell) {
      return column.cell(value, row, rowIndex);
    }

    return (
      <Text
        variant="p"
        style={{ textAlign: column.align || 'left', color: theme.text.primary }}
      >
        {formatValue(value, column.dataType)}
      </Text>
    );
  }, [editValue, editingCell, handleCellEditSave, theme]);

  const getSortIcon = (columnKey: string) => {
    const sort = sortBy.find(s => s.column === columnKey);
    if (!sort?.direction) return undefined;
    return sort.direction === 'asc' ? 'chevron-up' : 'chevron-down';
  };

  const updateFilter = useCallback((columnKey: string, value: any, operator?: DataTableFilter['operator']) => {
    const op: DataTableFilter['operator'] = operator || 'contains';
    if (onFilterChange) {
      // Controlled mode - derive next filters array from provided filters prop
      const next = (filters || []).filter(f => f.column !== columnKey);
      if (value !== '' && value !== null && value !== undefined) {
        next.push({ column: columnKey, value, operator: op });
      }
      onFilterChange(next);
    } else {
      setInternalFilters(prev => {
        const next = prev.filter(f => f.column !== columnKey);
        if (value !== '' && value !== null && value !== undefined) {
          next.push({ column: columnKey, value, operator: op });
        }
        return next;
      });
    }
    setForceUpdateCounter(c => c + 1);
  }, [onFilterChange, filters]);

  const clearFilter = useCallback((columnKey: string) => {
    updateFilter(columnKey, undefined);
  }, [updateFilter]);

  const getColumnFilter = useCallback((columnKey: string) => {
    return (onFilterChange ? filters : internalFilters).find(f => f.column === columnKey);
  }, [onFilterChange, filters, internalFilters]);

  const renderFilterControl = (col: DataTableColumn<T>) => {
    const currentFilter = getColumnFilter(col.key);
    
    return (
      <AdvancedFilterControl
        column={col}
        currentFilter={currentFilter}
        data={data}
        onFilterChange={(filter) => {
          if (filter) {
            updateFilter(filter.column, filter.value, filter.operator);
          } else {
            clearFilter(col.key);
          }
        }}
      />
    );
  };

  const headerRow = (
    <TableTr style={{
      backgroundColor: theme.colors.gray[0],
      borderBottomWidth: 2,
      borderBottomColor: theme.colors.gray[3]
    }}>
      {selectable && (
        <TableTh w={50}>
          <Pressable
            onPress={rowSelection.toggleAll}
            style={{
              width: 20,
              height: 20,
              borderWidth: 2,
              borderColor: theme.colors.primary[5],
              borderRadius: 4,
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: rowSelection.isAllSelected
                ? theme.colors.primary[5]
                : rowSelection.isIndeterminate
                ? theme.colors.primary[3]
                : 'transparent'
            }}
          >
            {rowSelection.isAllSelected && (
              <Icon name="check" size={14} color="white" />
            )}
            {rowSelection.isIndeterminate && (
              <Icon name="minus" size={14} color="white" />
            )}
          </Pressable>
        </TableTh>
      )}

      {expandableRowRender && <TableTh w={50} />}

      {visibleColumns.map(column => {
        const width = columnWidths[column.key] || column.width;
        return (
          <TableTh
            key={column.key}
            w={width}
            minWidth={column.minWidth}
            maxWidth={column.maxWidth}
            align={column.align}
            style={{
              position: 'relative',
              // paddingVertical: 16,
              backgroundColor: theme.colors.gray[0]
            }}
          >
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent:
                  column.align === 'center'
                    ? 'center'
                    : column.align === 'right'
                      ? 'flex-end'
                      : 'flex-start'
              }}
            >
              <Pressable
                onPress={() => column.sortable && handleSort(column.key)}
                style={{ flexDirection: 'row', alignItems: 'center' }}
              >
                <Text
                  variant="p"
                  weight="semibold"
                  style={{
                    color: theme.text.primary,
                    fontSize: DESIGN_TOKENS.typography.fontSize.sm,
                    letterSpacing: 0.5,
                    flexDirection: 'row',
                    display: 'flex'
                  }}
                >
                  {column.header}
                </Text>
                {getColumnFilter(column.key) && (
                  <View
                    style={{
                      width: 6,
                      height: 6,
                      borderRadius: 3,
                      backgroundColor: theme.colors.primary[5],
                      marginLeft: 6
                    }}
                  />
                )}
                {column.sortable && (
                  <View
                    style={{
                      marginLeft: 6,
                      // padding: 2,
                      borderRadius: 4,
                      backgroundColor: getSortIcon(column.key)
                        ? theme.colors.primary[1]
                        : 'transparent'
                    }}
                  >
                    <Icon
                      name={getSortIcon(column.key) || 'chevron-up'}
                      size={14}
                      color={
                        getSortIcon(column.key)
                          ? theme.colors.primary[6]
                          : theme.colors.gray[4]
                      }
                      style={{ opacity: getSortIcon(column.key) ? 1 : 0.5 }}
                    />
                  </View>
                )}
              </Pressable>
              <Menu position="bottom-end" offset={4}>
                <MenuDropdown>
                  <MenuLabel>
                    {typeof column.header === 'string' ? column.header : 'Column'}
                  </MenuLabel>
                  <MenuItem
                    startSection={<Icon name="eye" size={14} color={theme.colors.gray[7]} />}
                    disabled={visibleColumns.length === 1}
                    onPress={() => {
                      if (visibleColumns.length === 1) return;
                      setHiddenColumns(h => [...new Set([...h, column.key])]);
                    }}
                  >
                    Hide column
                  </MenuItem>
                  {column.sortable && (
                    <MenuItem
                      startSection={<Icon name="chevron-up" size={14} color={theme.colors.gray[7]} />}
                      onPress={() =>
                        onSortChange && onSortChange([{ column: column.key, direction: 'asc' }])
                      }
                    >
                      Sort ascending
                    </MenuItem>
                  )}
                  {column.sortable && (
                    <MenuItem
                      startSection={<Icon name="chevron-down" size={14} color={theme.colors.gray[7]} />}
                      onPress={() =>
                        onSortChange && onSortChange([{ column: column.key, direction: 'desc' }])
                      }
                    >
                      Sort descending
                    </MenuItem>
                  )}
                  <MenuDivider />
                  <MenuItem
                    startSection={<Icon name="knobs" size={14} color={theme.colors.gray[7]} />}
                    onPress={() => {
                      if (onColumnSettings) {
                        onColumnSettings(column.key);
                      } else {
                        columnSettings.openColumnSettings(column.key, null);
                      }
                    }}
                  >
                    Column settings
                  </MenuItem>
                </MenuDropdown>
                <Pressable
                  onPress={() => {}}
                  style={({ pressed }) => ({
                    padding: 4,
                    marginLeft: 4,
                    borderRadius: 4,
                    opacity: pressed ? 0.6 : 1
                  })}
                >
                  <Icon name="dots" size={16} color={theme.colors.gray[5]} />
                </Pressable>
              </Menu>

  <Pressable
                  onPress={() => {}}
                  style={({ pressed }) => ({
                    padding: 4,
                    marginLeft: 4,
                    borderRadius: 4,
                    opacity: pressed ? 0.6 : 1
                  })}
                >
                  <Icon name="filter" size={16} color={theme.colors.gray[5]} 
                  variant={getColumnFilter(column.key) ? 'filled' : 'outlined'}
                  />
                </Pressable>
            
              {/* Filter menu */}
            </View>
            {enableColumnResizing && column.resizable && (
              <Pressable
                onPress={e => e.stopPropagation?.()}
                onStartShouldSetResponder={() => true}
                onResponderGrant={e => beginResize(e, column)}
                style={{
                  position: 'absolute',
                  right: -4,
                  top: 0,
                  bottom: 0,
                  width: 8,
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <View
                  style={{
                    width: 2,
                    height: '60%',
                    backgroundColor: theme.colors.gray[3],
                    borderRadius: 1
                  }}
                />
              </Pressable>
            )}
          </TableTh>
        );
      })}
    </TableTr>
  );

  const emptyStateRow = (
    <TableTr>
      <TableTd
        style={{
          // padding: 60,
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <View style={{ alignItems: 'center' }}>
          <View
            style={{
              width: 64,
              // height: 64,
              borderRadius: 32,
              backgroundColor: theme.colors.gray[1],
              alignItems: 'center',
              justifyContent: 'center',
              // marginBottom: 16
            }}
          >
            <Icon name="menu" size={24} color={theme.colors.gray[5]} />
          </View>
          <Text
            variant="h6"
            colorVariant="muted"
            style={{ marginBottom: 8, fontWeight: '600' }}
          >
            No Data Available
          </Text>
          <Text
            variant="p"
            colorVariant="muted"
            style={{ textAlign: 'center', maxWidth: 280 }}
          >
            {emptyMessage ||
              'There are no items to display. Try adjusting your filters or add some data.'}
          </Text>
        </View>
      </TableTd>
    </TableTr>
  );

  const buildRow = useCallback((row: T, rowIndex: number) => {
    const rowId = getRowId(row, rowIndex);
    const isSelected = rowSelection.isRowSelected(rowId);
    const rowFeatures = rowFeatureToggle?.(row, rowIndex) || {};
    const rowSelectable =
      rowFeatures.selectable !== undefined ? rowFeatures.selectable : selectable;

    const isExpanded = expandedRows.includes(rowId);
    const totalColumns =
      (selectable ? 1 : 0) + (expandableRowRender ? 1 : 0) + visibleColumns.length + (rowActions ? 1 : 0);

    const rowElement = (
      <>
        <TableTr
          selected={isSelected}
          onPress={() => onRowClick?.(row, rowIndex)}
          style={{
            backgroundColor: isSelected
              ? theme.colors.primary[1]
              : variant === 'striped' && rowIndex % 2 === 1
                ? theme.colors.gray[0]
                : 'transparent',
            borderBottomWidth: rowBorderWidth || (variant === 'bordered' ? 1 : 0),
            borderBottomColor: rowBorderColor || theme.colors.gray[2],
            borderBottomStyle: rowBorderStyle,
            minHeight: density === 'compact' ? 40 : density === 'comfortable' ? 56 : 48
          }}
        >
          {rowSelectable && (
            <TableTd>
              <Pressable
                onPress={() => rowSelection.toggleRow(rowId)}
                style={{
                  width: 20,
                  height: 20,
                  borderWidth: 2,
                  borderColor: isSelected ? theme.colors.primary[5] : theme.colors.gray[4],
                  borderRadius: 4,
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: isSelected ? theme.colors.primary[5] : 'transparent',
                  boxShadow: isSelected ? `0 1px 2px ${theme.colors.primary[5]}33` : 'none'
                }}
              >
                {isSelected && <Icon name="check" size={14} color="white" />}
              </Pressable>
            </TableTd>
          )}

          {expandableRowRender && (
            <TableTd>
              <Pressable
                onPress={() => handleRowExpand(rowId)}
                style={{
                  width: 24,
                  height: 24,
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: 4
                }}
              >
                {isExpanded
                  ? collapseIcon || (
                      <Icon name="chevron-down" size={16} color={theme.colors.gray[6]} />
                    )
                  : expandIcon || (
                      <Icon name="chevron-right" size={16} color={theme.colors.gray[6]} />
                    )}
              </Pressable>
            </TableTd>
          )}

          {visibleColumns.map(column => (
            <Pressable
              key={column.key}
              onPress={() => handleCellDoublePress(rowIndex, column.key)}
              style={{
                flex: 1,
                width:
                  typeof columnWidths[column.key] === 'number'
                    ? (columnWidths[column.key] as number)
                    : undefined
              }}
            >
              <TableTd
                align={column.align}
                style={{
                  borderRightWidth: columnBorderWidth || 0,
                  borderRightColor: columnBorderColor || theme.colors.gray[2]
                }}
              >
                {renderCell(column, row, rowIndex)}
              </TableTd>
            </Pressable>
          ))}
          {rowActions && (
            <TableTd align="center" style={{ width: actionsColumnWidth }}>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'flex-end',
                  gap: DESIGN_TOKENS.spacing.xs
                }}
              >
                {rowActions(row, rowIndex)
                  ?.filter(action => !action.hidden)
                  .map(action => (
                    <Pressable
                      key={action.key}
                      onPress={() => action.onPress?.(row, rowIndex)}
                      disabled={action.disabled}
                      style={({ pressed }) => ({
                        opacity: action.disabled ? 0.4 : pressed ? 0.6 : 1,
                        padding: 8,
                        borderRadius: 6,
                        flexDirection: 'row',
                        alignItems: 'center',
                        backgroundColor: pressed ? theme.colors.gray[1] : 'transparent',
                        borderWidth: 1,
                        borderColor: 'transparent'
                      })}
                    >
                      {action.icon || (
                        <Icon name="menu" size={16} color={theme.colors.gray[6]} />
                      )}
                    </Pressable>
                  ))}
              </View>
            </TableTd>
          )}
        </TableTr>

        {expandableRowRender && (
          <TableTr style={{ borderBottomWidth: 0 }}>
            <TableTd
              colSpan={totalColumns}
              style={{ padding: 0, backgroundColor: theme.colors.gray[0] }}
            >
              <Collapse isCollapsed={isExpanded} duration={250}>
                <View style={{ padding: 16 }}>{expandableRowRender(row, rowIndex)}</View>
              </Collapse>
            </TableTd>
          </TableTr>
        )}
      </>
    );

    return { key: String(rowId), element: rowElement };
  }, [actionsColumnWidth, collapseIcon, columnBorderColor, columnBorderWidth, columnWidths, density, expandableRowRender, expandIcon, expandedRows, getRowId, handleCellDoublePress, handleRowExpand, onRowClick, renderCell, rowActions, rowBorderColor, rowBorderStyle, rowBorderWidth, rowFeatureToggle, rowSelection, selectable, theme, variant, visibleColumns]);

  const nonVirtualRows = useMemo(() => {
    if (virtual) return null;
    return processedData.map((row, rowIndex) => {
      const { key, element } = buildRow(row, rowIndex);
      return <React.Fragment key={key}>{element}</React.Fragment>;
    });
  }, [buildRow, processedData, virtual]);

  const estimatedRowHeight =
    density === 'compact' ? 44 : density === 'comfortable' ? 60 : 52;
  const estimatedItemSize = expandableRowRender ? estimatedRowHeight + 120 : estimatedRowHeight;

  const flashListSizingProps = useMemo(() => ({ estimatedItemSize }), [estimatedItemSize]);
  const flashListExtraData = useMemo(() => ({
    expandedRows,
    selectedRows: rowSelection.selectedRows,
    columnWidths,
    visibleColumns: visibleColumns.map(col => col.key)
  }), [columnWidths, expandedRows, rowSelection.selectedRows, visibleColumns]);

  const renderVirtualRow = useCallback(({ item, index }: ListRenderItemInfo<T>) => {
    const { element } = buildRow(item, index);
    return <React.Fragment>{element}</React.Fragment>;
  }, [buildRow]);

  const minWidthValue = fullWidth ? undefined : 800;
  const resolvedHeight = height ?? (virtual ? 420 : undefined);

  const tableBorderStyle = {
    height: resolvedHeight,
    borderWidth: showOuterBorder ? outerBorderWidth : 0,
    borderColor: outerBorderColor || theme.colors.gray[3],
    borderRadius: showOuterBorder ? 8 : 0
  } as const;

  if (loading) {
    return (
      <View style={[getSpacingStyles(spacingProps), style]} {...otherProps}>
        {renderHeader()}

        <Table
          striped={variant === 'striped'}
          withTableBorder={variant === 'bordered'}
          withRowBorders={variant !== 'default'}
          verticalSpacing={density === 'compact' ? 'xs' : density === 'comfortable' ? 'lg' : 'sm'}
          fullWidth={fullWidth}
        >
          <TableTr style={{ backgroundColor: theme.colors.gray[0] }}>
            {selectable && (
              <TableTh w={50}>
                <View style={{ width: 20, height: 20, backgroundColor: theme.colors.gray[2], borderRadius: 4 }} />
              </TableTh>
            )}
            {expandableRowRender && (
              <TableTh w={50}>
                <View style={{ width: 20, height: 20, backgroundColor: theme.colors.gray[2], borderRadius: 4 }} />
              </TableTh>
            )}
            {visibleColumns.map(column => (
              <TableTh key={column.key} w={column.width || columnWidths[column.key]} minWidth={column.minWidth}>
                <View
                  style={{
                    height: 20,
                    backgroundColor: theme.colors.gray[2],
                    borderRadius: 4,
                    width: '70%'
                  }}
                />
              </TableTh>
            ))}
          </TableTr>

          {Array.from({ length: pagination?.pageSize || 5 }).map((_, index) => (
            <TableTr key={index} hoverable={hoverHighlight}>
              {selectable && (
                <TableTd>
                  <View style={{ width: 20, height: 20, backgroundColor: theme.colors.gray[1], borderRadius: 4 }} />
                </TableTd>
              )}
              {expandableRowRender && (
                <TableTd>
                  <View style={{ width: 20, height: 20, backgroundColor: theme.colors.gray[1], borderRadius: 4 }} />
                </TableTd>
              )}
              {visibleColumns.map(column => (
                <TableTd key={column.key}>
                  <View
                    style={{
                      height: 16,
                      backgroundColor: theme.colors.gray[1],
                      borderRadius: 4,
                      width: `${Math.random() * 60 + 40}%`,
                      opacity: 0.8 - index * 0.1
                    }}
                  />
                </TableTd>
              ))}
            </TableTr>
          ))}
        </Table>
      </View>
    );
  }

  if (error) {
    return (
      <View style={[getSpacingStyles(spacingProps), style]} {...otherProps}>
        {renderHeader()}

        <View
          style={{
            alignItems: 'center',
            backgroundColor: theme.colors.error[0],
            borderRadius: theme.radii.lg,
            borderWidth: 1,
            borderColor: theme.colors.error[2]
          }}
        >
          <Icon name="error" size={32} color={theme.colors.error[5]} style={{ marginBottom: 12 }} />
          <Text variant="h6" color={theme.colors.error[7]} style={{ marginBottom: 8 }}>
            Error Loading Data
          </Text>
          <Text variant="p" colorVariant="muted" style={{ textAlign: 'center' }}>
            {error}
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View style={[getSpacingStyles(spacingProps), style]} {...otherProps}>
      {renderHeader()}

      {virtual ? (
        <View style={[{ width: '100%', overflow: 'hidden' }, tableBorderStyle]}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={Platform.OS === 'web'}
            contentContainerStyle={minWidthValue ? { minWidth: minWidthValue } : undefined}
          >
            <View style={{ flex: 1 }}>
              <Table
                striped={variant === 'striped'}
                withTableBorder={variant === 'bordered'}
                withRowBorders={variant !== 'default'}
                verticalSpacing={
                  density === 'compact' ? 'xs' : density === 'comfortable' ? 'lg' : 'sm'
                }
                fullWidth={fullWidth}
              >
                {headerRow}
              </Table>

              {processedData.length === 0 ? (
                <Table
                  striped={variant === 'striped'}
                  withTableBorder={variant === 'bordered'}
                  withRowBorders={variant !== 'default'}
                  verticalSpacing={
                    density === 'compact' ? 'xs' : density === 'comfortable' ? 'lg' : 'sm'
                  }
                  fullWidth={fullWidth}
                >
                  {emptyStateRow}
                </Table>
              ) : (
                <FlashList
                  data={processedData}
                  keyExtractor={(item, index) => String(getRowId(item, index))}
                  renderItem={renderVirtualRow}
                  {...(flashListSizingProps as Record<string, unknown>)}
                  extraData={flashListExtraData}
                  contentContainerStyle={{ flexGrow: 1 }}
                  showsVerticalScrollIndicator={Platform.OS === 'web'}
                />
              )}
            </View>
          </ScrollView>
        </View>
      ) : (
        // <TableScrollContainer style={tableBorderStyle} minWidth={minWidthValue}>
          <Table
            striped={variant === 'striped'}
            withTableBorder={variant === 'bordered'}
            withRowBorders={variant !== 'default'}
            verticalSpacing={
              density === 'compact' ? 'xs' : density === 'comfortable' ? 'lg' : 'sm'
            }
            fullWidth//</TableScrollContainer>={fullWidth}
          >
            {headerRow}
            {processedData.length === 0 ? emptyStateRow : nonVirtualRows}
          </Table>
        // </TableScrollContainer>
      )}

      {/* Enhanced Pagination */}
      {pagination && onPaginationChange && (
        <View style={{ 
          marginTop: DESIGN_TOKENS.spacing.xl, 
          width: '100%',
          paddingTop: DESIGN_TOKENS.spacing.md,
          borderTopWidth: 1,
          borderTopColor: theme.colors.gray[2]
        }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: DESIGN_TOKENS.spacing.md, flexWrap: 'wrap' }}>
            {showRowsPerPageControl && (
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: DESIGN_TOKENS.spacing.md }}>
                <Text variant="p" colorVariant="muted" style={{ fontSize: DESIGN_TOKENS.typography.fontSize.sm }}>Rows per page:</Text>
                <Menu position="top-start" offset={4}>
                  <MenuDropdown>
                    <MenuLabel>Rows per page</MenuLabel>
                    {rowsPerPageOptions.map(size => (
                      <MenuItem
                        key={size}
                        onPress={() => {
                          if (size === pagination.pageSize) return;
                          const newTotalPages = Math.max(1, Math.ceil(totalFiltered / size));
                          let newPage = pagination.page;
                          if (newPage > newTotalPages) newPage = newTotalPages;
                          // Prefer resetting to 1 for UX clarity
                          newPage = 1;
                          onPaginationChange({ ...pagination, page: newPage, pageSize: size });
                        }}
                        startSection={size === pagination.pageSize ? <Icon name="check" size={14} color={theme.colors.primary[6]} /> : undefined}
                      >{size}</MenuItem>
                    ))}
                    {!rowsPerPageOptions.includes(pagination.pageSize) && (
                      <MenuItem disabled>
                        {pagination.pageSize}
                      </MenuItem>
                    )}
                    <MenuDivider />
                    <MenuItem onPress={() => onPaginationChange({ ...pagination, page: 1 })}>First page</MenuItem>
                  </MenuDropdown>
                  <Button 
                    variant="outline" 
                    size="xs" 
                    startIcon={<Icon name="menu" size={12} />}
                    style={{
                      borderColor: theme.colors.gray[3],
                      backgroundColor: theme.colors.surface[0]
                    }}
                  >
                    {pagination.pageSize}
                  </Button>
                </Menu>
              </View>
            )}
            
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: DESIGN_TOKENS.spacing.md }}>
              <Pagination
                current={pagination.page}
                total={Math.ceil(totalFiltered / pagination.pageSize)}
                onChange={(page) => onPaginationChange({ ...pagination, page })}
              />
            </View>
            
            <Text variant="small" colorVariant="muted" style={{ 
              fontSize: DESIGN_TOKENS.typography.fontSize.xs,
              color: theme.colors.gray[6]
            }}>
              Showing {Math.min((pagination.page - 1) * pagination.pageSize + 1, totalFiltered)} to {Math.min(pagination.page * pagination.pageSize, totalFiltered)} of {totalFiltered} entries
            </Text>
          </View>
        </View>
      )}
    </View>
  );
};

export default DataTable;
