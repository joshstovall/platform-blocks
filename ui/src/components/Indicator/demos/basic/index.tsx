import React from 'react';
import { Flex, Text, Avatar, Indicator, Card, Block } from '@platform-blocks/ui';

export default function IndicatorBasicDemo() {
  return (
    <Flex direction="column" gap={20} p={16} >
      <Text size="sm" weight="semibold">Corner Indicator</Text>
      <Card variant="filled">
        <Text size="xs">Panel</Text>
        <Indicator placement="top-right" />
      </Card>
      <Text size="sm" weight="semibold">Avatar Status (online)</Text>
      <Avatar size="lg" fallback="JS" backgroundColor="#6366F1" online />
      <Text size="sm" weight="semibold">Numeric Counter</Text>
      <Block style={{ width: 56, height: 56, backgroundColor: '#ddd', borderRadius: 12, position: 'relative', alignItems: 'center', justifyContent: 'center' }}>
        <Text size="xs">Inbox</Text>
        <Indicator placement="top-right" size={20} offset={3}>
          <Text size="xs" weight="bold" color="white">5</Text>
        </Indicator>
      </Block>
    </Flex>
  );
}
