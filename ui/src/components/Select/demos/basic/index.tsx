import React, { useState } from 'react';
import { Select, Flex, Text } from '@platform-blocks/ui';

export default function BasicSelectDemo() {
  const [value, setValue] = useState<string | null>(null);
  const options = [
    { label: 'Apple', value: 'apple' },
    { label: 'Banana', value: 'banana' },
    { label: 'Orange', value: 'orange' },
  ];
  
  return (
    <Flex direction="column" gap={12}>
      <Select
        label="Fruit"
        description="Select your favorite fruit"
        placeholder="Pick a fruit"
        options={options}
        value={value || undefined}
        onChange={(val) => setValue(val as string)}
      />
      {value && (
        <Text size="sm" colorVariant="secondary">Selected: {value}</Text>
      )}
    </Flex>
  );
}
