import React, { useState } from 'react';
import { Select, Flex, Text } from '@platform-blocks/ui';

export default function CustomSelectDemo() {
  const [value, setValue] = useState<string | null>(null);
  const options = [
    { label: '🚀 Rocket', value: 'rocket' },
    { label: '🌙 Moon', value: 'moon' },
    { label: '🪐 Planet', value: 'planet' },
    { label: '☀️ Sun', value: 'sun' },
  ];
  
  return (
    <Flex direction="column" gap={12}>
      <Select
        label="Celestial Body"
        placeholder="Choose..."
        options={options}
        value={value || undefined}
        onChange={(val) => setValue(val as string)}
        renderOption={(opt, _active, selected) => (
          <Text
            key={String(opt.value)}
            onPress={() => !opt.disabled && setValue(opt.value as string)}
            style={{
              paddingVertical: 8,
              paddingHorizontal: 12,
              backgroundColor: selected ? 'rgba(59,130,246,0.10)' : 'transparent',
              fontWeight: selected ? '600' : '400'
            }}
          >
            {opt.label} {selected ? '✓' : ''}
          </Text>
        )}
      />
      {value && <Text size="sm" colorVariant="secondary">Selected: {value}</Text>}
    </Flex>
  );
}
