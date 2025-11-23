import { useState } from 'react';

import { Column, Input, Text } from '@platform-blocks/ui';

export default function Demo() {
  const [value, setValue] = useState('');

  return (
    <Column gap="sm">
      <Text weight="semibold">Basic text input</Text>
      <Input
        label="Full name"
        placeholder="Enter your full name"
        value={value}
        onChangeText={setValue}
      />
      {value && (
        <Text size="xs" colorVariant="secondary">
          Current value: {value}
        </Text>
      )}
    </Column>
  );
}


