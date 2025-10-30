import { useState, useMemo } from 'react';
import { DataTable, Flex, Text, Button, Card } from '@platform-blocks/ui';
import type { DataTableColumn, DataTableSort, DataTablePagination } from '@platform-blocks/ui';

// Sample data
interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  status: 'active' | 'inactive' | 'pending';
  lastLogin: Date;
  salary: number;
  department: string;
}

const generateSampleData = (): User[] => {
  const names = ['John Doe', 'Jane Smith', 'Mike Johnson', 'Sarah Wilson', 'David Brown', 'Lisa Garcia', 'Robert Davis', 'Jennifer Miller'];
  const roles = ['Admin', 'User', 'Manager', 'Developer', 'Designer'];
  const departments = ['Engineering', 'Marketing', 'Sales', 'HR', 'Finance'];
  const statuses: ('active' | 'inactive' | 'pending')[] = ['active', 'inactive', 'pending'];

  return Array.from({ length: 25 }, (_, i) => ({
    id: i + 1,
    name: names[i % names.length] + ` ${i + 1}`,
    email: `user${i + 1}@company.com`,
    role: roles[i % roles.length],
    status: statuses[i % statuses.length],
    lastLogin: new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000),
    salary: 40000 + Math.floor(Math.random() * 100000),
    department: departments[i % departments.length],
  }));
};

export default function Demo() {
  const [data] = useState(generateSampleData());
  const [sortBy, setSortBy] = useState<DataTableSort[]>([]);
  const [pagination, setPagination] = useState<DataTablePagination>({
    page: 1,
    pageSize: 10,
    total: 25
  });
  const [selectedRows, setSelectedRows] = useState<(string | number)[]>([]);
  const [loading, setLoading] = useState(false);

  const columns: DataTableColumn<User>[] = [
    {
      key: 'name',
      header: 'Name',
      accessor: 'name',
      sortable: true,
      cell: (value) => (
        <Text weight="semibold">{value}</Text>
      )
    },
    {
      key: 'email',
      header: 'Email',
      accessor: 'email',
      sortable: true,
    },
    {
      key: 'role',
      header: 'Role',
      accessor: 'role',
      sortable: true,
    },
    {
      key: 'status',
      header: 'Status',
      accessor: 'status',
      sortable: true,
      cell: (value) => (
        <Text 
          style={{ 
            color: value === 'active' ? 'green' : value === 'inactive' ? 'red' : 'orange',
            fontWeight: '600'
          }}
        >
          {value.toUpperCase()}
        </Text>
      )
    },
    {
      key: 'department',
      header: 'Department',
      accessor: 'department',
      sortable: true,
    },
    {
      key: 'salary',
      header: 'Salary',
      accessor: 'salary',
      sortable: true,
      cell: (value) => (
        <Text>${value.toLocaleString()}</Text>
      )
    },
    {
      key: 'lastLogin',
      header: 'Last Login',
      accessor: 'lastLogin',
      sortable: true,
      cell: (value) => (
        <Text>{value.toLocaleDateString()}</Text>
      )
    }
  ];

  const handleBulkAction = (action: string) => {
    setLoading(true);
    console.log(`Performing ${action} on selected rows:`, selectedRows);
    setTimeout(() => {
      setLoading(false);
      setSelectedRows([]);
    }, 1000);
  };

  // Get current page data
  const currentData = useMemo(() => {
    const startIndex = (pagination.page - 1) * pagination.pageSize;
    const endIndex = startIndex + pagination.pageSize;
    return data.slice(startIndex, endIndex);
  }, [data, pagination]);

  return (
    <Card p={16} variant="outline">
      <Flex direction="column" gap={16}>
        <Flex direction="row" justify="space-between" align="center">
          <Text size="lg" weight="semibold">User Management</Text>
          <Flex direction="row" gap={8}>
            {selectedRows.length > 0 && (
              <>
                <Button 
                  size="sm" 
                  variant="outline" 
                  onPress={() => handleBulkAction('delete')}
                  loading={loading}
                >
                  Delete Selected ({selectedRows.length})
                </Button>
                <Button 
                  size="sm" 
                  variant="outline" 
                  onPress={() => handleBulkAction('export')}
                  loading={loading}
                >
                  Export Selected
                </Button>
              </>
            )}
            <Button size="sm" variant="filled">
              Add User
            </Button>
          </Flex>
        </Flex>

        <DataTable
          data={currentData}
          columns={columns}
          sortBy={sortBy}
          onSortChange={setSortBy}
          pagination={pagination}
          onPaginationChange={setPagination}
          selectedRows={selectedRows}
          onSelectionChange={setSelectedRows}
          loading={loading}
          rowActions={(row, index) => [
            {
              key: 'edit',
              icon: <Text style={{ fontSize: 12 }}>✏️</Text>,
              onPress: () => console.log('Edit user', row.id)
            },
            {
              key: 'delete',
              icon: <Text style={{ fontSize: 12 }}>🗑️</Text>,
              onPress: () => handleBulkAction('delete')
            }
          ]}
        />
      </Flex>
    </Card>
  );
}
