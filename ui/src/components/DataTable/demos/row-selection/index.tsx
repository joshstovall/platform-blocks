import { useState } from 'react';
import { Alert } from 'react-native';
import { DataTable, Text, Card, Button, Flex, Indicator } from '@platform-blocks/ui';
import type { DataTableColumn, DataTableSort, DataTablePagination } from '@platform-blocks/ui';

// Sample data
interface User {
  id: number;
  name: string;
  email: string;
  role: 'admin' | 'user' | 'moderator';
  department: string;
  joinDate: string;
  active: boolean;
}

const sampleUsers: User[] = [
  {
    id: 1,
    name: 'John Doe',
    email: 'john.doe@company.com',
    role: 'admin',
    department: 'Engineering',
    joinDate: '2022-01-15',
    active: true
  },
  {
    id: 2,
    name: 'Jane Smith',
    email: 'jane.smith@company.com',
    role: 'user',
    department: 'Marketing',
    joinDate: '2022-03-20',
    active: true
  },
  {
    id: 3,
    name: 'Mike Johnson',
    email: 'mike.johnson@company.com',
    role: 'moderator',
    department: 'Support',
    joinDate: '2021-11-10',
    active: false
  },
  {
    id: 4,
    name: 'Sarah Wilson',
    email: 'sarah.wilson@company.com',
    role: 'user',
    department: 'Engineering',
    joinDate: '2023-01-05',
    active: true
  },
  {
    id: 5,
    name: 'Tom Brown',
    email: 'tom.brown@company.com',
    role: 'admin',
    department: 'Operations',
    joinDate: '2020-08-12',
    active: true
  },
  {
    id: 6,
    name: 'Lisa Davis',
    email: 'lisa.davis@company.com',
    role: 'user',
    department: 'Marketing',
    joinDate: '2022-06-18',
    active: true
  },
  {
    id: 7,
    name: 'Chris Anderson',
    email: 'chris.anderson@company.com',
    role: 'moderator',
    department: 'Support',
    joinDate: '2021-09-25',
    active: false
  },
  {
    id: 8,
    name: 'Emma Taylor',
    email: 'emma.taylor@company.com',
    role: 'user',
    department: 'Engineering',
    joinDate: '2023-04-10',
    active: true
  }
];

const getRoleColor = (role: string) => {
  switch (role) {
    case 'admin': return 'red';
    case 'moderator': return 'blue';
    case 'user': return 'green';
    default: return 'gray';
  }
};

