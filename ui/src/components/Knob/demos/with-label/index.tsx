import { useState } from 'react';
import { Card, Flex, Knob, Text } from '@platform-blocks/ui';

export default function Demo() {
  const [value, setValue] = useState(40);

  return (
    <Card padding={24} shadow="sm" style={{ maxWidth: 360 }}>
      <Flex direction="column" gap="md">
        <Knob
          value={value}
          onChange={setValue}
          min={0}
          max={100}
          step={5}
          size={150}
          label="Input gain"
          description="Field header props provide consistent labeling and accessibility."
          labelPosition="top"
          formatLabel={(current) => `${Math.round(current)}%`}
        />
        <Text size="sm" style={{ color: '#666' }}>
          {Math.round(value)}% signal boost
        </Text>
      </Flex>
    </Card>
  );
}
