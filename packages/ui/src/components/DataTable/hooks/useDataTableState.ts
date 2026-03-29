import { useState, useMemo, useCallback } from 'react';
import type { 
  DataTableFilter, 
  DataTableSort, 
  DataTablePagination,
  DataTableColumn,
  DataTableProps
} from '../types';

interface UseDataTableStateProps<T> {
  data: T[];
  columns: DataTableColumn<T>[];
  initialSortBy?: DataTableSort[];
  initialFilters?: DataTableFilter[];
  initialPagination?: DataTablePagination;
  initialSelectedRows?: (string | number)[];
  initialExpandedRows?: (string | number)[];
  initialHiddenColumns?: string[];
  getRowId?: (row: T, index: number) => string | number;
  rowFeatureToggle?: DataTableProps<T>['rowFeatureToggle'];
}

interface UseDataTableStateReturn<T> {
  // Data processing
  processedData: T[];
  totalFiltered: number;
  
  // Search state
  searchValue: string;
  setSearchValue: (value: string) => void;
  
  // Sort state  
  sortBy: DataTableSort[];
  setSortBy: (sorts: DataTableSort[]) => void;
  handleSort: (columnKey: string) => void;
  
  // Filter state
  filters: DataTableFilter[];
  setFilters: (filters: DataTableFilter[]) => void;
  activeFilters: DataTableFilter[];
  
  // Pagination state
  pagination?: DataTablePagination;
  setPagination?: (pagination: DataTablePagination) => void;
  
  // Selection state
  selectedRows: (string | number)[];
  setSelectedRows: (rows: (string | number)[]) => void;
  isAllSelected: boolean;
  isIndeterminate: boolean;
  handleRowSelect: (rowId: string | number) => void;
  handleSelectAll: () => void;
  
  // Expansion state
  expandedRows: (string | number)[];
  setExpandedRows: (rows: (string | number)[]) => void;
  handleRowExpand: (rowId: string | number) => void;
  
  // Column visibility
  hiddenColumns: string[];
  setHiddenColumns: (columns: string[]) => void;
  visibleColumns: DataTableColumn<T>[];
}

// Utility functions for data processing
const getValue = <T,>(row: T, accessor: keyof T | ((row: T) => any)): any => {
  if (typeof accessor === 'function') {
    return accessor(row);
  }
  return row[accessor];
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
      if (rowFeatures.filterable === false) return true;

      return filters.every(filter => {
        const column = columns.find(c => c.key === filter.column);
        if (!column) return true;

        const cellValue = getValue(row, column.accessor);
        const filterValue = filter.value;

        if (filterValue === '' || filterValue === null || filterValue === undefined) return true;

        switch (filter.operator) {
          case 'eq': return cellValue === filterValue;
          case 'ne': return cellValue !== filterValue;
          case 'lt': return cellValue < filterValue;
          case 'lte': return cellValue <= filterValue;
          case 'gt': return cellValue > filterValue;
          case 'gte': return cellValue >= filterValue;
          case 'contains': return String(cellValue).toLowerCase().includes(String(filterValue).toLowerCase());
          case 'startsWith': return String(cellValue).toLowerCase().startsWith(String(filterValue).toLowerCase());
          case 'endsWith': return String(cellValue).toLowerCase().endsWith(String(filterValue).toLowerCase());
          default: return String(cellValue).toLowerCase().includes(String(filterValue).toLowerCase());
        }
      });
    });
  }

  // Apply global search
  if (searchValue && searchValue.trim()) {
    const searchTerm = searchValue.toLowerCase().trim();
    filteredData = filteredData.filter((row, idx) => {
      const rowFeatures = rowFeatureToggle?.(row, idx) || {} as any;
      if (rowFeatures.searchable === false) return true;

      return columns.some(column => {
        const cellValue = getValue(row, column.accessor);
        return String(cellValue).toLowerCase().includes(searchTerm);
      });
    });
  }

  return filteredData;
};

