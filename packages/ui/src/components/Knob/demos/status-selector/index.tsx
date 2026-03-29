import { useMemo, useState } from 'react';

import { Column, Icon, Knob, Row, Text } from '@platform-blocks/ui';

export default function Demo() {
  const [value, setValue] = useState(0);

  const statusMarks = useMemo(
    () => [
      {
        value: 0,
        label: 'Sleep',
        accentColor: '#64748b',
        icon: <Icon name="moon" size={28} color="#64748b" />,
      },
      {
        value: 90,
        label: 'Focus',
        accentColor: '#0ea5e9',
        icon: <Icon name="target" size={28} color="#0ea5e9" />,
      },
      {
        value: 180,
        label: 'Charge',
        accentColor: '#22c55e',
        icon: <Icon name="bolt" size={28} color="#22c55e" />,
      },
      {
        value: 270,
        label: 'Party',
        accentColor: '#f97316',
        icon: <Icon name="sparkles" size={28} color="#f97316" />,
      },
    ],
    []
  );

  const activeStatus = useMemo(
    () => statusMarks.reduce((closest, mark) => (
      Math.abs(mark.value - value) < Math.abs(closest.value - value) ? mark : closest
    ), statusMarks[0]),
    [statusMarks, value]
  );

  return (
    <Column gap="sm" fullWidth>
      <Knob
        value={value}
        onChange={setValue}
        min={0}
        max={360}
        step={90}
        marks={statusMarks}
        restrictToMarks
        variant="status"
        size={200}
        valueLabel={{
          position: 'bottom',
          formatter: () => activeStatus.label,
        }}
      />
      <Row gap="xs" align="center">
        <Text size="sm" colorVariant="secondary">
          Current scene:
        </Text>
        <Text weight="semibold">{activeStatus.label}</Text>
      </Row>
    </Column>
  );
}
