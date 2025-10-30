import { useState } from 'react';
import { DataTable, Text, Card, Button, Flex } from '@platform-blocks/ui';
import type { DataTableColumn, DataTableSort } from '@platform-blocks/ui';

// Sample data for demonstration
interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  stock: number;
  rating: number;
  description: string;
  isActive: boolean;
}

const sampleProducts: Product[] = [
  {
    id: 1,
    name: 'Wireless Headphones',
    category: 'Electronics',
    price: 99.99,
    stock: 25,
    rating: 4.5,
    description: 'High-quality wireless headphones with noise cancellation',
    isActive: true
  },
  {
    id: 2,
    name: 'Coffee Maker',
    category: 'Appliances',
    price: 149.99,
    stock: 15,
    rating: 4.2,
    description: 'Programmable coffee maker with thermal carafe',
    isActive: true
  },
  {
    id: 3,
    name: 'Running Shoes',
    category: 'Sports',
    price: 79.99,
    stock: 40,
    rating: 4.7,
    description: 'Lightweight running shoes with excellent cushioning',
    isActive: false
  },
  {
    id: 4,
    name: 'Desk Lamp',
    category: 'Furniture',
    price: 34.99,
    stock: 30,
    rating: 4.0,
    description: 'Adjustable LED desk lamp with multiple brightness levels',
    isActive: true
  },
  {
    id: 5,
    name: 'Bluetooth Speaker',
    category: 'Electronics',
    price: 59.99,
    stock: 20,
    rating: 4.3,
    description: 'Portable Bluetooth speaker with rich bass',
    isActive: true
  },
  {
    id: 6,
    name: 'Yoga Mat',
    category: 'Sports',
    price: 24.99,
    stock: 50,
    rating: 4.1,
    description: 'Non-slip yoga mat with extra cushioning',
    isActive: true
  },
  {
    id: 7,
    name: 'Kitchen Scale',
    category: 'Appliances',
    price: 19.99,
    stock: 35,
    rating: 4.4,
    description: 'Digital kitchen scale with precise measurements',
    isActive: false
  },
  {
    id: 8,
    name: 'Office Chair',
    category: 'Furniture',
    price: 199.99,
    stock: 12,
    rating: 4.6,
    description: 'Ergonomic office chair with lumbar support',
    isActive: true
  }
];

