import { useState } from 'react';
import { DataTable, Block, Text, Card, Chip, Icon, Indicator, Flex, Avatar } from '@platform-blocks/ui';
import type { DataTableColumn, DataTableSort, DataTablePagination } from '@platform-blocks/ui';

// Sample data with richer information
interface Employee {
  id: number;
  name: string;
  email: string;
  role: string;
  status: 'active' | 'inactive' | 'pending';
  department: string;
  salary: number;
  startDate: Date;
  avatar?: string;
  performance: number; // 1-5 rating
}

const sampleData: Employee[] = [
  { 
    id: 1, 
    name: 'John Doe', 
    email: 'john@company.com', 
    role: 'Senior Developer', 
    status: 'active', 
    department: 'Engineering',
    avatar: 'https://randomuser.me/api/portraits/men/25.jpg',
    salary: 95000,
    startDate: new Date('2022-01-15'),
    performance: 4.5
  },
  { 
    id: 2, 
    name: 'Jane Smith', 
    email: 'jane@company.com', 
    role: 'UI/UX Designer', 
    status: 'active', 
    department: 'Design',
    avatar: 'https://randomuser.me/api/portraits/women/25.jpg',
    salary: 78000,
    startDate: new Date('2021-08-22'),
    performance: 4.8
  },
  { 
    id: 3, 
    name: 'Mike Johnson', 
    email: 'mike@company.com', 
    role: 'Product Manager', 
    status: 'active', 
    department: 'Product',
    salary: 105000,
    startDate: new Date('2020-03-10'),
    performance: 4.2
  },
  { 
    id: 4, 
    name: 'Sarah Wilson', 
    email: 'sarah@company.com', 
    role: 'Frontend Developer', 
    status: 'inactive', 
    department: 'Engineering',
    salary: 85000,
    startDate: new Date('2023-06-01'),
    performance: 4.0
  },
  { 
    id: 5, 
    name: 'David Brown', 
    email: 'david@company.com', 
    role: 'DevOps Engineer', 
    status: 'pending', 
    department: 'Infrastructure',
    salary: 92000,
    startDate: new Date('2023-11-15'),
    performance: 3.8
  },
  { 
    id: 6, 
    name: 'Lisa Garcia', 
    email: 'lisa@company.com', 
    role: 'Data Scientist', 
    status: 'active', 
    department: 'Engineering',
    salary: 110000,
    startDate: new Date('2021-12-05'),
    performance: 4.9
  },
];

