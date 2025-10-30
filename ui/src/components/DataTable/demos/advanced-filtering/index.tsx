import { useState } from 'react';
import { DataTable, Text, Card, Button, Flex } from '@platform-blocks/ui';
import type { DataTableColumn, DataTableSort, DataTableFilter } from '../../types';

// Sample data representing a comprehensive business dataset
interface Employee {
  id: number;
  name: string;
  email: string;
  department: 'Engineering' | 'Marketing' | 'Sales' | 'HR' | 'Finance';
  role: string;
  salary: number;
  startDate: string;
  isActive: boolean;
  performance: number;
  location: 'Remote' | 'New York' | 'San Francisco' | 'London' | 'Tokyo';
  skills: string[];
}

const sampleEmployees: Employee[] = [
  {
    id: 1,
    name: 'Alice Johnson',
    email: 'alice.johnson@company.com',
    department: 'Engineering',
    role: 'Senior Software Engineer',
    salary: 120000,
    startDate: '2020-03-15',
    isActive: true,
    performance: 4.8,
    location: 'San Francisco',
    skills: ['React', 'TypeScript', 'Node.js']
  },
  {
    id: 2,
    name: 'Bob Smith',
    email: 'bob.smith@company.com',
    department: 'Marketing',
    role: 'Marketing Manager',
    salary: 85000,
    startDate: '2019-08-22',
    isActive: true,
    performance: 4.2,
    location: 'New York',
    skills: ['SEO', 'Content Marketing', 'Analytics']
  },
  {
    id: 3,
    name: 'Carol Davis',
    email: 'carol.davis@company.com',
    department: 'Sales',
    role: 'Account Executive',
    salary: 75000,
    startDate: '2021-01-10',
    isActive: false,
    performance: 3.9,
    location: 'Remote',
    skills: ['Sales', 'CRM', 'Negotiation']
  },
  {
    id: 4,
    name: 'David Wilson',
    email: 'david.wilson@company.com',
    department: 'Engineering',
    role: 'DevOps Engineer',
    salary: 110000,
    startDate: '2020-11-05',
    isActive: true,
    performance: 4.6,
    location: 'Remote',
    skills: ['AWS', 'Docker', 'Kubernetes']
  },
  {
    id: 5,
    name: 'Eva Brown',
    email: 'eva.brown@company.com',
    department: 'HR',
    role: 'HR Business Partner',
    salary: 70000,
    startDate: '2018-05-18',
    isActive: true,
    performance: 4.4,
    location: 'London',
    skills: ['Recruiting', 'Employee Relations', 'Performance Management']
  },
  {
    id: 6,
    name: 'Frank Miller',
    email: 'frank.miller@company.com',
    department: 'Finance',
    role: 'Financial Analyst',
    salary: 65000,
    startDate: '2021-09-12',
    isActive: true,
    performance: 4.1,
    location: 'New York',
    skills: ['Excel', 'Financial Modeling', 'Data Analysis']
  },
  {
    id: 7,
    name: 'Grace Lee',
    email: 'grace.lee@company.com',
    department: 'Engineering',
    role: 'Frontend Developer',
    salary: 95000,
    startDate: '2022-02-28',
    isActive: true,
    performance: 4.7,
    location: 'San Francisco',
    skills: ['Vue.js', 'CSS', 'UI/UX']
  },
  {
    id: 8,
    name: 'Henry Taylor',
    email: 'henry.taylor@company.com',
    department: 'Marketing',
    role: 'Content Strategist',
    salary: 60000,
    startDate: '2020-07-14',
    isActive: false,
    performance: 3.8,
    location: 'Remote',
    skills: ['Content Strategy', 'Writing', 'Brand Management']
  },
  {
    id: 9,
    name: 'Ivy Zhang',
    email: 'ivy.zhang@company.com',
    department: 'Sales',
    role: 'Sales Director',
    salary: 140000,
    startDate: '2017-12-01',
    isActive: true,
    performance: 4.9,
    location: 'Tokyo',
    skills: ['Team Leadership', 'Strategic Sales', 'Client Relations']
  },
  {
    id: 10,
    name: 'Jack Rodriguez',
    email: 'jack.rodriguez@company.com',
    department: 'Engineering',
    role: 'Data Engineer',
    salary: 105000,
    startDate: '2021-06-03',
    isActive: true,
    performance: 4.3,
    location: 'Remote',
    skills: ['Python', 'SQL', 'Apache Spark']
  }
];

