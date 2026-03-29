import { useState } from 'react';

import { Column, Knob, Row, Text } from '@platform-blocks/ui';

const MODES = [
  {
    key: 'spin',
    name: 'Spin',
    detail: 'Drag in a circular path. Move away from the thumb for finer adjustments.',
  },
  {
    key: 'vertical-slide',
    name: 'Vertical slide',
    detail: 'Grab either side of the knob and drag up or down for mixer-style throws.',
  },
  {
    key: 'horizontal-slide',
    name: 'Horizontal slide',
    detail: 'Start above or below the center, then drag left or right for sideways sweeps.',
  },
  {
    key: 'scroll',
    name: 'Scroll',
    detail: 'Hover with a mouse or trackpad and use the wheel/two-finger scroll.',
  },
] as const;

type ModeName = (typeof MODES)[number]['key'];

const MODE_LABELS: Record<ModeName, string> = MODES.reduce((acc, mode) => {
  acc[mode.key] = mode.name;
  return acc;
}, {} as Record<ModeName, string>);

export default function Demo() {
  const [value, setValue] = useState(12);
  const [activeMode, setActiveMode] = useState<ModeName | null>(null);

  return (
    <Column gap="md" fullWidth>
      <Row gap="xl" align="center" wrap="wrap">
        <Column gap="sm" align="center">
          <Text size="sm" weight="500">
            Multimodal control
          </Text>
          <Knob
            value={value}
            onChange={setValue}
            min={-100}
            max={100}
            step={1}
            size={180}
            variant="endless"
            valueLabel={{
              position: 'center',
              formatter: (current) => `${current > 0 ? '+' : ''}${Math.round(current)}`,
              secondary: {
                position: 'bottom',
                formatter: () => (activeMode ? `${MODE_LABELS[activeMode]} mode` : 'Try a gesture'),
              },
            }}
            appearance={{
              arc: { startAngle: -135, sweepAngle: 270, clampInput: true },
              ring: { thickness: 16, color: '#0f172a', trailColor: '#1e293b' },
              fill: { color: '#020617', radiusOffset: -14 },
              progress: {
                mode: 'split',
                roundedCaps: true,
                thickness: 10,
                color: '#38bdf8',
                trailColor: '#475569',
              },
              interaction: {
                modes: MODES.map((mode) => mode.key),
                lockThresholdPx: 32,
                slideRatio: 1.5,
                variancePx: 6,
                spinPrecisionRadius: 80,
                respectStartSide: true,
                scroll: { enabled: true, ratio: 0.8, preventPageScroll: true },
                onModeChange: setActiveMode,
              },
            }}
          />
        </Column>
  <Column gap="sm" style={{ minWidth: 240, flex: 1 }}>
          <Text size="sm" weight="500">
            Gesture cheat sheet
          </Text>
          <Column gap="xs">
            {MODES.map((mode) => (
              <Column key={mode.key} gap="xs">
                <Text size="xs" weight="600" colorVariant={activeMode === mode.key ? 'primary' : 'muted'}>
                  {mode.name}
                </Text>
                <Text size="xs" colorVariant="secondary">
                  {mode.detail}
                </Text>
              </Column>
            ))}
            <Text size="xs" colorVariant="secondary">
              Knob slides lock after ~32px of travel, so you can run multiple knobs in parallel just like a mixing board.
            </Text>
          </Column>
        </Column>
      </Row>
    </Column>
  );
}
