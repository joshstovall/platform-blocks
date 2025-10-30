import React, { useState } from 'react';
import { Select, Flex } from '@platform-blocks/ui';

export default function DisabledSelectDemo() {
  const [value, setValue] = useState<string | null>('banana');
  const options = [
    { label: 'Apple', value: 'apple' },
    { label: 'Banana (Disabled)', value: 'banana', disabled: true },
    { label: 'Cherry', value: 'cherry' },
    { label: 'Dragonfruit', value: 'dragonfruit' },
  ];
  
  return (
    <Flex direction="column" gap={16}>
      <Select
        label="Disabled Option"
        helperText="Banana cannot be selected"
        options={options}
        value={value || undefined}
        onChange={(val) => setValue(val as string)}
      />
      <Select
        label="Entire Select Disabled"
        options={options}
        value={value || undefined}
        disabled
      />
    </Flex>
  );
}