export default function Demo() {
  const [sortBy, setSortBy] = useState<DataTableSort[]>([]);
  const [pagination, setPagination] = useState<DataTablePagination>({
    page: 1,
    pageSize: 4,
    total: 6
  });
  const [selectedRows, setSelectedRows] = useState<(string | number)[]>([]);
  const [variant, setVariant] = useState<'default' | 'striped' | 'bordered'>('striped');
  const [density, setDensity] = useState<'compact' | 'normal' | 'comfortable'>('normal');

  const columns: DataTableColumn<Employee>[] = [
    {
      key: 'name',
      header: 'Employee',
      accessor: 'name',
      sortable: true,
      cell: (value: any, row: Employee) => (
        <Avatar
          size="sm"
          fallback={value.split(' ').map((n: string) => n[0]).join('')}
          backgroundColor="#007AFF"
          textColor="white"
          label={<Text weight="semibold" style={{ fontSize: 14 }}>{value}</Text>}
          description={<Text variant="caption" colorVariant="muted">{row.role}</Text>}
          gap={8}
          src={row.avatar}
        />
      )
    },
    {
      key: 'email',
      header: 'Contact',
      accessor: 'email',
      sortable: true,
      cell: (value: any) => (
        <Text style={{ color: '#007AFF', fontSize: 13 }}>{value}</Text>
      )
    },
    {
      key: 'department',
      header: 'Department',
      accessor: 'department',
      sortable: true,
      cell: (value: any) => (
        <Chip 
          size="xs" 
          variant="light"
          color={value === 'Engineering' ? 'primary' : value === 'Design' ? 'purple' : value === 'Product' ? 'success' : 'gray'}
        >
          {value}
        </Chip>
      )
    },
    {
      key: 'status',
      header: 'Status',
      accessor: 'status',
      sortable: true,
      cell: (value: any) => (
        <Flex align="center" gap={6}>
          <Block style={{
            width: 8,
            height: 8,
            borderRadius: '50%',
            backgroundColor: value === 'active' ? '#34C759' : value === 'inactive' ? '#FF3B30' : '#FFB800'
          }} />
          <Text 
            style={{ 
              fontSize: 13,
              fontWeight: '600',
              color: value === 'active' ? '#34C759' : value === 'inactive' ? '#FF3B30' : '#FFB800'
            }}
          >
            {value.charAt(0).toUpperCase() + value.slice(1)}
          </Text>
        </Flex>
      )
    },
    {
      key: 'performance',
      header: 'Rating',
      accessor: 'performance',
      sortable: true,
      cell: (value: any) => (
        <Flex align="center" gap={4}>
          <Block style={{ display: 'flex', gap: 2 }}>
            {[1, 2, 3, 4, 5].map((star) => (
              <Icon 
                key={star}
                name="star" 
                size={12} 
                color={star <= Math.floor(value) ? '#FFB800' : '#E5E5EA'} 
              />
            ))}
          </Block>
          <Text variant="caption" colorVariant="muted">({value})</Text>
        </Flex>
      )
    },
    {
      key: 'salary',
      header: 'Salary',
      accessor: 'salary',
      sortable: true,
      align: 'right',
      cell: (value: any) => (
        <Text weight="semibold" style={{ fontSize: 14 }}>
          ${value.toLocaleString()}
        </Text>
      )
    },
  ];

  const rowActions = (row: Employee) => [
    {
      key: 'view',
      icon: <Icon name="eye" size={14} color="#007AFF" />,
      onPress: () => console.log('View', row.name)
    },
    {
      key: 'edit',
      icon: <Icon name="code" size={14} color="#8E8E93" />,
      onPress: () => console.log('Edit', row.name)
    },
    {
      key: 'delete',
      icon: <Icon name="trash" size={14} color="#FF3B30" />,
      onPress: () => console.log('Delete', row.name),
      disabled: row.status === 'active'
    }
  ];

  return (
    <Block style={{ padding: 20 }}>
      <Block style={{ marginBottom: 24 }}>
        <Text variant="h5" style={{ marginBottom: 8 }}>Enhanced DataTable Styling</Text>
        <Text colorVariant="muted">
          Showcasing improved visual design, better spacing, enhanced status indicators, and refined typography.
        </Text>
      </Block>

      <Block style={{ marginBottom: 16, display: 'flex', gap: 16, alignItems: 'center' }}>
        <Block>
          <Text variant="body" style={{ marginBottom: 4, fontSize: 13, fontWeight: '600' }}>Variant:</Text>
          <select 
            value={variant} 
            onChange={(e) => setVariant(e.target.value as any)}
            style={{ padding: '6px 8px', borderRadius: 6, border: '1px solid #E5E5EA' }}
          >
            <option value="default">Default</option>
            <option value="striped">Striped</option>
            <option value="bordered">Bordered</option>
          </select>
        </Block>
        <Block>
          <Text variant="body" style={{ marginBottom: 4, fontSize: 13, fontWeight: '600' }}>Density:</Text>
          <select 
            value={density} 
            onChange={(e) => setDensity(e.target.value as any)}
            style={{ padding: '6px 8px', borderRadius: 6, border: '1px solid #E5E5EA' }}
          >
            <option value="compact">Compact</option>
            <option value="normal">Normal</option>
            <option value="comfortable">Comfortable</option>
          </select>
        </Block>
      </Block>

      <Card variant="outline" style={{ overflow: 'hidden' }}>
        <DataTable
          data={sampleData}
          columns={columns}
          sortBy={sortBy}
          onSortChange={setSortBy}
          pagination={pagination}
          onPaginationChange={setPagination}
          selectedRows={selectedRows}
          onSelectionChange={setSelectedRows}
          variant={variant}
          density={density}
          rowActions={rowActions}
          searchable={true}

          enableColumnResizing={true}
        />
      </Card>
    </Block>
  );
}
