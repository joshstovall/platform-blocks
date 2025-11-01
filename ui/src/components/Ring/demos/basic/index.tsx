import React, { useState } from 'react';
import { Card, Column, Row, Text, Button, Flex } from '@platform-blocks/ui';
import { Ring } from '../../Ring';

export default function Demo() {
  const [value, setValue] = useState(72);

  const increment = () => setValue(prev => Math.min(prev + 8, 100));
  const decrement = () => setValue(prev => Math.max(prev - 8, 0));

  return (
    <Card>
      <Column gap={16} align="center">
        <Flex gap="lg" wrap="wrap" justify="center">
          <Ring value={value} caption="Completion" />
          <Ring value={value} size={72} thickness={8} caption="Compact" />
          <Ring value={value} size={120} thickness={14} label="Release" subLabel={`${Math.round(value)}%`} />
        </Flex>
        <Text size="sm" color="rgba(100,116,139,0.9)">
          Value: {Math.round(value)}%
        </Text>
        <Row gap={12} justify="center">
          <Button title="Decrease" onPress={decrement} variant="outline" />
          <Button title="Increase" onPress={increment} />
        </Row>
      </Column>
    </Card>
  );
}