export default function AdvancedFilteringDemo() {
  const [sortBy, setSortBy] = useState<DataTableSort[]>([]);
  const [filters, setFilters] = useState<DataTableFilter[]>([]);

  const columns: DataTableColumn<Employee>[] = [
    {
      key: 'name',
      header: 'Full Name',
      accessor: 'name',
      sortable: true,
      filterable: true,
      filterType: 'text',
      width: 160
    },
    {
      key: 'email',
      header: 'Email Address',
      accessor: 'email',
      sortable: true,
      filterable: true,
      filterType: 'text',
      width: 200,
      cell: (email: string) => (
        <Text style={{ fontSize: 12, color: '#6366f1', textDecorationLine: 'underline' }}>
          {email}
        </Text>
      )
    },
    {
      key: 'department',
      header: 'Department',
      accessor: 'department',
      sortable: true,
      filterable: true,
      filterType: 'select',
      width: 120,
      cell: (dept: string) => {
        const colors = {
          Engineering: '#10b981',
          Marketing: '#f59e0b',
          Sales: '#ef4444',
          HR: '#8b5cf6',
          Finance: '#06b6d4'
        };
        return (
          <Text style={{ 
            backgroundColor: `${colors[dept as keyof typeof colors]}20`,
            color: colors[dept as keyof typeof colors],
            paddingHorizontal: 8,
            paddingVertical: 4,
            borderRadius: 4,
            fontSize: 11,
            fontWeight: '600'
          }}>
            {dept}
          </Text>
        );
      }
    },
    {
      key: 'role',
      header: 'Job Title',
      accessor: 'role',
      sortable: true,
      filterable: true,
      filterType: 'text',
      width: 180
    },
    {
      key: 'salary',
      header: 'Annual Salary',
      accessor: 'salary',
      sortable: true,
      filterable: true,
      filterType: 'number',
      dataType: 'currency',
      align: 'right',
      width: 120,
      cell: (salary: number) => (
        <Text style={{ 
          fontWeight: '600',
          color: salary >= 100000 ? '#059669' : salary >= 75000 ? '#d97706' : '#dc2626'
        }}>
          ${salary.toLocaleString()}
        </Text>
      )
    },
    {
      key: 'startDate',
      header: 'Start Date',
      accessor: 'startDate',
      sortable: true,
      filterable: true,
      filterType: 'date',
      dataType: 'date',
      width: 110,
      cell: (date: string) => new Date(date).toLocaleDateString('en-US', { 
        year: '2-digit', 
        month: 'short', 
        day: 'numeric' 
      })
    },
    {
      key: 'performance',
      header: 'Rating',
      accessor: 'performance',
      sortable: true,
      filterable: true,
      filterType: 'number',
      align: 'center',
      width: 80,
      cell: (rating: number) => (
        <Text style={{ 
          color: '#f59e0b', 
          fontWeight: '700',
          fontSize: 14
        }}>
          {'★'.repeat(Math.floor(rating))} {rating.toFixed(1)}
        </Text>
      )
    },
    {
      key: 'location',
      header: 'Location',
      accessor: 'location',
      sortable: true,
      filterable: true,
      filterType: 'select',
      width: 110,
      cell: (location: string) => (
        <Text style={{ 
          fontSize: 11,
          color: '#6b7280',
          backgroundColor: '#f3f4f6',
          paddingHorizontal: 6,
          paddingVertical: 3,
          borderRadius: 3
        }}>
          {location}
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
      width: 80,
      cell: (isActive: boolean) => (
        <Text style={{ 
          backgroundColor: isActive ? '#dcfce7' : '#fee2e2',
          color: isActive ? '#16a34a' : '#dc2626',
          paddingHorizontal: 8,
          paddingVertical: 4,
          borderRadius: 12,
          fontSize: 10,
          fontWeight: '600',
          textAlign: 'center'
        }}>
          {isActive ? 'Active' : 'Inactive'}
        </Text>
      )
    }
  ];

  const clearAllFilters = () => {
    setFilters([]);
  };

  const getFilterSummary = () => {
    if (filters.length === 0) return 'No active filters';
    
    const summary = filters.map(filter => {
      const column = columns.find(col => col.key === filter.column);
      const columnName = column?.header || filter.column;
      return `${columnName}: ${filter.operator} "${filter.value}"`;
    }).join(', ');
    
    return `${filters.length} filter${filters.length > 1 ? 's' : ''} active: ${summary}`;
  };

  return (
    <Card>
      <Flex direction="column" gap={16}>
        <Flex direction="column" gap={8}>
          <Text size="lg" weight="bold">Advanced Per-Column Filtering</Text>
          <Text color="muted">
            DataTable with intelligent, context-aware filtering that adapts to each column's data type. 
            Each filter provides the appropriate operators and input controls.
          </Text>
        </Flex>

        {/* Filter Status */}
        <Card style={{ backgroundColor: '#f0f9ff', padding: 16, borderRadius: 8, borderColor: '#0ea5e9', borderWidth: 1 }}>
          <Flex direction="row" justify="space-between" align="center">
            <Text size="sm" style={{ color: '#0c4a6e', flex: 1 }}>
              {getFilterSummary()}
            </Text>
            {filters.length > 0 && (
              <Button
                variant="outline"
                size="sm"
                onPress={clearAllFilters}
                style={{ borderColor: '#0ea5e9' }}
              >
                Clear All Filters
              </Button>
            )}
          </Flex>
        </Card>

        {/* Feature Guide */}
        <Card style={{ backgroundColor: '#f8fafc', padding: 16, borderRadius: 8 }}>
          <Flex direction="column" gap={12}>
            <Text size="sm" weight="medium">🎯 Advanced Filtering Features:</Text>
            
            <Flex direction="column" gap={6}>
              <Text size="sm" color="muted">
                <Text weight="medium">Text Columns:</Text> Contains, equals, starts with, ends with operators
              </Text>
              <Text size="sm" color="muted">
                <Text weight="medium">Number Columns:</Text> =, ≠, {'>'}, ≥, {'<'}, ≤ operators with numeric validation
              </Text>
              <Text size="sm" color="muted">
                <Text weight="medium">Date Columns:</Text> Equals, before, after, contains with date formats
              </Text>
              <Text size="sm" color="muted">
                <Text weight="medium">Select Columns:</Text> Auto-generated options from data or predefined choices
              </Text>
              <Text size="sm" color="muted">
                <Text weight="medium">Boolean Columns:</Text> Yes/No/Any options with smart matching
              </Text>
            </Flex>

            <Text size="sm" color="muted" style={{ marginTop: 8 }}>
              💡 <Text weight="medium">Pro Tip:</Text> Click the settings icon (⚙️) in text/number/date filters to access advanced operators!
            </Text>
          </Flex>
        </Card>

        {/* Instructions */}
        <Card style={{ backgroundColor: '#fef3c7', padding: 16, borderRadius: 8, borderColor: '#f59e0b', borderWidth: 1 }}>
          <Flex direction="column" gap={8}>
            <Text size="sm" weight="medium" style={{ color: '#92400e' }}>🚀 Try These Examples:</Text>
            <Text size="sm" style={{ color: '#a16207' }}>• <Text weight="medium">Salary:</Text> Type "{'>'}{100000}" to find high earners</Text>
            <Text size="sm" style={{ color: '#a16207' }}>• <Text weight="medium">Name:</Text> Click ⚙️ and try "starts with" filter</Text>
            <Text size="sm" style={{ color: '#a16207' }}>• <Text weight="medium">Department:</Text> Select specific departments from dropdown</Text>
            <Text size="sm" style={{ color: '#a16207' }}>• <Text weight="medium">Start Date:</Text> Filter by "2020" to find employees from that year</Text>
            <Text size="sm" style={{ color: '#a16207' }}>• <Text weight="medium">Status:</Text> Toggle between Active/Inactive/Any</Text>
          </Flex>
        </Card>

        <DataTable
          data={sampleEmployees}
          columns={columns}
          getRowId={(row) => row.id}
          searchable={true}
          searchPlaceholder="Global search across all fields..."
          sortBy={sortBy}
          onSortChange={setSortBy}
          filters={filters}
          onFilterChange={setFilters}

          pagination={{
            page: 1,
            pageSize: 8,
            total: sampleEmployees.length
          }}
          variant="striped"
          density="normal"
          hoverHighlight={true}
          rowBorderColor="#e5e7eb"
          rowBorderWidth={1}
          headerBackgroundColor="#f9fafb"
        />

        {/* Technical Implementation */}
        <Card style={{ backgroundColor: '#fefce8', padding: 16, borderRadius: 8, borderColor: '#eab308', borderWidth: 1 }}>
          <Flex direction="column" gap={8}>
            <Text size="sm" weight="medium" style={{ color: '#a16207' }}>⚡ Technical Features:</Text>
            <Text size="sm" style={{ color: '#a16207' }}>• Context-aware filter controls that adapt to column data types</Text>
            <Text size="sm" style={{ color: '#a16207' }}>• Auto-generation of select options from actual data values</Text>
            <Text size="sm" style={{ color: '#a16207' }}>• Advanced operator selection with intuitive symbols ({'>'}, {'<'}, ≠, etc.)</Text>
            <Text size="sm" style={{ color: '#a16207' }}>• Visual filter indicators showing active conditions</Text>
            <Text size="sm" style={{ color: '#a16207' }}>• One-click filter clearing with individual or bulk operations</Text>
            <Text size="sm" style={{ color: '#a16207' }}>• Real-time filter application with optimized performance</Text>
          </Flex>
        </Card>
      </Flex>
    </Card>
  );
}