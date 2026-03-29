import { useState } from 'react';
import { Column, DataTable, Text } from '@platform-blocks/ui';
import type { DataTableColumn, DataTableSort } from '@platform-blocks/ui';

type Product = {
  id: number;
  name: string;
  category: 'Electronics' | 'Home' | 'Outdoors' | 'Office';
  price: number;
  stock: number;
  active: boolean;
};

const rows: Product[] = [
  { id: 1, name: 'Noise-Cancelling Headphones', category: 'Electronics', price: 249, stock: 32, active: true },
  { id: 2, name: 'Adjustable Standing Desk', category: 'Office', price: 499, stock: 12, active: true },
  { id: 3, name: 'Smart Home Hub', category: 'Home', price: 179, stock: 18, active: false },
  { id: 4, name: 'Portable Projector', category: 'Electronics', price: 289, stock: 7, active: true },
  { id: 5, name: 'Weatherproof Bluetooth Speaker', category: 'Outdoors', price: 129, stock: 25, active: true },
];

const columns: DataTableColumn<Product>[] = [
  {
    key: 'name',
    header: 'Product',
    accessor: 'name',
    sortable: true,
    filterable: true,
    filterType: 'text',
    resizable: true,
    width: 220,
  },
  {
    key: 'category',
    header: 'Category',
    accessor: 'category',
    sortable: true,
    filterable: true,
    filterType: 'select',
    filterOptions: [
      { label: 'Electronics', value: 'Electronics' },
      { label: 'Home', value: 'Home' },
      { label: 'Office', value: 'Office' },
      { label: 'Outdoors', value: 'Outdoors' },
    ],
  },
  {
    key: 'price',
    header: 'Price',
    accessor: 'price',
    sortable: true,
    filterable: true,
    filterType: 'number',
    dataType: 'currency',
    align: 'right',
  },
  {
    key: 'stock',
    header: 'In Stock',
    accessor: 'stock',
    sortable: true,
    align: 'right',
  },
  {
    key: 'active',
    header: 'Status',
    accessor: 'active',
    sortable: true,
    filterable: true,
    filterType: 'boolean',
    cell: (value: boolean) => (
      <Text colorVariant={value ? 'success' : 'muted'} weight="semibold">
        {value ? 'Active' : 'Hidden'}
      </Text>
    ),
  },
];

export default function Demo() {
  const [sortBy, setSortBy] = useState<DataTableSort[]>([]);

  return (
    <Column gap="sm" fullWidth>
      <Text size="sm" colorVariant="secondary">
        Use the header menu (⋮) → Column settings to adjust width, label, or visibility
      </Text>
      <DataTable
        data={rows}
        columns={columns}
        sortBy={sortBy}
        onSortChange={setSortBy}
        searchable
        searchPlaceholder="Search products"
        enableColumnResizing
        showColumnVisibilityManager
        hoverHighlight
        variant="striped"
      />
    </Column>
  );
}
