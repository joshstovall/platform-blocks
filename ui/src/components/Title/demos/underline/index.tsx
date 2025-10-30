import React from 'react';
import { Title, Card, Flex } from '@platform-blocks/ui';

export default function UnderlineTitleDemo() {
  return (
    <Card p="lg">
      <Flex direction="column" gap={20}>
        <Title underline>Underline Only</Title>
        <Title afterline>Afterline Only</Title>
        <Title underline afterline>Underline + Afterline</Title>
        <Title underline underlineColor="#ff4d4f" underlineStroke={4}>Custom Color & Thickness</Title>
      </Flex>
    </Card>
  );
}
