import { useMemo, useState } from 'react';

import { Column, Knob, Text } from '@platform-blocks/ui';

export default function Demo() {
  const [value, setValue] = useState(0);
  const normalizedAngle = useMemo(() => ((value % 360) + 360) % 360, [value]);
  const rotations = useMemo(() => value / 360, [value]);

  return (
    <Column gap="sm" fullWidth>
      <Knob
        value={value}
        onChange={setValue}
        min={0}
        max={360}
        step={5}
        variant="endless"
        size={170}
        valueLabel={{
          position: 'center',
          formatter: () => `${Math.round(normalizedAngle)}°`,
          secondary: {
            position: 'bottom',
            formatter: () => `${rotations.toFixed(2)} turns`,
          },
        }}
      />
      <Column gap="xs">
        <Text size="xs" colorVariant="secondary">
          Normalized angle: {Math.round(normalizedAngle)}°
        </Text>
        <Text size="xs" colorVariant="secondary">
          Total turns: {rotations.toFixed(2)}
        </Text>
      </Column>
    </Column>
  );
}
