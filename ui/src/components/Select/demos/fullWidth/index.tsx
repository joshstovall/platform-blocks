import React, { useState } from 'react';
import { Select, Flex, Card } from '@platform-blocks/ui';

export default function FullWidthSelectDemo() {
  const [value, setValue] = useState<string | null>(null);
  const options = [
    { label: 'Small', value: 'sm' },
    { label: 'Medium', value: 'md' },
    { label: 'Large', value: 'lg' },
  ];
  
  return (
    <Card p="md" style={{ maxWidth: 340, width: '100%' }}>
      <Flex direction="column" gap={16}>
        <Select
          label="Size"
          fullWidth
          options={options}
          value={value || undefined}
          onChange={(val) => setValue(val as string)}
        />
        <Select
          label="Radius Custom"
          radius="xl"
          fullWidth
          options={options}
          value={value || undefined}
          onChange={(val) => setValue(val as string)}
        />
      </Flex>
    </Card>
  );
}
