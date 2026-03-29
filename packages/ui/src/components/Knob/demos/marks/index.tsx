import { useMemo, useState } from 'react';

import { Column, Knob, Text } from '@platform-blocks/ui';

const MARKS = [
  { value: 0, label: 'Mute', accentColor: '#6b7280' },
  { value: 25, label: 'Low', accentColor: '#6366f1' },
  { value: 50, label: 'Mid', accentColor: '#14b8a6' },
  { value: 75, label: 'High', accentColor: '#f97316' },
  { value: 100, label: 'Max', accentColor: '#ef4444' },
];

export default function Demo() {
  const [value, setValue] = useState(50);
  const label = useMemo(() => MARKS.find((mark) => mark.value === value)?.label ?? `${value}%`, [value]);

  return (
    <Column gap="sm" fullWidth>
      <Knob
        value={value}
        onChange={setValue}
        min={0}
        max={100}
        step={25}
        marks={MARKS}
        variant="stepped"
        size={170}
        valueLabel={{
          position: 'top',
          formatter: () => label,
          secondary: {
            position: 'bottom',
            formatter: () => `${value}%`,
          },
        }}
      />
      <Text size="xs" colorVariant="secondary">
        Preset: {label}
      </Text>
    </Column>
  );
}
