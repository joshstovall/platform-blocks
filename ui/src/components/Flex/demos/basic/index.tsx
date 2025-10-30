import { Flex, Card, Text } from '@platform-blocks/ui';

export default function BasicFlexDemo() {
  return (
    <Card variant="outline" p="md">
      <Flex gap="md">
        <Card p="sm">
          <Text variant="body">Item 1</Text>
        </Card>
        <Card p="sm">
          <Text variant="body">Item 2</Text>
        </Card>
        <Card p="sm">
          <Text variant="body">Item 3</Text>
        </Card>
      </Flex>
    </Card>
  );
}
