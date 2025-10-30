import { Text, Space, Column } from '@platform-blocks/ui';

export default function BasicSpaceDemo() {
  return (
    <Column>
      <Text>First line</Text>
      <Space h="md" />
      <Text>Second line</Text>
      <Space h={32} />
      <Text>Custom numeric spacing</Text>
    </Column>
  );
}
