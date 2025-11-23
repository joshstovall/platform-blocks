import { useState } from 'react';

import { Column, Knob, Row, Text } from '@platform-blocks/ui';

const LEVEL_MARKS = [
  { value: 0, label: 'Mute' },
  { value: 25, label: 'Low' },
  { value: 50, label: 'Mid' },
  { value: 75, label: 'High' },
  { value: 100, label: 'Max' },
];

export default function Demo() {
  const [level, setLevel] = useState(48);
  const [pan, setPan] = useState(10);

  return (
    <Column gap="xl" fullWidth>
      <Row gap="xl" wrap="wrap" justify="flex-start">
        <Column gap="xs" align="center">
          <Text size="sm" weight="500">
            Branded ticks + labels
          </Text>
          <Knob
            value={level}
            onChange={setLevel}
            min={0}
            max={100}
            step={1}
            marks={LEVEL_MARKS}
            size={180}
            appearance={{
              ring: { thickness: 16 },
              fill: { radiusOffset: -24 },
              progress: { mode: 'contiguous', color: '#f97316' },
              ticks: [
                {
                  source: 'marks',
                  shape: 'line',
                  length: 16,
                  width: 3,
                  position: 'outer',
                  label: { show: true, position: 'outer' },
                },
                {
                  source: 'steps',
                  values: [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100],
                  shape: 'dot',
                  radiusOffset: -6,
                  color: '#475569',
                  inactiveColor: 'rgba(71, 85, 105, 0.4)',
                },
              ],
            }}
            valueLabel={{ formatter: (val) => `${Math.round(val)}%` }}
          />
        </Column>
        <Column gap="xs" align="center">
          <Text size="sm" weight="500">
            Panning split ticks
          </Text>
          <Knob
            value={pan}
            onChange={setPan}
            min={-100}
            max={100}
            step={1}
            size={180}
            appearance={{
              arc: { startAngle: -135, sweepAngle: 270 },
              progress: {
                mode: 'split',
                thickness: 18,
                positiveColor: '#22c55e',
                negativeColor: '#fb7185',
              } as any,
              panning: {
                pivotValue: 0,
                positiveColor: '#22c55e',
                negativeColor: '#fb7185',
                showZeroIndicator: true,
              },
              ticks: [
                {
                  source: 'values',
                  values: [-100, -50, 0, 50, 100],
                  shape: 'line',
                  length: 20,
                  width: 4,
                  position: 'outer',
                  label: {
                    show: true,
                    formatter: (mark) =>
                      typeof mark.label === 'string'
                        ? mark.label
                        : `${mark.value > 0 ? 'R' : mark.value < 0 ? 'L' : ''}${Math.abs(mark.value)}`,
                    offset: 16,
                  },
                },
                {
                  source: 'steps',
                  values: [-75, -25, 25, 75],
                  shape: 'custom',
                  renderTick: ({ isActive }) => (
                    <Row
                      gap="xs"
                      align="center"
                      style={{
                        paddingHorizontal: 4,
                        paddingVertical: 2,
                        borderRadius: 999,
                        backgroundColor: isActive ? 'rgba(255,255,255,0.25)' : 'rgba(148, 163, 184, 0.2)',
                      }}
                    >
                      <Text size="xs" weight="600" style={{ color: '#e2e8f0' }}>
                        Cue
                      </Text>
                    </Row>
                  ),
                },
              ],
            }}
            valueLabel={{ formatter: (val) => `${val > 0 ? 'R' : val < 0 ? 'L' : ''}${Math.abs(Math.round(val))}` }}
          />
        </Column>
      </Row>
    </Column>
  );
}
