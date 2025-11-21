import { useState } from 'react';
import { Card, Column, Flex, NumberInput, Text } from '@platform-blocks/ui';

export default function Demo() {
  const [price, setPrice] = useState<number | undefined>(249.99);
  const [discount, setDiscount] = useState<number | undefined>(10);

  const finalPrice = price != null && discount != null
    ? price * (1 - discount / 100)
    : undefined;

  return (
    <Card padding={16}>
      <Column gap={16}>
        <Text variant="h6">Formatted Values</Text>
        <Flex gap={16} direction="column">
          <NumberInput
            label="List price"
            value={price}
            onChange={setPrice}
            format="currency"
            currency="USD"
            fixedDecimalScale
            decimalScale={2}
            min={0}
            allowNegative={false}
          />
          <NumberInput
            label="Discount"
            value={discount}
            onChange={setDiscount}
            suffix="%"
            min={0}
            max={100}
            step={0.5}
            allowDecimal
          />
        </Flex>
        <Text size="sm" color="muted">
          Final price: {finalPrice != null ? `$${finalPrice.toFixed(2)}` : '—'}
        </Text>
      </Column>
    </Card>
  );
}
