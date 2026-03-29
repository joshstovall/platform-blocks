import { useState } from 'react';
import { Slider, Text, Column, Card, Block } from '@platform-blocks/ui';

export default function Demo() {
  const [value, setValue] = useState(25);

  return (
    <Block fullWidth>
      <Text size="lg" weight="semibold">Basic Slider</Text>
      <Slider
        value={value}
        onChange={setValue}
        min={0}
        max={100}
        step={1}
      />
      <Text size="sm" style={{ color: '#666' }}>
        Value: {value}
      </Text>
    </Block>
  );
}


