import { ReactNode } from 'react';
import { View } from 'react-native';
import { Flex, Text, Indicator, Card } from '@platform-blocks/ui';

const Box = ({ children }: { children: ReactNode }) => (
  <Card style={{ width: 70, height: 70,  borderRadius: 12, position: 'relative', alignItems: 'center', justifyContent: 'center' }}>{children}</Card>
);

export default function IndicatorPlacementsDemo() {
  return (
    <Flex direction="column" gap={16} p={16}>
      <Text size="sm" weight="semibold">Placements</Text>
      <Flex direction="row" gap={16} wrap="wrap">
        <Card>
          <Text size="xs">TL</Text>
          <Indicator placement="top-left" color="#F59E0B" />
        </Card>
        <Card>
          <Text size="xs">TR</Text>
          <Indicator placement="top-right" color="#10B981" />
        </Card>
        <Card>
          <Text size="xs">BL</Text>
          <Indicator placement="bottom-left" color="#6366F1" />
        </Card>
        <Card>
          <Text size="xs">BR</Text>
          <Indicator placement="bottom-right" color="#EF4444" />
        </Card>
      </Flex>

      <Text size="sm" weight="semibold">Offset + Content</Text>
      <Flex direction="row" gap={16} wrap="wrap">
        <Box>
          <Indicator placement="top-right" size={22} offset={6} color="#6366F1">
            <Text size="xs" weight="bold" color="white">9</Text>
          </Indicator>
          <Text size="xs">9</Text>
        </Box>
        <Box>
          <Indicator placement="bottom-right" size={22} offset={4} color="#10B981">
            <Text size="xs" weight="bold" color="white">2</Text>
          </Indicator>
          <Text size="xs">2 new</Text>
        </Box>
      </Flex>
    </Flex>
  );
}
