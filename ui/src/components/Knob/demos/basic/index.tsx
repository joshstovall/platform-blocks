import { useState } from 'react';
import { Card, Flex, Knob, Text } from '@platform-blocks/ui';

export default function Demo() {
  const [value, setValue] = useState(48);

  return (
  <Card padding={24} shadow="md" style={{ width: 260 }}>
      <Flex direction="column" align="center" gap="md">
        <Text size="lg" weight="600">Output level</Text>
        <Knob
          value={value}
          onChange={setValue}
          min={0}
          max={100}
          step={1}
          size={160}
          formatLabel={(current) => `${Math.round(current)}%`}
        />
        <Text size="sm" style={{ color: '#666' }}>
          {Math.round(value)}% gain
        </Text>
      </Flex>
    </Card>
  );
}
