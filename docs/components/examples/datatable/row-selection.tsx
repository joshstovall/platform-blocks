import React, { useState } from 'react';
import { Alert } from 'react-native';

import { DataTable, Button, Text, Flex, Badge, Avatar, ToggleButton, ToggleGroup, Indicator } from '@platform-blocks/ui';

interface User {
  id: number;
  name: string;
  email: string;
  role: 'admin' | 'user' | 'moderator';
  department: string;
  joinDate: Date;
  active: boolean;
  avatar?: string;
}

const sampleUsers: User[] = [
  {
    id: 1,
    name: 'John Doe',
    email: 'john.doe@company.com',
    role: 'admin',
    department: 'Engineering',
    joinDate: new Date('2022-01-15'),
    active: true,
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=john'
  },
  {
    id: 2,
    name: 'Jane Smith',
    email: 'jane.smith@company.com',
    role: 'user',
    department: 'Marketing',
    joinDate: new Date('2022-03-20'),
    active: true,
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=jane'
  },
  {
    id: 3,
    name: 'Mike Johnson',
    email: 'mike.johnson@company.com',
    role: 'moderator',
    department: 'Support',
    joinDate: new Date('2021-11-10'),
    active: false,
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=mike'
  },
  {
    id: 4,
    name: 'Sarah Wilson',
    email: 'sarah.wilson@company.com',
    role: 'user',
    department: 'Engineering',
    joinDate: new Date('2023-01-05'),
    active: true,
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=sarah'
  },
  {
    id: 5,
    name: 'Tom Brown',
    email: 'tom.brown@company.com',
    role: 'admin',
    department: 'Operations',
    joinDate: new Date('2020-08-12'),
    active: true,
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=tom'
  },
  {
    id: 6,
    name: 'Lisa Davis',
    email: 'lisa.davis@company.com',
    role: 'user',
    department: 'Marketing',
    joinDate: new Date('2022-06-18'),
    active: true,
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=lisa'
  },
  {
    id: 7,
    name: 'Chris Anderson',
    email: 'chris.anderson@company.com',
    role: 'moderator',
    department: 'Support',
    joinDate: new Date('2021-09-25'),
    active: false,
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=chris'
  },
  {
    id: 8,
    name: 'Emma Taylor',
    email: 'emma.taylor@company.com',
    role: 'user',
    department: 'Engineering',
    joinDate: new Date('2023-04-10'),
    active: true,
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=emma'
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
  const [selectionMode, setSelectionMode] = useState<'multi' | 'single'>('multi');

  const columns = [
    {
      key: 'user',
      header: 'User',
      accessor: (row: User) => row,
      cell: (user: User) => (
  <Flex direction="row" align="center" gap={12}>
          <Avatar
            src={ user.avatar }
            size={32}
            fallback={user.name.split(' ').map(n => n[0]).join('')}
          />
          <Flex direction="column" gap={2}>
            <Text weight="medium">{user.name}</Text>
            <Text size="sm" color="muted">{user.email}</Text>
          </Flex>
        </Flex>
      ),
      sortable: true,
      compare: (a: User, b: User) => a.name.localeCompare(b.name)
    },
    {
      key: 'role',
      header: 'Role',
      accessor: 'role' as keyof User,
      cell: (role: string) => (
        <Indicator color={getRoleColor(role)}>
          <Text size="xs" weight="medium" color="white">
            {role}
          </Text>
        </Indicator>
      ),
      sortable: true,
      filterable: true,
      filterType: 'select' as const,
      filterOptions: [
        { label: 'Admin', value: 'admin' },
        { label: 'Moderator', value: 'moderator' },
        { label: 'User', value: 'user' }
      ]
    },
    {
      key: 'department',
      header: 'Department',
      accessor: 'department' as keyof User,
      sortable: true,
      filterable: true,
      filterType: 'select' as const,
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
      accessor: 'joinDate' as keyof User,
      cell: (date: Date) => date.toLocaleDateString(),
      sortable: true,
      dataType: 'date' as const
    },
    {
      key: 'status',
      header: 'Status',
      accessor: 'active' as keyof User,
      cell: (active: boolean) => (
        <Indicator color={active ? 'green' : 'red'}>
          <Text size="xs" weight="medium" color="white">
            {active ? 'Active' : 'Inactive'}
          </Text>
        </Indicator>
      ),
      sortable: true,
      filterable: true,
      filterType: 'boolean' as const
    }
  ];

  const handleBulkAction = (action: string, selected: (string | number)[]) => {
    const selectedUsers = sampleUsers.filter(user => selected.includes(user.id));
    
    switch (action) {
      case 'activate':
        Alert.alert(
          'Bulk Activate',
          `Activate ${selectedUsers.length} users?\n\n${selectedUsers.map(u => u.name).join(', ')}`
        );
        break;
      case 'deactivate':
        Alert.alert(
          'Bulk Deactivate',
          `Deactivate ${selectedUsers.length} users?\n\n${selectedUsers.map(u => u.name).join(', ')}`
        );
        break;
      case 'delete':
        Alert.alert(
          'Bulk Delete',
          `Delete ${selectedUsers.length} users?\n\n${selectedUsers.map(u => u.name).join(', ')}`,
          [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Delete', style: 'destructive' }
          ]
        );
        break;
      case 'export':
        Alert.alert(
          'Export Users',
          `Export ${selectedUsers.length} users to CSV?\n\n${selectedUsers.map(u => u.name).join(', ')}`
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
    <Flex direction="column" gap={20}>
      <Flex direction="column" gap={12}>
        <Text size="lg" weight="bold">Enhanced Row Selection</Text>
        <Text color="muted">
          DataTable with advanced row selection featuring shift-click range selection, 
          indeterminate states, bulk actions, and ToggleButton integration.
        </Text>
      </Flex>

      {/* Selection Controls */}
  <Flex direction="row" gap={16} align="center" wrap="wrap">
        <Text weight="medium">Selection Mode:</Text>
        <ToggleGroup 
          value={selectionMode}
          exclusive
          onChange={(value) => {
            setSelectionMode(value as 'multi' | 'single');
            if (value === 'single' && selectedRows.length > 1) {
              setSelectedRows(selectedRows.slice(0, 1));
            }
          }}
        >
          <ToggleButton value="multi">Multi-Select</ToggleButton>
          <ToggleButton value="single">Single Select</ToggleButton>
        </ToggleGroup>

        {selectedRows.length > 0 && (
          <Indicator color="primary">
            <Text size="xs" weight="medium" color="white">
              {selectedRows.length} selected
            </Text>
          </Indicator>
        )}
      </Flex>

      {/* Quick Actions */}
      {selectedRows.length > 0 && (
  <Flex direction="row" gap={12} wrap="wrap">
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
          <Button
            variant="outline"
            size="sm"
            onPress={() => {
              const activeUsers = sampleUsers.filter(u => u.active).map(u => u.id);
              setSelectedRows(activeUsers);
            }}
          >
            Select Active Only
          </Button>
        </Flex>
      )}

      {/* Instructions */}
  <Flex direction="column" gap={8} p={16} style={{ backgroundColor: '#f8f9fa', borderRadius: 8 }}>
        <Text size="sm" weight="medium">💡 Selection Features:</Text>
        <Text size="sm" color="muted">• Click checkboxes to select individual rows</Text>
        <Text size="sm" color="muted">• Header checkbox shows indeterminate state when partially selected</Text>
        <Text size="sm" color="muted">• Bulk actions appear when rows are selected</Text>
        <Text size="sm" color="muted">• Selection persists across pagination and filtering</Text>
        <Text size="sm" color="muted">• Try switching between single and multi-select modes</Text>
      </Flex>

      <DataTable
        data={sampleUsers}
        columns={columns}
        selectable={true}
        selectedRows={selectedRows}
        onSelectionChange={setSelectedRows}
        getRowId={(row) => row.id}
        searchable={true}
        searchPlaceholder="Search users..."
        pagination={{
          page: 1,
          pageSize: 5,
          total: sampleUsers.length
        }}
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
  );
}