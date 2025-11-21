import { useMemo, useState } from 'react';
import { Card, Flex, Knob, Text } from '@platform-blocks/ui';

export default function Demo() {
  const [value, setValue] = useState(0);
  const normalizedAngle = useMemo(() => ((value % 360) + 360) % 360, [value]);
  const rotations = useMemo(() => value / 360, [value]);

  return (
    <Card padding={24} shadow="md" style={{ width: 280 }}>
      <Flex direction="column" align="center" gap="md">
        <Text size="lg" weight="600">Endless encoder</Text>
        <Knob
          value={value}
          onChange={setValue}
          min={0}
          max={360}
          step={5}
          mode="endless"
          size={170}
          formatLabel={() => `${Math.round(normalizedAngle)}°`}
        />
        <Text size="sm" style={{ color: '#666' }}>
          Total turns: {rotations.toFixed(2)}
        </Text>
      </Flex>
    </Card>
  );
}
