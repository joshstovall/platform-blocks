import { useState } from 'react';
import { Card, Column, DataTable, Text } from '@platform-blocks/ui';
import type { DataTableColumn, DataTablePagination, DataTableSort } from '@platform-blocks/ui';

type Employee = {
  id: number;
  name: string;
  email: string;
  role: string;
  status: 'active' | 'inactive' | 'pending';
  department: string;
};

const rows: Employee[] = [
  { id: 1, name: 'Aria Chen', email: 'aria@example.com', role: 'Product Manager', status: 'active', department: 'Product' },
  { id: 2, name: 'Ben Ortiz', email: 'ben@example.com', role: 'Engineer', status: 'active', department: 'Engineering' },
  { id: 3, name: 'Carla Singh', email: 'carla@example.com', role: 'Designer', status: 'inactive', department: 'Design' },
  { id: 4, name: 'Diego Price', email: 'diego@example.com', role: 'Support', status: 'pending', department: 'Operations' },
  { id: 5, name: 'Elena Ruiz', email: 'elena@example.com', role: 'Engineer', status: 'active', department: 'Engineering' },
];

const columns: DataTableColumn<Employee>[] = [
  {
    key: 'name',
    header: 'Name',
    accessor: 'name',
    sortable: true,
    cell: (value) => <Text weight="semibold">{value}</Text>,
  },
  {
    key: 'email',
    header: 'Email',
    accessor: 'email',
    sortable: true,
  },
  {
    key: 'role',
    header: 'Role',
    accessor: 'role',
    sortable: true,
  },
  {
    key: 'status',
    header: 'Status',
    accessor: 'status',
    sortable: true,
    cell: (value: Employee['status']) => (
      <Text colorVariant={value === 'active' ? 'success' : value === 'inactive' ? 'error' : 'warning'} weight="semibold">
        {value.toUpperCase()}
      </Text>
    ),
  },
  {
    key: 'department',
    header: 'Department',
    accessor: 'department',
    sortable: true,
  },
];

export default function Demo() {
  const [sortBy, setSortBy] = useState<DataTableSort[]>([]);
  const [pagination, setPagination] = useState<DataTablePagination>({
    page: 1,
    pageSize: 4,
    total: rows.length,
  });

  return (
    <Column gap="lg">
      <Card p="md">
        <Column gap="md">
          <Text size="sm" colorVariant="secondary">
            Start with column definitions and pass the dataset directly to `DataTable` for built-in sorting and pagination.
          </Text>
          <DataTable
            data={rows}
            columns={columns}
            sortBy={sortBy}
            onSortChange={setSortBy}
            pagination={pagination}
            onPaginationChange={setPagination}
            searchable
            searchPlaceholder="Search teammates"
          />
        </Column>
      </Card>
    </Column>
  );
}
