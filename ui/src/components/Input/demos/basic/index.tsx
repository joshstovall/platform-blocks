import { useState } from 'react';
import { Input, Text, Card, Column } from '@platform-blocks/ui';

export default function Demo() {
  const [value, setValue] = useState('');

  return (
    <Card padding={16}>
      <Column gap={16}>
        <Text variant="h6">Basic Text Input</Text>
        <Input
          label="Full Name"
          placeholder="Enter your full name"
          value={value}
          onChangeText={setValue}
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


