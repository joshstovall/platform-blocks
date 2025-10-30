import React from 'react';
import { Title, Card, Flex, Text } from '@platform-blocks/ui';

export default function BasicTitleDemo() {
  return (
    <Card p="lg">
      <Flex direction="column" gap={12}>
        <Title>Default Title (h2)</Title>
        <Text size="sm" colorVariant="secondary">Uses order=2 mapping to Text variant h2</Text>
      </Flex>
    </Card>
  );
}
