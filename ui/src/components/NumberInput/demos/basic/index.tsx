import { useState } from 'react';

import { Column, NumberInput, Text } from '@platform-blocks/ui';

export default function Demo() {
  const [quantity, setQuantity] = useState<number | undefined>(2);

  return (
    <Column gap="sm">
      <Text weight="semibold">Basic number input</Text>
      <Text size="sm" colorVariant="secondary">
        Controlled numeric field with increment buttons and a minimum of zero.
      </Text>
      <NumberInput
        label="Quantity"
        placeholder="Enter amount"
        value={quantity}
        onChange={setQuantity}
        min={0}
        step={1}
      />
      <Text size="xs" colorVariant="secondary">
        Current value: {quantity ?? '—'}
      </Text>
    </Column>
  );
}
