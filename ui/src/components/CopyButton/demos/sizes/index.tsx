import React from 'react';
import { CopyButton, Card, Flex, Text, Block } from '@platform-blocks/ui';

export default function SizesCopyButtonDemo() {
  return (
    <Block direction="column" gap={16}>
      <Block direction="row" gap={12} align="center">
        <Text size="sm" style={{ width: 60 }}>xs</Text>
        <CopyButton value="alpha" size="xs" />
        <CopyButton value="alpha" size="xs" iconOnly={false} label="Copy" />
      </Block>
      <Block direction="row" gap={12} align="center">
        <Text size="sm" style={{ width: 60 }}>sm</Text>
        <CopyButton value="beta" size="sm" />
        <CopyButton value="beta" size="sm" iconOnly={false} label="Copy" />
      </Block>
      <Block direction="row" gap={12} align="center">
        <Text size="sm" style={{ width: 60 }}>md</Text>
        <CopyButton value="gamma" size="md" />
        <CopyButton value="gamma" size="md" iconOnly={false} label="Copy" />
      </Block>
    </Block>
  );
}
