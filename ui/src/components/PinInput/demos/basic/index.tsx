import { useState } from 'react';
import { PinInput, Text, Card, Column } from '@platform-blocks/ui';

export default function Demo() {
  const [value, setValue] = useState('');

  return (
    <Card padding={16}>
      <Column gap={16}>
        <Text variant="h6">Basic PIN Input</Text>
        <Text variant="caption" colorVariant="secondary">
          Enter a 4-digit PIN
        </Text>
        <PinInput
          value={value}
          onChange={setValue}
          label="PIN Code"
          keyboardFocusId="pin-demo-basic"
        />
        {value && (
          <Text variant="caption" colorVariant="secondary">
            Current value: {value}
          </Text>
        )}
      </Column>
    </Card>
  );
}


