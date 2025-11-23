import { View } from 'react-native';
import { useState } from 'react';
import { Avatar, Card, Chip, Column, DataTable, Row, Text } from '@platform-blocks/ui';
import type { DataTableColumn, DataTablePagination, DataTableSort } from '@platform-blocks/ui';

type Employee = {
  id: number;
  name: string;
  email: string;
  role: string;
  status: 'active' | 'inactive' | 'pending';
  team: string;
  performance: number;
};

const rows: Employee[] = [
  { id: 1, name: 'Sierra Lane', email: 'sierra@example.com', role: 'Engineering Manager', status: 'active', team: 'Platform', performance: 4.7 },
  { id: 2, name: 'Malik Howard', email: 'malik@example.com', role: 'Staff Engineer', status: 'active', team: 'Platform', performance: 4.5 },
  { id: 3, name: 'Anita Verma', email: 'anita@example.com', role: 'Product Designer', status: 'pending', team: 'Design', performance: 4.2 },
  { id: 4, name: 'Jon Park', email: 'jon@example.com', role: 'QA Lead', status: 'inactive', team: 'Quality', performance: 3.8 },
  { id: 5, name: 'Maya Flores', email: 'maya@example.com', role: 'Data Scientist', status: 'active', team: 'Insights', performance: 4.9 },
];

const statusColor = {
  active: '#16a34a',
  inactive: '#dc2626',
  pending: '#d97706',
} as const;

const columns: DataTableColumn<Employee>[] = [
  {
    key: 'name',
    header: 'Teammate',
    accessor: 'name',
    sortable: true,
    cell: (_value, row) => (
      <Avatar
        size="sm"
        fallback={row.name
          .split(' ')
          .map((part) => part[0])
          .join('')}
        label={<Text weight="semibold">{row.name}</Text>}
        description={<Text variant="small" colorVariant="muted">{row.role}</Text>}
        gap={8}
      />
    ),
  },
  {
    key: 'email',
    header: 'Email',
    accessor: 'email',
    sortable: true,
    cell: (value) => (
      <Text colorVariant="primary" weight="medium">
        {value}
      </Text>
    ),
  },
  {
    key: 'team',
    header: 'Team',
    accessor: 'team',
    sortable: true,
    cell: (value) => (
      <Chip size="xs" color="primary" variant="light">
        {value}
      </Chip>
    ),
  },
  {
    key: 'status',
    header: 'Status',
    accessor: 'status',
    sortable: true,
    cell: (value: Employee['status']) => (
      <Row gap="xs" align="center">
        <View
          style={{
            width: 8,
            height: 8,
            borderRadius: 4,
            backgroundColor: statusColor[value],
          }}
        />
        <Text colorVariant={value === 'inactive' ? 'error' : value === 'pending' ? 'warning' : 'success'} weight="semibold">
          {value.charAt(0).toUpperCase() + value.slice(1)}
        </Text>
      </Row>
    ),
  },
  {
    key: 'performance',
    header: 'Score',
    accessor: 'performance',
    sortable: true,
    align: 'right',
    cell: (value) => (
      <Text weight="semibold">{value.toFixed(1)}</Text>
    ),
  },
];

export default function Demo() {
  const [sortBy, setSortBy] = useState<DataTableSort[]>([]);
  const [pagination, setPagination] = useState<DataTablePagination>({ page: 1, pageSize: 5, total: rows.length });

  return (
    <Column gap="lg">
      <Card p="md">
        <Column gap="md">
          <Text size="sm" colorVariant="secondary">
            Showcase avatars, chips, and custom status cues to elevate table readability while keeping a compact density.
          </Text>
          <DataTable
            data={rows}
            columns={columns}
            sortBy={sortBy}
            onSortChange={setSortBy}
            pagination={pagination}
            onPaginationChange={setPagination}
            density="comfortable"
            variant="striped"
          />
        </Column>
      </Card>
    </Column>
  );
}
