// Pinned/sticky columns demo — Employee pinned left, Salary pinned right.
import { Column, DataTable, Text } from '@platform-blocks/ui';
import type { DataTableColumn } from '@platform-blocks/ui';

type Employee = {
  id: number;
  name: string;
  title: string;
  department: string;
  location: string;
  email: string;
  phone: string;
  startDate: string;
  salary: number;
};

const rows: Employee[] = [
  { id: 1, name: 'Dana Moss', title: 'Staff Engineer', department: 'Platform', location: 'Berlin', email: 'dana.moss@example.com', phone: '+49 30 1234567', startDate: '2019-04-02', salary: 148000 },
  { id: 2, name: 'Noah Reed', title: 'Product Designer', department: 'Design', location: 'Austin', email: 'noah.reed@example.com', phone: '+1 512 555 0198', startDate: '2021-09-13', salary: 122000 },
  { id: 3, name: 'Priya Singh', title: 'Engineering Manager', department: 'Payments', location: 'Bangalore', email: 'priya.singh@example.com', phone: '+91 80 4000 1234', startDate: '2018-01-22', salary: 165000 },
  { id: 4, name: 'Marco Bianchi', title: 'Data Scientist', department: 'Insights', location: 'Milan', email: 'marco.bianchi@example.com', phone: '+39 02 9876543', startDate: '2022-06-01', salary: 118000 },
  { id: 5, name: 'Aisha Khan', title: 'Frontend Engineer', department: 'Growth', location: 'Toronto', email: 'aisha.khan@example.com', phone: '+1 416 555 0142', startDate: '2020-11-30', salary: 134000 },
];

// Pin the identity column on the left and the salary column on the right so
// they stay visible while the middle columns scroll horizontally.
const columns: DataTableColumn<Employee>[] = [
  {
    key: 'name',
    header: 'Employee',
    accessor: 'name',
    sticky: 'left',
    width: 200,
    sortable: true,
    cell: (_v, row) => (
      <Column gap="xs">
        <Text weight="semibold">{row.name}</Text>
        <Text variant="small" colorVariant="muted">{row.title}</Text>
      </Column>
    ),
  },
  { key: 'department', header: 'Department', accessor: 'department', width: 160, sortable: true },
  { key: 'location', header: 'Location', accessor: 'location', width: 160 },
  { key: 'email', header: 'Email', accessor: 'email', width: 240 },
  { key: 'phone', header: 'Phone', accessor: 'phone', width: 180 },
  { key: 'startDate', header: 'Start date', accessor: 'startDate', dataType: 'date', width: 150 },
  {
    key: 'salary',
    header: 'Salary',
    accessor: 'salary',
    sticky: 'right',
    width: 140,
    dataType: 'currency',
    align: 'right',
    sortable: true,
  },
];

export default function Demo() {
  return (
    <Column gap="sm" fullWidth>
      <Text size="sm" colorVariant="secondary">
        Scroll the table horizontally — the Employee column stays pinned to the
        left and Salary stays pinned to the right (web).
      </Text>
      <DataTable
        data={rows}
        columns={columns}
        fullWidth={false}
        searchable={false}
        showColumnVisibilityManager={false}
      />
    </Column>
  );
}
