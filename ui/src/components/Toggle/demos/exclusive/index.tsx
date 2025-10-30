import { useState } from 'react';
import { ToggleButton, ToggleGroup, Text, Flex, Card } from '@platform-blocks/ui';

export default function ExclusiveToggleDemo() {
  const [alignment, setAlignment] = useState('center');

  const handleChange = (value: string | number | (string | number)[]) => {
    // For exclusive mode, value should be a single string or number
    if (typeof value === 'string' || typeof value === 'number') {
      setAlignment(String(value));
    }
  };

  return (
    <Card>
      <Flex direction="column" gap={16}>
        <Text size="lg" weight="semibold">Exclusive Selection</Text>
        <Text size="sm" color="#666">Only one option can be selected at a time</Text>
        
        <ToggleGroup
          value={alignment}
          exclusive
          onChange={handleChange}
        >
          <ToggleButton value="left">Left</ToggleButton>
          <ToggleButton value="center">Center</ToggleButton>
          <ToggleButton value="right">Right</ToggleButton>
          <ToggleButton value="justify">Justify</ToggleButton>
        </ToggleGroup>
        
        <Text size="sm">Selected: {alignment || 'None'}</Text>
      </Flex>
    </Card>
  );
}
