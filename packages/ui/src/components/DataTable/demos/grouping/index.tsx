// Row grouping with per-group aggregates and a grand-total footer row.
import { Column, DataTable, Text } from '@platform-blocks/ui';
import type { DataTableColumn } from '@platform-blocks/ui';

type Sale = {
  id: number;
  region: string;
  rep: string;
  product: string;
  units: number;
  revenue: number;
};

const rows: Sale[] = [
  { id: 1, region: 'North', rep: 'Dana', product: 'Widget A', units: 320, revenue: 15840 },
  { id: 2, region: 'North', rep: 'Dana', product: 'Widget C', units: 410, revenue: 20090 },
  { id: 3, region: 'North', rep: 'Priya', product: 'Gadget X', units: 540, revenue: 32400 },
  { id: 4, region: 'South', rep: 'Noah', product: 'Widget B', units: 210, revenue: 9870 },
  { id: 5, region: 'South', rep: 'Noah', product: 'Gadget Z', units: 275, revenue: 16500 },
  { id: 6, region: 'East', rep: 'Marco', product: 'Gadget Y', units: 130, revenue: 7150 },
  { id: 7, region: 'East', rep: 'Aisha', product: 'Widget A', units: 260, revenue: 12870 },
  { id: 8, region: 'West', rep: 'Sam', product: 'Gadget X', units: 480, revenue: 28800 },
];

const columns: DataTableColumn<Sale>[] = [
  { key: 'region', header: 'Region', accessor: 'region' },
  { key: 'rep', header: 'Rep', accessor: 'rep', aggregate: 'count' },
  { key: 'product', header: 'Product', accessor: 'product' },
  { key: 'units', header: 'Units', accessor: 'units', dataType: 'number', align: 'right', aggregate: 'sum' },
  { key: 'revenue', header: 'Revenue', accessor: 'revenue', dataType: 'currency', align: 'right', aggregate: 'sum' },
];

export default function Demo() {
  return (
    <Column gap="sm" fullWidth>
      <Text size="sm" colorVariant="secondary">
        Rows grouped by Region. Each group header shows the row count and summed
        Units / Revenue; the footer shows the grand totals. Click a group header
        to collapse it.
      </Text>
      <DataTable
        data={rows}
        columns={columns}
        groupBy="region"
        showFooterTotals
        footerLabel="All regions"
        searchable={false}
        showColumnVisibilityManager={false}
      />
    </Column>
  );
}
