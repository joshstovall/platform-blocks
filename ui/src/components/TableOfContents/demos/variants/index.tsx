import React from 'react';
import { TableOfContents, Flex, Text } from '@platform-blocks/ui';

export default function Demo() {
  return (
    <Flex direction="column" gap={16}>
  <Flex gap={12} style={{ flexWrap: 'wrap' }}>
        <Flex direction="column" gap={4}>
          <Text size="sm" weight="semibold">None</Text>
          <TableOfContents variant="none" size="xs" style={{ maxWidth: 240 }} />
        </Flex>
        <Flex direction="column" gap={4}>
          <Text size="sm" weight="semibold">Outline</Text>
          <TableOfContents variant="outline" size="xs" style={{ maxWidth: 240 }} />
        </Flex>
        <Flex direction="column" gap={4}>
          <Text size="sm" weight="semibold">Ghost</Text>
          <TableOfContents variant="ghost" size="xs" style={{ maxWidth: 240 }} />
        </Flex>
        <Flex direction="column" gap={4}>
          <Text size="sm" weight="semibold">Filled</Text>
          <TableOfContents variant="filled" color="#3b82f6" size="xs" autoContrast style={{ maxWidth: 240 }} />
        </Flex>
      </Flex>
    </Flex>
  );
}
