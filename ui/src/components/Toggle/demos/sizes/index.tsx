import { ToggleButton, ToggleGroup, Text, Flex, Card } from '@platform-blocks/ui';

export default function SizesToggleDemo() {
  return (
    <Card>
      <Flex direction="column" gap={16}>
        <Text size="lg" weight="semibold">Toggle Sizes</Text>
        <Flex direction="column" gap={12} align="flex-start">
          <Flex direction="column" gap={8} align="flex-start">
            <Text size="sm" weight="semibold">Small</Text>
            <ToggleGroup size="sm">
              <ToggleButton value="left">Left</ToggleButton>
              <ToggleButton value="center">Center</ToggleButton>
              <ToggleButton value="right">Right</ToggleButton>
            </ToggleGroup>
          </Flex>
          
          <Flex direction="column" gap={8} align="flex-start">
            <Text size="sm" weight="semibold">Medium</Text>
            <ToggleGroup size="md">
              <ToggleButton value="left">Left</ToggleButton>
              <ToggleButton value="center">Center</ToggleButton>
              <ToggleButton value="right">Right</ToggleButton>
            </ToggleGroup>
          </Flex>
          
          <Flex direction="column" gap={8} align="flex-start">
            <Text size="sm" weight="semibold">Large</Text>
            <ToggleGroup size="lg">
              <ToggleButton value="left">Left</ToggleButton>
              <ToggleButton value="center">Center</ToggleButton>
              <ToggleButton value="right">Right</ToggleButton>
            </ToggleGroup>
          </Flex>
        </Flex>
      </Flex>
    </Card>
  );
}
