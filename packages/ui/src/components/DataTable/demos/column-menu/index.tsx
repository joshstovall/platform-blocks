// Header column menu (pin / move / hide / sort) with persisted view prefs.
import { useState } from 'react';
import { Column, DataTable, Text } from '@platform-blocks/ui';
import type { DataTableColumn, DataTableSort } from '@platform-blocks/ui';

type Person = {
  id: number;
  name: string;
  email: string;
  role: string;
  team: string;
  location: string;
  status: string;
};

const rows: Person[] = [
  { id: 1, name: 'Dana Moss', email: 'dana@example.com', role: 'Staff Engineer', team: 'Platform', location: 'Berlin', status: 'Active' },
  { id: 2, name: 'Noah Reed', email: 'noah@example.com', role: 'Designer', team: 'Design', location: 'Austin', status: 'Active' },
  { id: 3, name: 'Priya Singh', email: 'priya@example.com', role: 'EM', team: 'Payments', location: 'Bangalore', status: 'Away' },
  { id: 4, name: 'Marco Bianchi', email: 'marco@example.com', role: 'Data Scientist', team: 'Insights', location: 'Milan', status: 'Active' },
];

const columns: DataTableColumn<Person>[] = [
  { key: 'name', header: 'Name', accessor: 'name', sortable: true, width: 160 },
  { key: 'email', header: 'Email', accessor: 'email', width: 200 },
  { key: 'role', header: 'Role', accessor: 'role', sortable: true, width: 160 },
  { key: 'team', header: 'Team', accessor: 'team', sortable: true, width: 140 },
  { key: 'location', header: 'Location', accessor: 'location', width: 140 },
  { key: 'status', header: 'Status', accessor: 'status', sortable: true, width: 120 },
];

export default function Demo() {
  const [sortBy, setSortBy] = useState<DataTableSort[]>([]);

  return (
    <Column gap="sm" fullWidth>
      <Text size="sm" colorVariant="secondary">
        Open a column&apos;s ⋯ menu to sort, pin left/right, move, or hide it. Your
        column order, widths, and pins are remembered across reloads (via the
        table&apos;s `id`).
      </Text>
      <DataTable
        id="docs-column-menu"
        data={rows}
        columns={columns}
        sortBy={sortBy}
        onSortChange={setSortBy}
        enableColumnReordering
        enableColumnResizing
        searchable={false}
        fullWidth={false}
      />
    </Column>
  );
}
