import { useMemo, useState } from 'react';
import { Button, Card, Column, DataTable, Row, Text } from '@platform-blocks/ui';
import type { DataTableColumn, DataTableFilter, DataTableSort } from '@platform-blocks/ui';

type Employee = {
  id: number;
  name: string;
  department: 'Engineering' | 'Design' | 'Marketing' | 'Sales';
  status: 'active' | 'inactive';
  salary: number;
};

const rows: Employee[] = [
  { id: 1, name: 'Avery Knight', department: 'Engineering', status: 'active', salary: 125_000 },
  { id: 2, name: 'Bianca Hall', department: 'Design', status: 'active', salary: 98_500 },
  { id: 3, name: 'Caleb Fox', department: 'Marketing', status: 'inactive', salary: 72_400 },
  { id: 4, name: 'Dana Moss', department: 'Sales', status: 'active', salary: 88_100 },
  { id: 5, name: 'Enzo Reed', department: 'Engineering', status: 'inactive', salary: 112_900 },
  { id: 6, name: 'Farah Li', department: 'Sales', status: 'active', salary: 94_300 },
];

const columns: DataTableColumn<Employee>[] = [
  { key: 'name', header: 'Name', accessor: 'name', sortable: true, filterable: true, filterType: 'text' },
  {
    key: 'department',
    header: 'Department',
    accessor: 'department',
    sortable: true,
    filterable: true,
    filterType: 'select',
    filterOptions: [
      { label: 'Engineering', value: 'Engineering' },
      { label: 'Design', value: 'Design' },
      { label: 'Marketing', value: 'Marketing' },
      { label: 'Sales', value: 'Sales' },
    ],
  },
  {
    key: 'status',
    header: 'Status',
    accessor: 'status',
    sortable: true,
    filterable: true,
    filterType: 'select',
    filterOptions: [
      { label: 'Active', value: 'active' },
      { label: 'Inactive', value: 'inactive' },
    ],
  },
  {
    key: 'salary',
    header: 'Salary',
    accessor: 'salary',
    sortable: true,
    filterable: true,
    filterType: 'number',
    dataType: 'currency',
    align: 'right',
  },
];

export default function Demo() {
  const [sortBy, setSortBy] = useState<DataTableSort[]>([]);
  const [filters, setFilters] = useState<DataTableFilter[]>([]);

  const activeFilters = useMemo(() => filters.length, [filters]);

  return (
    <Column gap="lg">
      <Card p="md">
        <Column gap="md">
          <Text size="sm" colorVariant="secondary">
            Enable per-column filters to let people slice data by text, select, or numeric operators.
          </Text>
          <Row gap="sm" align="center">
            <Text size="sm" colorVariant={activeFilters ? 'primary' : 'muted'}>
              {activeFilters ? `${activeFilters} filter${activeFilters > 1 ? 's' : ''} applied` : 'No active filters'}
            </Text>
            <Button size="xs" variant="ghost" onPress={() => setFilters([])} disabled={!activeFilters}>
              Clear filters
            </Button>
          </Row>
          <DataTable
            data={rows}
            columns={columns}
            sortBy={sortBy}
            onSortChange={setSortBy}
            filters={filters}
            onFilterChange={setFilters}
            searchable
            searchPlaceholder="Search employees"
          />
        </Column>
      </Card>
    </Column>
  );
}
