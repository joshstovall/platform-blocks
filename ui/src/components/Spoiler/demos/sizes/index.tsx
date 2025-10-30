import { Spoiler, Text, Flex, Card } from '@platform-blocks/ui';

export default function Demo() {
  const longText = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Integer tincidunt condimentum risus, sit amet cursus massa fermentum non.';

  return (
    <Flex direction="column" gap={16}>
      <Card p={16} variant="outline">
        <Text size="sm" weight="semibold" mb={8}>Small Height (60px)</Text>
        <Spoiler maxHeight={60}>
          <Text>{longText}</Text>
        </Spoiler>
      </Card>

      <Card p={16} variant="outline">
        <Text size="sm" weight="semibold" mb={8}>Medium Height (100px)</Text>
        <Spoiler maxHeight={100}>
          <Text>{longText}</Text>
        </Spoiler>
      </Card>

      <Card p={16} variant="outline">
        <Text size="sm" weight="semibold" mb={8}>Large Height (150px)</Text>
        <Spoiler maxHeight={150}>
          <Text>{longText}</Text>
        </Spoiler>
      </Card>
    </Flex>
  );
}
