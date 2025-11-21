import { useMemo, useState } from 'react';
import { Card, Flex, Knob, Text } from '@platform-blocks/ui';

const MARKS = [
  { value: 0, label: 'Mute' },
  { value: 25, label: 'Low' },
  { value: 50, label: 'Mid' },
  { value: 75, label: 'High' },
  { value: 100, label: 'Max' },
];

export default function Demo() {
  const [value, setValue] = useState(50);
  const label = useMemo(() => MARKS.find((mark) => mark.value === value)?.label ?? `${value}%`, [value]);

  return (
    <Card padding={24} shadow="sm" style={{ width: 300 }}>
      <Flex direction="column" align="center" gap="md">
        <Text size="md" weight="600">Snapshot levels</Text>
        <Knob
          value={value}
          onChange={setValue}
          min={0}
          max={100}
          step={25}
          marks={MARKS}
          restrictToMarks
          size={170}
          formatLabel={() => label}
        />
        <Text size="sm" style={{ color: '#666' }}>
          Preset: {label}
        </Text>
      </Flex>
    </Card>
  );
}
