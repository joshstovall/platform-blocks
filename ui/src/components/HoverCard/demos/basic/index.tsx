import React from 'react';
import { View } from 'react-native';
import { Text, HoverCard, Button, Flex } from '../../../';

export default function HoverCardBasicDemo() {
  return (
    <Flex gap={24} style={{ padding: 16 }}>
      <HoverCard
        target={<Button variant="outline" size="sm">Hover me</Button>}
        position="top"
        withArrow
      >
        <Text variant="body" weight="semibold">Simple hover card</Text>
        <Text variant="caption" colorVariant="muted" style={{ marginTop: 4 }}>
          Appears when you hover or tap (on mobile) the target.
        </Text>
      </HoverCard>

      <HoverCard
        target={<Text style={{ textDecorationLine: 'underline' }}>Inline text trigger</Text>}
        position="right"
        offset={12}
        shadow="lg"
        radius="lg"
        withArrow
      >
        <Text variant="body">You can wrap any element.</Text>
      </HoverCard>

      <HoverCard
        target={<Button variant="filled" size="sm">Click trigger</Button>}
        trigger="click"
        position="bottom"
        withArrow
      >
        <Text variant="body">Opened via click. Click again (or outside) to close.</Text>
      </HoverCard>
    </Flex>
  );
}
