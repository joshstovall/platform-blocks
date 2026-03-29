import { useState } from 'react';

import { Column, Knob, Text } from '@platform-blocks/ui';

export default function Demo() {
  const [value, setValue] = useState(40);

  return (
    <Column gap="sm" fullWidth>
      <Knob
        value={value}
        onChange={setValue}
        min={0}
        max={100}
        step={5}
        size={150}
        label="Input gain"
        description="Field header props provide consistent labeling and accessibility."
        labelPosition="top"
        valueLabel={{
          position: 'bottom',
          formatter: (current) => `${Math.round(current)}%`,
        }}
      />
      <Text size="xs" colorVariant="secondary">
        Signal boost: {Math.round(value)}%
      </Text>
    </Column>
  );
}