export default function PortalColumnSettingsDemo() {
  const [sortBy, setSortBy] = useState<DataTableSort[]>([]);

  const columns: DataTableColumn<Product>[] = [
    {
      key: 'name',
      header: 'Product Name',
      accessor: 'name',
      sortable: true,
      filterable: true,
      filterType: 'text',
      resizable: true,
      minWidth: 150,
      width: 200
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
        { label: 'Appliances', value: 'Appliances' },
        { label: 'Sports', value: 'Sports' },
        { label: 'Furniture', value: 'Furniture' }
      ],
      width: 120
    },
    {
      key: 'price',
      header: 'Price ($)',
      accessor: 'price',
      cell: (price: number) => `$${price.toFixed(2)}`,
      sortable: true,
      filterable: true,
      filterType: 'number',
      dataType: 'currency',
      align: 'right',
      width: 100
    },
    {
      key: 'stock',
      header: 'Stock',
      accessor: 'stock',
      sortable: true,
      filterable: true,
      filterType: 'number',
      align: 'center',
      width: 80,
      cell: (stock: number) => (
        <Text style={{ 
          color: stock < 20 ? '#dc2626' : stock < 30 ? '#ea580c' : '#16a34a',
          fontWeight: '600'
        }}>
          {stock}
        </Text>
      )
    },
    {
      key: 'rating',
      header: 'Rating',
      accessor: 'rating',
      sortable: true,
      align: 'center',
      width: 80,
      cell: (rating: number) => (
        <Text style={{ color: '#f59e0b', fontWeight: '600' }}>
          {'★'.repeat(Math.floor(rating))} {rating.toFixed(1)}
        </Text>
      )
    },
    {
      key: 'status',
      header: 'Status',
      accessor: 'isActive',
      sortable: true,
      filterable: true,
      filterType: 'boolean',
      align: 'center',
      width: 90,
      cell: (isActive: boolean) => (
        <Text style={{ 
          backgroundColor: isActive ? '#dcfce7' : '#fee2e2',
          color: isActive ? '#16a34a' : '#dc2626',
          paddingHorizontal: 8,
          paddingVertical: 4,
          borderRadius: 4,
          fontSize: 12,
          fontWeight: '500',
          textAlign: 'center'
        }}>
          {isActive ? 'Active' : 'Inactive'}
        </Text>
      )
    },
    {
      key: 'description',
      header: 'Description',
      accessor: 'description',
      filterable: true,
      filterType: 'text',
      width: 250,
      cell: (description: string) => (
        <Text style={{ fontSize: 12, color: '#6b7280' }}>
          {description.length > 50 ? `${description.substring(0, 50)}...` : description}
        </Text>
      )
    }
  ];

  return (
    <Card>
      <Flex direction="column" gap={16}>
        <Flex direction="column" gap={8}>
          <Text size="lg" weight="bold">Portal-Based Column Settings</Text>
          <Text color="muted">
            DataTable with portal-based column configuration that doesn't disrupt table layout. 
            Click the menu button in any column header to access settings.
          </Text>
        </Flex>

        {/* Feature Highlights */}
        <Card style={{ backgroundColor: '#f8f9fa', padding: 16, borderRadius: 8 }}>
          <Flex direction="column" gap={8}>
            <Text size="sm" weight="medium">🚀 Portal Features:</Text>
            <Text size="sm" color="muted">• Click column menu → "Column settings" to open portal overlay</Text>
            <Text size="sm" color="muted">• No layout shifting - settings appear in floating overlay</Text>
            <Text size="sm" color="muted">• Edit column headers dynamically</Text>
            <Text size="sm" color="muted">• Hide/show columns without affecting table structure</Text>
            <Text size="sm" color="muted">• View column properties and capabilities</Text>
            <Text size="sm" color="muted">• Click outside or press Escape to close settings</Text>
          </Flex>
        </Card>

        {/* Instructions */}
        <Card style={{ backgroundColor: '#eff6ff', padding: 16, borderRadius: 8, borderColor: '#3b82f6', borderWidth: 1 }}>
          <Flex direction="column" gap={8}>
            <Text size="sm" weight="medium" style={{ color: '#1d4ed8' }}>💡 Try This:</Text>
            <Text size="sm" style={{ color: '#1e40af' }}>1. Click the menu button (⋮) in any column header</Text>
            <Text size="sm" style={{ color: '#1e40af' }}>2. Select "Column settings" from the dropdown</Text>
            <Text size="sm" style={{ color: '#1e40af' }}>3. Edit the header text or hide the column</Text>
            <Text size="sm" style={{ color: '#1e40af' }}>4. Notice how the table layout remains stable!</Text>
          </Flex>
        </Card>

        <DataTable
          data={sampleProducts}
          columns={columns}
          getRowId={(row) => row.id}
          searchable={true}
          searchPlaceholder="Search products..."
          sortBy={sortBy}
          onSortChange={setSortBy}
          pagination={{
            page: 1,
            pageSize: 5,
            total: sampleProducts.length
          }}
          variant="striped"
          density="normal"
          enableColumnResizing={true}
          showColumnVisibilityManager={true}
          hoverHighlight={true}
          rowBorderColor="#e5e7eb"
          rowBorderWidth={1}
          headerBackgroundColor="#f9fafb"
          // Note: Portal-based column settings work automatically!
          // No additional props needed - just click column menu → "Column settings"
        />

        {/* Technical Notes */}
        <Card style={{ backgroundColor: '#fef3c7', padding: 16, borderRadius: 8, borderColor: '#f59e0b', borderWidth: 1 }}>
          <Flex direction="column" gap={8}>
            <Text size="sm" weight="medium" style={{ color: '#92400e' }}>🔧 Technical Implementation:</Text>
            <Text size="sm" style={{ color: '#a16207' }}>• Uses React Native Modal/Portal system for overlay rendering</Text>
            <Text size="sm" style={{ color: '#a16207' }}>• Automatically positions settings panel relative to column</Text>
            <Text size="sm" style={{ color: '#a16207' }}>• Handles click-outside and keyboard events for closing</Text>
            <Text size="sm" style={{ color: '#a16207' }}>• Maintains table structure integrity during configuration</Text>
            <Text size="sm" style={{ color: '#a16207' }}>• Replaces the old inline settings row that caused layout shifts</Text>
          </Flex>
        </Card>
      </Flex>
    </Card>
  );
}