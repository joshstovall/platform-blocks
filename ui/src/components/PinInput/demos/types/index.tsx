import { useState } from 'react';
import { PinInput, Text, Card, Column } from '@platform-blocks/ui';

export default function Demo() {
  const [numericValue, setNumericValue] = useState('');
  const [alphanumericValue, setAlphanumericValue] = useState('');

  return (
    <Column gap={24}>
      <Text variant="h6">PIN Input Types</Text>
      
      <Card padding={16}>
        <Column gap={16}>
          <Text variant="body" weight="medium">Numeric Only (Default)</Text>
          <Text variant="caption" colorVariant="secondary">
            Only numbers 0-9 are allowed
          </Text>
          <PinInput
            value={numericValue}
            onChange={setNumericValue}
            type="numeric"
            label="Numeric PIN"
          />
        </Column>
      </Card>
      
      <Card padding={16}>
        <Column gap={16}>
          <Text variant="body" weight="medium">Alphanumeric</Text>
          <Text variant="caption" colorVariant="secondary">
            Letters and numbers are allowed
          </Text>
          <PinInput
            value={alphanumericValue}
            onChange={setAlphanumericValue}
            type="alphanumeric"
            label="Alphanumeric Code"
            length={6}
          />
        </Column>
      </Card>
    </Column>
  );
}


