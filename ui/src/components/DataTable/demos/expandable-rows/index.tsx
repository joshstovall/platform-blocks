import { useState } from 'react';
import { Button, Column, DataTable, Row, Text } from '@platform-blocks/ui';
import type { DataTableColumn, DataTablePagination, DataTableSort } from '@platform-blocks/ui';

type Project = {
  id: number;
  name: string;
  owner: string;
  status: 'active' | 'planning' | 'completed';
  budget: number;
  summary: string;
};

const rows: Project[] = [
  {
    id: 1,
    name: 'Observability Refresh',
    owner: 'Dana Moss',
    status: 'active',
    budget: 180000,
    summary: 'Rolling out unified logging, tracing, and metrics across services.',
  },
  {
    id: 2,
    name: 'Mobile Onboarding',
    owner: 'Noah Reed',
    status: 'planning',
    budget: 120000,
    summary: 'Designing a guided onboarding experience for new mobile users.',
  },
  {
    id: 3,
    name: 'Billing Automation',
    owner: 'Priya Singh',
    status: 'completed',
    budget: 95000,
    summary: 'Automated invoicing and dunning flows to reduce manual effort.',
  },
];

const columns: DataTableColumn<Project>[] = [
  {
    key: 'name',
    header: 'Project',
    accessor: 'name',
    sortable: true,
    cell: (_value, row) => (
      <Column gap="xxs">
        <Text weight="semibold">{row.name}</Text>
        <Text variant="small" colorVariant="muted">
          Owner · {row.owner}
        </Text>
      </Column>
    ),
  },
  {
    key: 'status',
    header: 'Status',
    accessor: 'status',
    sortable: true,
    cell: (value: Project['status']) => (
      <Text colorVariant={value === 'completed' ? 'success' : value === 'planning' ? 'warning' : 'primary'} weight="semibold">
        {value.charAt(0).toUpperCase() + value.slice(1)}
      </Text>
    ),
  },
  {
    key: 'budget',
    header: 'Budget',
    accessor: 'budget',
    align: 'right',
    sortable: true,
    cell: (value) => <Text weight="semibold">${value.toLocaleString()}</Text>,
  },
];

export default function Demo() {
  const [sortBy, setSortBy] = useState<DataTableSort[]>([]);
  const [pagination, setPagination] = useState<DataTablePagination>({ page: 1, pageSize: 3, total: rows.length });
  const [expandedRows, setExpandedRows] = useState<(string | number)[]>([rows[0].id]);

  return (
    <Column gap="sm" fullWidth>
      <Row justify="space-between" align="center">
        <Text size="sm" colorVariant="secondary">
          Expand a row to see project highlights and the owning lead
        </Text>
        <Button
          size="xs"
          variant="outline"
          onPress={() => setExpandedRows(expandedRows.length === rows.length ? [] : rows.map((project) => project.id))}
        >
          {expandedRows.length === rows.length ? 'Collapse all' : 'Expand all'}
        </Button>
      </Row>
      <DataTable
        data={rows}
        columns={columns}
        sortBy={sortBy}
        onSortChange={setSortBy}
        pagination={pagination}
        onPaginationChange={setPagination}
        expandedRows={expandedRows}
        onExpandedRowsChange={setExpandedRows}
        renderExpandedRow={(project) => (
          <Column gap="xs" p="md">
            <Text weight="semibold">Summary</Text>
            <Text colorVariant="muted">{project.summary}</Text>
          </Column>
        )}
      />
    </Column>
  );
}
