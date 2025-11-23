import { useState } from 'react';

import { Column, PinInput, Text } from '@platform-blocks/ui';

export default function Demo() {
  const [numericValue, setNumericValue] = useState('');
  const [alphanumericValue, setAlphanumericValue] = useState('');

  return (
    <Column gap="lg">
      <Text weight="semibold">PIN input types</Text>

      <Column gap="sm">
        <Text size="sm" weight="semibold">
          Numeric (default)
        </Text>
        <Text size="sm" colorVariant="secondary">
          Restricts entry to digits 0-9 for PIN and OTP flows.
        </Text>
        <PinInput
          value={numericValue}
          onChange={setNumericValue}
          type="numeric"
          label="Numeric PIN"
        />
      </Column>

      <Column gap="sm">
        <Text size="sm" weight="semibold">
          Alphanumeric
        </Text>
        <Text size="sm" colorVariant="secondary">
          Allow letters and numbers for recovery or backup codes.
        </Text>
        <PinInput
          value={alphanumericValue}
          onChange={setAlphanumericValue}
          type="alphanumeric"
          label="Alphanumeric code"
          length={6}
        />
      </Column>
    </Column>
  );
}


