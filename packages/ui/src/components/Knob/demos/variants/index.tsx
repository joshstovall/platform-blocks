import { useMemo, useState } from 'react';

import { Column, Icon, Knob, Row, Text } from '@platform-blocks/ui';

const STEPPED_MARKS = [
  { value: 0, label: 'Off', accentColor: '#94a3b8' },
  { value: 25, label: 'Low', accentColor: '#6366f1' },
  { value: 50, label: 'Mid', accentColor: '#0ea5e9' },
  { value: 75, label: 'High', accentColor: '#f97316' },
  { value: 100, label: 'Max', accentColor: '#ef4444' },
];

const STATUS_MARKS = [
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
];

export default function Demo() {
  const [level, setLevel] = useState(48);
  const [stepped, setStepped] = useState(50);
  const [endless, setEndless] = useState(0);
  const [cutoff, setCutoff] = useState(3200);
  const [statusValue, setStatusValue] = useState(90);

  const endlessAngle = useMemo(() => ((endless % 360) + 360) % 360, [endless]);
  const endlessTurns = useMemo(() => endless / 360, [endless]);

  const statusActive = useMemo(
    () => STATUS_MARKS.reduce((closest, mark) =>
      Math.abs(mark.value - statusValue) < Math.abs(closest.value - statusValue) ? mark : closest,
    STATUS_MARKS[0]),
    [statusValue]
  );

  return (
    <Column gap="lg" fullWidth>
      <Row gap="xl" wrap="wrap" justify="flex-start">
        <Column gap="xs" align="center">
          <Text size="sm" weight="500">Level</Text>
          <Knob
            value={level}
            onChange={setLevel}
            min={0}
            max={100}
            step={1}
            size={140}
            variant="level"
            valueLabel={{ formatter: (val) => `${Math.round(val)}%` }}
          />
        </Column>
        <Column gap="xs" align="center">
          <Text size="sm" weight="500">Stepped</Text>
          <Knob
            value={stepped}
            onChange={setStepped}
            min={0}
            max={100}
            step={25}
            marks={STEPPED_MARKS}
            variant="stepped"
            size={140}
            valueLabel={{
              position: 'top',
              formatter: () => STEPPED_MARKS.find((mark) => mark.value === stepped)?.label ?? `${stepped}%`,
              secondary: {
                position: 'bottom',
                formatter: () => `${stepped}%`,
              },
            }}
          />
        </Column>
        <Column gap="xs" align="center">
          <Text size="sm" weight="500">Endless</Text>
          <Knob
            value={endless}
            onChange={setEndless}
            min={0}
            max={360}
            step={5}
            variant="endless"
            size={140}
            valueLabel={{
              formatter: () => `${Math.round(endlessAngle)}°`,
              secondary: {
                position: 'bottom',
                formatter: () => `${endlessTurns.toFixed(2)} turns`,
              },
            }}
          />
        </Column>
        <Column gap="xs" align="center">
          <Text size="sm" weight="500">Dual</Text>
          <Knob
            value={cutoff}
            onChange={setCutoff}
            min={200}
            max={8000}
            step={50}
            variant="dual"
            size={140}
            valueLabel={{
              formatter: (val) => `${Math.round(val)} Hz`,
              secondary: {
                position: 'bottom',
                formatter: (val) => `${Math.round(((val - 200) / (8000 - 200)) * 100)}% span`,
              },
            }}
          />
        </Column>
        <Column gap="xs" align="center">
          <Text size="sm" weight="500">Status</Text>
          <Knob
            value={statusValue}
            onChange={setStatusValue}
            min={0}
            max={360}
            step={90}
            marks={STATUS_MARKS}
            restrictToMarks
            variant="status"
            size={140}
            valueLabel={{
              position: 'bottom',
              formatter: () => statusActive.label,
            }}
          />
        </Column>
      </Row>
    </Column>
  );
}
