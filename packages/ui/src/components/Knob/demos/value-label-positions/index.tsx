import { useState } from 'react';

import { Column, Knob, Row, Text } from '@platform-blocks/ui';

export default function Demo() {
  const [attack, setAttack] = useState(120);
  const [release, setRelease] = useState(60);

  return (
    <Column gap="md" fullWidth>
  <Row gap="xl" justify="flex-start" wrap="wrap">
        <Column gap="xs" align="center">
          <Text size="sm" weight="500">
            Attack
          </Text>
          <Knob
            value={attack}
            onChange={setAttack}
            min={0}
            max={200}
            step={5}
            size={150}
            variant="level"
            valueLabel={{
              position: 'top',
              prefix: 'Attack',
              formatter: (val) => `${Math.round(val)} ms`,
              secondary: {
                position: 'bottom',
                formatter: (val) => `${Math.round((val / 200) * 100)}%`,
              },
            }}
          />
        </Column>
        <Column gap="xs" align="center">
          <Text size="sm" weight="500">
            Release
          </Text>
          <Knob
            value={release}
            onChange={setRelease}
            min={0}
            max={120}
            step={5}
            size={150}
            variant="level"
            valueLabel={{
              position: 'left',
              formatter: (val) => `${Math.round(val)} ms`,
              secondary: {
                position: 'right',
                formatter: (val) => `${Math.round((val / 120) * 100)}%`,
              },
            }}
          />
        </Column>
      </Row>
    </Column>
  );
}
