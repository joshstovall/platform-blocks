import { useState } from 'react';
import { Card, Column, NumberInput, Text } from '@platform-blocks/ui';

export default function Demo() {
  const [quantity, setQuantity] = useState<number | undefined>(2);

  return (
    <Card padding={16}>
      <Column gap={16}>
        <Text variant="h6">Basic Number Input</Text>
        <NumberInput
          label="Quantity"
          placeholder="Enter amount"
          value={quantity}
          onChange={setQuantity}
          min={0}
          step={1}
        />
        <Text size="sm" color="muted">
          Current value: {quantity ?? '—'}
        </Text>
      </Column>
    </Card>
  );
}
