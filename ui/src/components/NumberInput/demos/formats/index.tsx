import { useState } from 'react';

import { Column, NumberInput, Text } from '@platform-blocks/ui';

export default function Demo() {
  const [price, setPrice] = useState<number | undefined>(249.99);
  const [discount, setDiscount] = useState<number | undefined>(10);

  const finalPrice = price != null && discount != null
    ? price * (1 - discount / 100)
    : undefined;

  return (
    <Column gap="lg">
      <Text weight="semibold">Formatted values</Text>
      <Text size="sm" colorVariant="secondary">
        Pair currency formatting with percentage discounts to display a calculated total.
      </Text>

      <Column gap="sm">
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
      </Column>

      <Text size="xs" colorVariant="secondary">
        Final price: {finalPrice != null ? `$${finalPrice.toFixed(2)}` : '—'}
      </Text>
    </Column>
  );
}
