import { useState } from 'react';

import { Column, Knob, Text } from '@platform-blocks/ui';

export default function Demo() {
  const [value, setValue] = useState(48);

  return (
    <Column gap="sm" fullWidth>
      <Knob
        value={value}
        onChange={setValue}
        min={0}
        max={100}
        step={1}
        size={160}
        variant="level"
        valueLabel={{
          position: 'center',
          formatter: (current) => Math.round(current),
          suffix: '%',
        }}
      />
      <Text size="xs" colorVariant="secondary">
        Current gain: {Math.round(value)}%
      </Text>
    </Column>
  );
}
