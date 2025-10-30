import { Spoiler, Text, Flex, Card } from '@platform-blocks/ui';

export default function Demo() {
  return (
    <Flex direction="column" gap={16}>
  <Card p={16} variant="outline">
        <Text size="sm" weight="semibold" mb={8}>Initially Open</Text>
        <Spoiler maxHeight={60} initiallyOpen>
          <Text>
            Starts opened. Click hide to collapse. Vivamus fermentum orci eget tortor facilisis, eu egestas eros maximus. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque habitant morbi tristique senectus et netus.
          </Text>
        </Spoiler>
      </Card>

  <Card p={16} variant="outline">
        <Text size="sm" weight="semibold" mb={8}>Initially Closed</Text>
        <Spoiler maxHeight={60}>
          <Text>
            Starts closed. Vivamus feugiat luctus turpis, vel placerat erat viverra at. Fusce vitae semper libero. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque habitant morbi tristique senectus et netus.
          </Text>
        </Spoiler>
      </Card>
    </Flex>
  );
}