export default function RowSelectionDemo() {
  const [selectedRows, setSelectedRows] = useState<(string | number)[]>([]);
  const [sortBy, setSortBy] = useState<DataTableSort[]>([]);
  const [pagination, setPagination] = useState<DataTablePagination>({
    page: 1,
    pageSize: 5,
    total: sampleUsers.length
  });

  const columns: DataTableColumn<User>[] = [
    {
      key: 'name',
      header: 'Name',
      accessor: 'name',
      sortable: true,
      filterable: true,
      filterType: 'text'
    },
    {
      key: 'email',
      header: 'Email',
      accessor: 'email',
      sortable: true,
      filterable: true,
      filterType: 'text'
    },
    {
      key: 'role',
      header: 'Role',
      accessor: 'role',
      cell: (role: string) => (
        <Text style={{ 
          backgroundColor: getRoleColor(role) === 'red' ? '#fee2e2' : 
                          getRoleColor(role) === 'blue' ? '#dbeafe' : '#dcfce7',
          color: getRoleColor(role) === 'red' ? '#dc2626' :
                 getRoleColor(role) === 'blue' ? '#2563eb' : '#16a34a',
          paddingHorizontal: 8,
          paddingVertical: 4,
          borderRadius: 4,
          fontSize: 12,
          fontWeight: '500'
        }}>
          {role}
        </Text>
      ),
      sortable: true,
      filterable: true,
      filterType: 'select',
      filterOptions: [
        { label: 'Admin', value: 'admin' },
        { label: 'Moderator', value: 'moderator' },
        { label: 'User', value: 'user' }
      ]
    },
    {
      key: 'department',
      header: 'Department',
      accessor: 'department',
      sortable: true,
      filterable: true,
      filterType: 'select',
      filterOptions: [
        { label: 'Engineering', value: 'Engineering' },
        { label: 'Marketing', value: 'Marketing' },
        { label: 'Support', value: 'Support' },
        { label: 'Operations', value: 'Operations' }
      ]
    },
    {
      key: 'joinDate',
      header: 'Join Date',
      accessor: 'joinDate',
      sortable: true,
      dataType: 'date'
    },
    {
      key: 'status',
      header: 'Status',
      accessor: 'active',
      cell: (active: boolean) => (
        <Text style={{ 
          backgroundColor: active ? '#dcfce7' : '#fee2e2',
          color: active ? '#16a34a' : '#dc2626',
          paddingHorizontal: 8,
          paddingVertical: 4,
          borderRadius: 4,
          fontSize: 12,
          fontWeight: '500'
        }}>
          {active ? 'Active' : 'Inactive'}
        </Text>
      ),
      sortable: true,
      filterable: true,
      filterType: 'boolean'
    }
  ];

  const handleBulkAction = (action: string, selected: (string | number)[]) => {
    const selectedUsers = sampleUsers.filter(user => selected.includes(user.id));
    
    switch (action) {
      case 'activate':
        Alert.alert(
          'Bulk Activate',
          `Activate ${selectedUsers.length} users?\\n\\n${selectedUsers.map(u => u.name).join(', ')}`
        );
        break;
      case 'deactivate':
        Alert.alert(
          'Bulk Deactivate',
          `Deactivate ${selectedUsers.length} users?\\n\\n${selectedUsers.map(u => u.name).join(', ')}`
        );
        break;
      case 'delete':
        Alert.alert(
          'Bulk Delete',
          `Delete ${selectedUsers.length} users?\\n\\n${selectedUsers.map(u => u.name).join(', ')}`,
          [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Delete', style: 'destructive' }
          ]
        );
        break;
      case 'export':
        Alert.alert(
          'Export Users',
          `Export ${selectedUsers.length} users to CSV?\\n\\n${selectedUsers.map(u => u.name).join(', ')}`
        );
        break;
    }
  };

  const bulkActions = [
    {
      key: 'activate',
      label: 'Activate Users',
      icon: '✓',
      action: (selected: (string | number)[]) => handleBulkAction('activate', selected)
    },
    {
      key: 'deactivate',
      label: 'Deactivate Users',
      icon: '⏸',
      action: (selected: (string | number)[]) => handleBulkAction('deactivate', selected)
    },
    {
      key: 'export',
      label: 'Export to CSV',
      icon: '📄',
      action: (selected: (string | number)[]) => handleBulkAction('export', selected)
    },
    {
      key: 'delete',
      label: 'Delete Users',
      icon: '🗑',
      action: (selected: (string | number)[]) => handleBulkAction('delete', selected)
    }
  ];

  return (
    <Card>
      <Flex direction="column" gap={16}>
        <Flex direction="column" gap={8}>
          <Text size="lg" weight="bold">Enhanced Row Selection</Text>
          <Text color="muted">
            DataTable with advanced row selection featuring shift-click range selection, 
            indeterminate header states, bulk actions, and enhanced selection UI.
          </Text>
        </Flex>

        {/* Selection Info */}
        {selectedRows.length > 0 && (
          <Flex direction="row" gap={12} style={{ flexWrap: 'wrap' }}>
            <Text style={{ 
              backgroundColor: '#dbeafe',
              color: '#2563eb',
              paddingHorizontal: 12,
              paddingVertical: 6,
              borderRadius: 6,
              fontSize: 14,
              fontWeight: '600'
            }}>
              {selectedRows.length} selected
            </Text>
            
            <Button
              variant="outline"
              size="sm"
              onPress={() => setSelectedRows([])}
            >
              Clear Selection
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onPress={() => setSelectedRows(sampleUsers.map(u => u.id))}
            >
              Select All
            </Button>
          </Flex>
        )}

        {/* Feature Highlights */}
        <Card style={{ backgroundColor: '#f8f9fa', padding: 16, borderRadius: 8 }}>
          <Flex direction="column" gap={8}>
            <Text size="sm" weight="medium">💡 Enhanced Selection Features:</Text>
            <Text size="sm" color="muted">• Click checkboxes to select individual rows</Text>
            <Text size="sm" color="muted">• Header checkbox shows indeterminate state when partially selected</Text>
            <Text size="sm" color="muted">• Bulk actions appear when rows are selected</Text>
            <Text size="sm" color="muted">• Selection persists across pagination and filtering</Text>
            <Text size="sm" color="muted">• Enhanced visual feedback for selected states</Text>
          </Flex>
        </Card>

        <DataTable
          data={sampleUsers}
          columns={columns}
          selectable={true}
          selectedRows={selectedRows}
          onSelectionChange={setSelectedRows}
          getRowId={(row) => row.id}
          searchable={true}
          searchPlaceholder="Search users..."
          sortBy={sortBy}
          onSortChange={setSortBy}
          pagination={pagination}
          onPaginationChange={setPagination}
          bulkActions={bulkActions}
          variant="striped"
          density="normal"
          enhancedSelection={true}
          hoverHighlight={true}
          rowBorderColor="#e2e8f0"
          rowBorderWidth={1}
          headerBackgroundColor="#f8fafc"
        />
      </Flex>
    </Card>
  );
}