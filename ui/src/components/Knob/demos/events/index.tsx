import { useState } from 'react';
import { Card, Flex, Knob, Text } from '@platform-blocks/ui';

export default function Demo() {
  const [value, setValue] = useState(32);
  const [isScrubbing, setIsScrubbing] = useState(false);
  const [committed, setCommitted] = useState(value);

  return (
    <Card padding={24} shadow="sm" style={{ width: 300 }}>
      <Flex direction="column" gap="md">
        <Knob
          value={value}
          onChange={(next) => setValue(next)}
          onChangeEnd={(next) => setCommitted(next)}
          onScrubStart={() => setIsScrubbing(true)}
          onScrubEnd={() => setIsScrubbing(false)}
          min={0}
          max={64}
          step={1}
          size={150}
          formatLabel={(current) => `${Math.round(current)}%`}
        />
        <Text size="sm" style={{ color: '#666' }}>
          Live value: {Math.round(value)}%
        </Text>
        <Text size="sm" style={{ color: '#666' }}>
          Last commit: {Math.round(committed)}%
        </Text>
        <Text size="sm" style={{ color: isScrubbing ? '#007aff' : '#666' }}>
          {isScrubbing ? 'User is scrubbing' : 'Idle'}
        </Text>
      </Flex>
    </Card>
  );
}
