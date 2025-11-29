import { useMemo, useState } from 'react';
import { Button, Column, DataTable, Icon, Row, Text } from '@platform-blocks/ui';
import type { DataTableColumn, DataTablePagination, DataTableSort } from '@platform-blocks/ui';

type User = {
  id: number;
  name: string;
  email: string;
  role: 'Admin' | 'Editor' | 'Viewer';
  status: 'active' | 'inactive';
  department: string;
  lastLogin: string;
};

const rows: User[] = [
  { id: 1, name: 'Olivia Carter', email: 'olivia@example.com', role: 'Admin', status: 'active', department: 'Operations', lastLogin: '2025-03-04' },
  { id: 2, name: 'Mason Ellis', email: 'mason@example.com', role: 'Editor', status: 'active', department: 'Product', lastLogin: '2025-03-03' },
  { id: 3, name: 'Aaliyah Chen', email: 'aaliyah@example.com', role: 'Viewer', status: 'inactive', department: 'Finance', lastLogin: '2025-02-13' },
  { id: 4, name: 'Gavin Brooks', email: 'gavin@example.com', role: 'Editor', status: 'active', department: 'Engineering', lastLogin: '2025-03-01' },
  { id: 5, name: 'Priya Singh', email: 'priya@example.com', role: 'Admin', status: 'active', department: 'People', lastLogin: '2025-03-05' },
  { id: 6, name: 'Henry Wolfe', email: 'henry@example.com', role: 'Viewer', status: 'inactive', department: 'Legal', lastLogin: '2025-01-28' },
  { id: 7, name: 'Noah Reed', email: 'noah@example.com', role: 'Editor', status: 'active', department: 'Sales', lastLogin: '2025-02-23' },
  { id: 8, name: 'Isla Gomez', email: 'isla@example.com', role: 'Viewer', status: 'active', department: 'Support', lastLogin: '2025-03-04' },
  { id: 9, name: 'Theo Martin', email: 'theo@example.com', role: 'Editor', status: 'active', department: 'Product', lastLogin: '2025-02-16' },
  { id: 10, name: 'Riya Patel', email: 'riya@example.com', role: 'Viewer', status: 'inactive', department: 'Operations', lastLogin: '2025-01-19' },
];

const columns: DataTableColumn<User>[] = [
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
    filterable: true,
    filterType: 'select',
    filterOptions: [
      { label: 'Admin', value: 'Admin' },
      { label: 'Editor', value: 'Editor' },
      { label: 'Viewer', value: 'Viewer' },
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
    cell: (value: User['status']) => (
      <Text colorVariant={value === 'active' ? 'success' : 'error'} weight="semibold">
        {value === 'active' ? 'Active' : 'Inactive'}
      </Text>
    ),
  },
  {
    key: 'department',
    header: 'Department',
    accessor: 'department',
    sortable: true,
  },
  {
    key: 'lastLogin',
    header: 'Last Login',
    accessor: 'lastLogin',
    sortable: true,
  },
];

const rowActions = (row: User) => [
  {
    key: 'edit',
    icon: <Icon name="edit" size={14} />,
    onPress: () => console.log('Edit', row.id),
  },
  {
    key: 'remove',
    icon: <Icon name="trash" size={14} />,
    onPress: () => console.log('Archive', row.id),
  },
];

export default function Demo() {
  const [sortBy, setSortBy] = useState<DataTableSort[]>([]);
  const [pagination, setPagination] = useState<DataTablePagination>({ page: 1, pageSize: 5, total: rows.length });
  const [selection, setSelection] = useState<(string | number)[]>([]);

  const currentPageLabel = useMemo(() => `Page ${pagination.page} of ${Math.ceil(pagination.total / pagination.pageSize)}`, [pagination]);

  return (
    <Column gap="sm" fullWidth>
      <Row justify="space-between" align="center" wrap="wrap" gap="sm">
        <Column gap="xxs">
          <Text size="sm" weight="semibold">
            Team directory
          </Text>
          <Text size="sm" colorVariant="secondary">
            Sort, filter, and select rows to manage bulk actions
          </Text>
        </Column>
        <Row gap="sm">
          <Button size="xs" variant="outline" onPress={() => setSelection([])} disabled={selection.length === 0}>
            Clear selection
          </Button>
          <Button size="xs" variant="filled">
            Invite member
          </Button>
        </Row>
      </Row>
      <Text size="sm" colorVariant="secondary">
        {selection.length ? `${selection.length} selected · ${currentPageLabel}` : currentPageLabel}
      </Text>
      <DataTable
        data={rows}
        columns={columns}
        sortBy={sortBy}
        onSortChange={setSortBy}
        pagination={pagination}
        onPaginationChange={setPagination}
        selectedRows={selection}
        onSelectionChange={setSelection}
        getRowId={(row) => row.id}
        rowActions={rowActions}
        searchable
        searchPlaceholder="Search team"
        variant="striped"
      />
    </Column>
  );
}
