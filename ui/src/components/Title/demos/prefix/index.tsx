import React from 'react';
import { Title, Card, Flex, Text, Icon } from '@platform-blocks/ui';

export default function PrefixTitleDemo() {
  return (
    <Card p="lg">
      <Flex direction="column" gap={16}>
        <Title prefix>Default Bar Prefix</Title>
        <Title prefix prefixVariant="dot">Dot Prefix</Title>
        <Title prefix prefixVariant="bar" prefixSize={6} prefixLength={40} prefixColor="#6366f1">Custom Bar Size & Color</Title>
        <Title prefix={<Icon name="star" />} prefixGap={8} prefixColor="#f59e0b">Custom Icon Prefix</Title>
      </Flex>
    </Card>
  );
}
