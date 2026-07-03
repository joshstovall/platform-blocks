import { Column, DataTable, Text } from '@platform-blocks/ui';
import type { DataTableColumn } from '@platform-blocks/ui';

type Server = {
  id: number;
  host: string;
  region: string;
  cpu: string;
  status: 'healthy' | 'degraded' | 'offline';
};

const REGIONS = ['us-east-1', 'us-west-2', 'eu-west-1', 'ap-south-1'];
const STATUSES: Server['status'][] = ['healthy', 'degraded', 'offline'];

const rows: Server[] = Array.from({ length: 40 }, (_, i) => ({
  id: i + 1,
  host: `node-${String(i + 1).padStart(2, '0')}.cluster.internal`,
  region: REGIONS[i % REGIONS.length],
  cpu: `${((i * 7) % 90) + 5}%`,
  status: STATUSES[i % STATUSES.length],
}));

const columns: DataTableColumn<Server>[] = [
  { key: 'host', header: 'Host', accessor: 'host', sortable: true, minWidth: 220 },
  { key: 'region', header: 'Region', accessor: 'region', sortable: true },
  { key: 'cpu', header: 'CPU', accessor: 'cpu', sortable: true, align: 'right' },
  {
    key: 'status',
    header: 'Status',
    accessor: 'status',
    sortable: true,
    cell: (value: Server['status']) => (
      <Text
        colorVariant={value === 'healthy' ? 'success' : value === 'degraded' ? 'warning' : 'error'}
        weight="semibold"
      >
        {value.toUpperCase()}
      </Text>
    ),
  },
];

export default function Demo() {
  return (
    <Column gap="sm" fullWidth>
      <Text size="sm" colorVariant="secondary">
        Set a fixed <Text weight="semibold">height</Text> to pin the header while the body scrolls (40 rows, no pagination).
      </Text>
      <DataTable
        data={rows}
        columns={columns}
        getRowId={(row) => row.id}
        height={320}
        showOuterBorder
        searchable={false}
      />
    </Column>
  );
}
