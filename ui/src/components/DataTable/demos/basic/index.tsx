import { useState } from 'react';
import { DataTable, Text, Card } from '@platform-blocks/ui';
import type { DataTableColumn, DataTableSort, DataTablePagination } from '@platform-blocks/ui';

// Sample data
interface Employee {
  id: number;
  name: string;
  email: string;
  role: string;
  status: 'active' | 'inactive' | 'pending';
  department: string;
}

const sampleData: Employee[] = [
  { id: 1, name: 'John Doe', email: 'john@company.com', role: 'Developer', status: 'active', department: 'Engineering' },
  { id: 2, name: 'Jane Smith', email: 'jane@company.com', role: 'Designer', status: 'active', department: 'Design' },
  { id: 3, name: 'Mike Johnson', email: 'mike@company.com', role: 'Manager', status: 'active', department: 'Marketing' },
  { id: 4, name: 'Sarah Wilson', email: 'sarah@company.com', role: 'Developer', status: 'inactive', department: 'Engineering' },
  { id: 5, name: 'David Brown', email: 'david@company.com', role: 'Admin', status: 'active', department: 'IT' },
];

export default function Demo() {
  const [sortBy, setSortBy] = useState<DataTableSort[]>([]);
  const [pagination, setPagination] = useState<DataTablePagination>({
    page: 1,
    pageSize: 3,
    total: 5
  });
  const [selectedRows, setSelectedRows] = useState<(string | number)[]>([]);

  const columns: DataTableColumn<Employee>[] = [
    {
      key: 'name',
      header: 'Name',
      accessor: 'name',
      sortable: true,
      cell: (value: any) => (
        <Text weight="semibold">{value}</Text>
      )
    },
    {
      key: 'email',
      header: 'Email',
      accessor: 'email',
      sortable: true
    },
    {
      key: 'role',
      header: 'Role',
      accessor: 'role',
      sortable: true
    },
    {
      key: 'status',
      header: 'Status',
      accessor: 'status',
      sortable: true,
      cell: (value: any) => (
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
      sortable: true
    }
  ];

  return (
  <Card p={16} variant="outline">
      <DataTable
        data={sampleData}
        columns={columns}
        sortBy={sortBy}
        onSortChange={setSortBy}
        pagination={pagination}
        onPaginationChange={setPagination}
        selectedRows={selectedRows}
        onSelectionChange={setSelectedRows}
      />
    </Card>
  );
}
