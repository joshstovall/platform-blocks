import { useState } from 'react';

import { Column, Knob, Text } from '@platform-blocks/ui';

export default function Demo() {
  const [value, setValue] = useState(32);
  const [isScrubbing, setIsScrubbing] = useState(false);
  const [committed, setCommitted] = useState(value);

  return (
    <Column gap="sm" fullWidth>
      <Knob
        value={value}
        onChange={setValue}
        onChangeEnd={setCommitted}
        onScrubStart={() => setIsScrubbing(true)}
        onScrubEnd={() => setIsScrubbing(false)}
        min={0}
        max={64}
        step={1}
        size={150}
        formatLabel={(current) => `${Math.round(current)}%`}
      />
      <Column gap="xs">
        <Text size="xs" colorVariant="secondary">
          Live value: {Math.round(value)}%
        </Text>
        <Text size="xs" colorVariant="secondary">
          Last commit: {Math.round(committed)}%
        </Text>
        <Text size="xs" colorVariant={isScrubbing ? 'primary' : 'secondary'}>
          {isScrubbing ? 'User is scrubbing' : 'Idle'}
        </Text>
      </Column>
    </Column>
  );
}
