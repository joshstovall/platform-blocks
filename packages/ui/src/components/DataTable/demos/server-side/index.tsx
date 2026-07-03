import { useEffect, useMemo, useState } from 'react';
import { Column, DataTable, Text } from '@platform-blocks/ui';
import type { DataTableColumn, DataTablePagination, DataTableSort } from '@platform-blocks/ui';

type Order = {
  id: number;
  customer: string;
  product: string;
  amount: number;
  status: 'paid' | 'refunded' | 'pending';
};

// Pretend this table lives on a server; the component only ever sees one page.
const DB: Order[] = Array.from({ length: 137 }, (_, i) => {
  const statuses: Order['status'][] = ['paid', 'refunded', 'pending'];
  return {
    id: i + 1,
    customer: `Customer ${String(i + 1).padStart(3, '0')}`,
    product: ['Starter', 'Pro', 'Team', 'Enterprise'][i % 4],
    amount: Math.round(((i * 37) % 900) + 100),
    status: statuses[i % 3],
  };
});

// Simulate an API endpoint: GET /orders?page&pageSize&sort
function fetchOrders(params: {
  page: number;
  pageSize: number;
  sortBy: DataTableSort[];
}): Promise<{ rows: Order[]; total: number }> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const sorted = [...DB];
      const sort = params.sortBy[0];
      if (sort?.direction) {
        sorted.sort((a, b) => {
          const av = a[sort.column as keyof Order];
          const bv = b[sort.column as keyof Order];
          const cmp = typeof av === 'number' && typeof bv === 'number'
            ? av - bv
            : String(av).localeCompare(String(bv));
          return sort.direction === 'desc' ? -cmp : cmp;
        });
      }
      const start = (params.page - 1) * params.pageSize;
      resolve({ rows: sorted.slice(start, start + params.pageSize), total: DB.length });
    }, 500);
  });
}

const columns: DataTableColumn<Order>[] = [
  { key: 'id', header: 'Order', accessor: 'id', sortable: true, dataType: 'number' },
  { key: 'customer', header: 'Customer', accessor: 'customer', sortable: true },
  { key: 'product', header: 'Plan', accessor: 'product', sortable: true },
  { key: 'amount', header: 'Amount', accessor: 'amount', sortable: true, dataType: 'currency' },
  {
    key: 'status',
    header: 'Status',
    accessor: 'status',
    sortable: true,
    cell: (value: Order['status']) => (
      <Text
        colorVariant={value === 'paid' ? 'success' : value === 'refunded' ? 'error' : 'warning'}
        weight="semibold"
      >
        {value.toUpperCase()}
      </Text>
    ),
  },
];

export default function Demo() {
  const [rows, setRows] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState<DataTableSort[]>([]);
  const [pagination, setPagination] = useState<DataTablePagination>({
    page: 1,
    pageSize: 10,
    total: 0,
  });

  // Refetch whenever the page, page size, or sort changes.
  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    fetchOrders({ page: pagination.page, pageSize: pagination.pageSize, sortBy }).then((res) => {
      if (cancelled) return;
      setRows(res.rows);
      setPagination((p) => (p.total === res.total ? p : { ...p, total: res.total }));
      setLoading(false);
    });
    return () => {
      cancelled = true;
    };
  }, [pagination.page, pagination.pageSize, sortBy]);

  const summary = useMemo(
    () => `Server total: ${pagination.total} · showing page ${pagination.page}`,
    [pagination.total, pagination.page]
  );

  return (
    <Column gap="sm" fullWidth>
      <Text size="sm" colorVariant="secondary">
        {summary}
      </Text>
      <DataTable
        data={rows}
        columns={columns}
        loading={loading}
        manualPagination
        pagination={pagination}
        onPaginationChange={setPagination}
        sortBy={sortBy}
        onSortChange={setSortBy}
        getRowId={(row) => row.id}
        searchable={false}
      />
    </Column>
  );
}
