import { Flex, Card, Text, Column } from '@platform-blocks/ui';

export default function DirectionFlexDemo() {
  return (
    <Column gap={24}>
      <Column gap={8}>
        <Text variant="h4">Row Direction</Text>
        <Card variant="outline" p="md">
          <Flex direction="row" gap="md">
            <Card p="sm"><Text variant="p">Item 1</Text></Card>
            <Card p="sm"><Text variant="p">Item 2</Text></Card>
            <Card p="sm"><Text variant="p">Item 3</Text></Card>
          </Flex>
        </Card>
      </Column>

      <Column gap={8}>
        <Text variant="h4">Column Direction</Text>
        <Card variant="outline" p="md">
          <Flex direction="column" gap="md">
            <Card p="sm"><Text variant="p">Item 1</Text></Card>
            <Card p="sm"><Text variant="p">Item 2</Text></Card>
            <Card p="sm"><Text variant="p">Item 3</Text></Card>
          </Flex>
        </Card>
      </Column>
    </Column>
  );
}