export function useDataTableState<T>({
  data,
  columns,
  initialSortBy = [],
  initialFilters = [],
  initialPagination,
  initialSelectedRows = [],
  initialExpandedRows = [],
  initialHiddenColumns = [],
  getRowId = (_, index) => index,
  rowFeatureToggle
}: UseDataTableStateProps<T>): UseDataTableStateReturn<T> {
  
  // Core state
  const [searchValue, setSearchValue] = useState('');
  const [sortBy, setSortBy] = useState<DataTableSort[]>(initialSortBy);
  const [filters, setFilters] = useState<DataTableFilter[]>(initialFilters);
  const [pagination, setPagination] = useState<DataTablePagination | undefined>(initialPagination);
  const [selectedRows, setSelectedRows] = useState<(string | number)[]>(initialSelectedRows);
  const [expandedRows, setExpandedRows] = useState<(string | number)[]>(initialExpandedRows);
  const [hiddenColumns, setHiddenColumns] = useState<string[]>(initialHiddenColumns);

  // Computed values
  const visibleColumns = useMemo(() => 
    columns.filter(col => !hiddenColumns.includes(col.key)), 
    [columns, hiddenColumns]
  );

  const activeFilters = useMemo(() => 
    filters.filter(f => f.value !== '' && f.value !== null && f.value !== undefined),
    [filters]
  );

  const processedData = useMemo(() => {
    let result = filterData(data, activeFilters, columns, searchValue, rowFeatureToggle);
    result = sortData(result, sortBy, columns);
    return result;
  }, [data, activeFilters, columns, searchValue, sortBy, rowFeatureToggle]);

  const totalFiltered = processedData.length;

  // Selection computed values
  const allRowIds = useMemo(() => 
    processedData.map((row, index) => getRowId(row, index)), 
    [processedData, getRowId]
  );

  const isAllSelected = selectedRows.length > 0 && selectedRows.length === allRowIds.length;
  const isIndeterminate = selectedRows.length > 0 && selectedRows.length < allRowIds.length;

  // Event handlers
  const handleSort = useCallback((columnKey: string) => {
    const currentSort = sortBy.find(s => s.column === columnKey);
    let newDirection: 'asc' | 'desc' | null = 'asc';
    
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

    setSortBy(newSort);
  }, [sortBy]);

  const handleRowSelect = useCallback((rowId: string | number) => {
    const isSelected = selectedRows.includes(rowId);
    if (isSelected) {
      setSelectedRows(selectedRows.filter(id => id !== rowId));
    } else {
      setSelectedRows([...selectedRows, rowId]);
    }
  }, [selectedRows]);

  const handleSelectAll = useCallback(() => {
    if (isAllSelected) {
      setSelectedRows([]);
    } else {
      setSelectedRows(allRowIds);
    }
  }, [isAllSelected, allRowIds]);

  const handleRowExpand = useCallback((rowId: string | number) => {
    const isExpanded = expandedRows.includes(rowId);
    if (isExpanded) {
      setExpandedRows(expandedRows.filter(id => id !== rowId));
    } else {
      setExpandedRows([...expandedRows, rowId]);
    }
  }, [expandedRows]);

  return {
    // Data processing
    processedData,
    totalFiltered,
    
    // Search state
    searchValue,
    setSearchValue,
    
    // Sort state
    sortBy,
    setSortBy,
    handleSort,
    
    // Filter state
    filters,
    setFilters,
    activeFilters,
    
    // Pagination state
    pagination,
    setPagination,
    
    // Selection state
    selectedRows,
    setSelectedRows,
    isAllSelected,
    isIndeterminate,
    handleRowSelect,
    handleSelectAll,
    
    // Expansion state
    expandedRows,
    setExpandedRows,
    handleRowExpand,
    
    // Column visibility
    hiddenColumns,
    setHiddenColumns,
    visibleColumns,
  };
}