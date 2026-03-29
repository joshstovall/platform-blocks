import { useState } from 'react';
import { Button, Card, Column, Ring, Row, Text } from '@platform-blocks/ui';

const ringPresets = [
  {
    key: 'default',
    label: 'Default presentation',
    props: { caption: 'Completion' },
  },
  {
    key: 'compact',
    label: 'Compact footprint',
    props: { size: 72, thickness: 8, caption: 'Compact' },
  },
  {
    key: 'labeled',
    label: 'Labeled preview',
    props: { size: 120, thickness: 14, label: 'Release' },
    getSubLabel: (value: number) => `${value}%`,
  },
];

export default function Demo() {
  const [value, setValue] = useState(72);

  const updateValue = (delta: number) => {
    setValue((current) => Math.min(100, Math.max(0, current + delta)));
  };

  const displayValue = Math.round(value);

  return (
    <Column gap="lg">
      <Card p="md">
        <Column gap="md">
          <Text size="sm" colorVariant="secondary">
            Use rings to surface progress at a glance; adjust `size`, `thickness`, and labeling to fit the surface area.
          </Text>
          <Row gap="lg" justify="center" wrap="wrap">
            {ringPresets.map((preset) => {
              const subLabel = preset.getSubLabel?.(displayValue);

              return (
                <Column key={preset.key} gap="xs" align="center">
                  <Ring value={value} {...preset.props} subLabel={subLabel} />
                  <Text size="xs" colorVariant="secondary">
                    {preset.label}
                  </Text>
                </Column>
              );
            })}
          </Row>
          <Column gap="xs" align="center">
            <Text size="sm" colorVariant="secondary">
              Current value: {displayValue}%
            </Text>
            <Row gap="sm" justify="center">
              <Button variant="outline" onPress={() => updateValue(-8)} disabled={value <= 0}>
                Decrease 8%
              </Button>
              <Button onPress={() => updateValue(8)} disabled={value >= 100}>
                Increase 8%
              </Button>
            </Row>
          </Column>
        </Column>
      </Card>
    </Column>
  );
}
