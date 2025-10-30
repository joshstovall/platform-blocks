import React, { useState } from 'react';
import { Select, Flex, Text } from '@platform-blocks/ui';

export default function NoCloseOnSelectDemo() {
  const [value, setValue] = useState<string | null>(null);
  const options = [
    { label: 'Alpha', value: 'alpha' },
    { label: 'Beta', value: 'beta' },
    { label: 'Gamma', value: 'gamma' },
    { label: 'Delta', value: 'delta' },
  ];
  
  return (
    <Flex direction="column" gap={12}>
      <Text size="sm" colorVariant="secondary">
        Menu stays open after selecting so you can quickly compare or change.
      </Text>
      <Select
        label="Persistent Menu"
        options={options}
        value={value || undefined}
        onChange={(val) => setValue(val as string)}
        closeOnSelect={false}
      />
      {value && <Text size="sm" colorVariant="secondary">Last picked: {value}</Text>}
    </Flex>
  );
}
