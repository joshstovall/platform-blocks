import { useState } from 'react';
import { Button, Card, Column, DataTable, Row, Text } from '@platform-blocks/ui';
import type { DataTableColumn, DataTablePagination, DataTableSort } from '@platform-blocks/ui';

type Member = {
  id: number;
  name: string;
  email: string;
  role: 'Admin' | 'Editor' | 'Viewer';
  active: boolean;
};

const rows: Member[] = [
  { id: 1, name: 'Alex Moore', email: 'alex@example.com', role: 'Admin', active: true },
  { id: 2, name: 'Briana Shaw', email: 'briana@example.com', role: 'Editor', active: true },
  { id: 3, name: 'Charlie West', email: 'charlie@example.com', role: 'Viewer', active: false },
  { id: 4, name: 'Devon Price', email: 'devon@example.com', role: 'Editor', active: true },
  { id: 5, name: 'Eden Rose', email: 'eden@example.com', role: 'Viewer', active: true },
  { id: 6, name: 'Finn Diaz', email: 'finn@example.com', role: 'Viewer', active: false },
];

const columns: DataTableColumn<Member>[] = [
  { key: 'name', header: 'Name', accessor: 'name', sortable: true },
  { key: 'email', header: 'Email', accessor: 'email', sortable: true },
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
    key: 'active',
    header: 'Status',
    accessor: 'active',
    sortable: true,
    filterable: true,
    filterType: 'boolean',
    cell: (value: boolean) => (
      <Text colorVariant={value ? 'success' : 'error'} weight="semibold">
        {value ? 'Active' : 'Inactive'}
      </Text>
    ),
  },
];

export default function Demo() {
  const [sortBy, setSortBy] = useState<DataTableSort[]>([]);
  const [pagination, setPagination] = useState<DataTablePagination>({ page: 1, pageSize: 5, total: rows.length });
  const [selectedRows, setSelectedRows] = useState<(string | number)[]>([]);

  const toggleSelectAll = () => {
    setSelectedRows(selectedRows.length === rows.length ? [] : rows.map((member) => member.id));
  };

  return (
    <Column gap="lg">
      <Card p="md">
        <Column gap="md">
          <Row justify="space-between" align="center">
            <Column gap="xxs">
              <Text size="sm" weight="semibold">
                Row selection
              </Text>
              <Text size="sm" colorVariant="secondary">
                Multi-select rows for follow-up actions.
              </Text>
            </Column>
            <Row gap="sm">
              <Button size="xs" variant="outline" onPress={() => setSelectedRows([])} disabled={selectedRows.length === 0}>
                Clear selection
              </Button>
              <Button size="xs" variant="outline" onPress={toggleSelectAll}>
                {selectedRows.length === rows.length ? 'Deselect all' : 'Select all'}
              </Button>
            </Row>
          </Row>
          <Text size="sm" colorVariant={selectedRows.length ? 'primary' : 'muted'}>
            {selectedRows.length ? `${selectedRows.length} member${selectedRows.length > 1 ? 's' : ''} selected` : 'No rows selected'}
          </Text>
          <DataTable
            data={rows}
            columns={columns}
            sortBy={sortBy}
            onSortChange={setSortBy}
            pagination={pagination}
            onPaginationChange={setPagination}
            selectable
            selectedRows={selectedRows}
            onSelectionChange={setSelectedRows}
            getRowId={(row) => row.id}
            searchable
            searchPlaceholder="Search members"
          />
        </Column>
      </Card>
    </Column>
  );
}
