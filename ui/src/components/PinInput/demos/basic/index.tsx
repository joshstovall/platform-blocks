import { useState } from 'react';

import { Column, PinInput, Text } from '@platform-blocks/ui';

export default function Demo() {
  const [value, setValue] = useState('');

  return (
    <Column gap="sm">
      <Text weight="semibold">Basic PIN input</Text>
      <Text size="sm" colorVariant="secondary">
        Controlled 4-digit PIN field with automatic focus management.
      </Text>
      <PinInput
        value={value}
        onChange={setValue}
        label="PIN code"
        keyboardFocusId="pin-demo-basic"
      />
      {value && (
        <Text size="xs" colorVariant="secondary">
          Current value: {value}
        </Text>
      )}
    </Column>
  );
}


