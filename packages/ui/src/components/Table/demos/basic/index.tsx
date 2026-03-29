import { Card, Column, Table, Text } from '@platform-blocks/ui';

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

export default function Demo() {
  return (
    <Column gap="lg">
      <Card p="md">
        <Column gap="sm">
          <Text size="sm" colorVariant="secondary">
            Provide the `data` prop to render the caption, header, and body automatically.
          </Text>
          <Table data={data} withTableBorder fullWidth />
        </Column>
      </Card>
    </Column>
  );
}
