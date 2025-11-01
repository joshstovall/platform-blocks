import { Table, Text } from '@platform-blocks/ui';

export default function Demo() {
  const data = {
    caption: 'User accounts overview',
    head: ['Name', 'Role', 'Status', 'Posts'],
    body: [
      ['Alice', 'Admin', 'Active', 128],
      ['Bob', 'Editor', 'Invited', 42],
      ['Carol', 'Viewer', 'Active', 5],
      ['Dave', 'Editor', 'Suspended', 16],
    ],
  };

  return (
    <Table data={data} withTableBorder fullWidth />
  );
}
