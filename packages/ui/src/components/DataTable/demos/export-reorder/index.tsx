// CSV export + drag-to-reorder columns.
import { useState } from 'react';
import { Column, DataTable, Text } from '@platform-blocks/ui';
import type { DataTableColumn, DataTablePagination, DataTableSort } from '@platform-blocks/ui';

type Sale = {
  id: number;
  product: string;
  region: string;
  units: number;
  revenue: number;
  date: string;
};

const rows: Sale[] = [
  { id: 1, product: 'Widget A', region: 'North', units: 320, revenue: 15840, date: '2026-01-12' },
  { id: 2, product: 'Widget B', region: 'South', units: 210, revenue: 9870, date: '2026-01-15' },
  { id: 3, product: 'Gadget X', region: 'East', units: 540, revenue: 32400, date: '2026-02-03' },
  { id: 4, product: 'Gadget Y', region: 'West', units: 130, revenue: 7150, date: '2026-02-19' },
  { id: 5, product: 'Widget C', region: 'North', units: 410, revenue: 20090, date: '2026-03-01' },
  { id: 6, product: 'Gadget Z', region: 'South', units: 275, revenue: 16500, date: '2026-03-08' },
];

const columns: DataTableColumn<Sale>[] = [
  { key: 'product', header: 'Product', accessor: 'product', sortable: true },
  { key: 'region', header: 'Region', accessor: 'region', sortable: true },
  { key: 'units', header: 'Units', accessor: 'units', dataType: 'number', align: 'right', sortable: true },
  { key: 'revenue', header: 'Revenue', accessor: 'revenue', dataType: 'currency', align: 'right', sortable: true },
  { key: 'date', header: 'Date', accessor: 'date', dataType: 'date', sortable: true },
];

export default function Demo() {
  const [sortBy, setSortBy] = useState<DataTableSort[]>([]);
  const [pagination, setPagination] = useState<DataTablePagination>({ page: 1, pageSize: 6, total: rows.length });
  const [order, setOrder] = useState<string[]>(columns.map((c) => c.key));

  return (
    <Column gap="sm" fullWidth>
      <Text size="sm" colorVariant="secondary">
        Drag a column header to reorder, or click Export to download the current
        view (sorted + filtered) as CSV. Current order: {order.join(' → ')}
      </Text>
      <DataTable
        data={rows}
        columns={columns}
        sortBy={sortBy}
        onSortChange={setSortBy}
        pagination={pagination}
        onPaginationChange={setPagination}
        exportable
        exportFileName="sales.csv"
        enableColumnReordering
        columnOrder={order}
        onColumnOrderChange={setOrder}
      />
    </Column>
  );
}
