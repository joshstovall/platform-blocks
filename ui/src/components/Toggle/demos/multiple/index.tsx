import { useState } from 'react';
import { ToggleButton, ToggleGroup, Text, Flex, Card } from '@platform-blocks/ui';

export default function MultipleToggleDemo() {
  const [formats, setFormats] = useState(['bold']);

  const handleChange = (value: string | number | (string | number)[]) => {
    if (Array.isArray(value)) {
      setFormats(value as string[]);
    }
  };

  return (
    <Card>
      <Flex direction="column" gap={16}>
        <Text size="lg" weight="semibold">Multiple Selection</Text>
        <Text size="sm" color="#666">Multiple options can be selected</Text>
        
        <ToggleGroup
          value={formats}
          onChange={handleChange}
        >
          <ToggleButton value="bold">Bold</ToggleButton>
          <ToggleButton value="italic">Italic</ToggleButton>
          <ToggleButton value="underline">Underline</ToggleButton>
          <ToggleButton value="color">Color</ToggleButton>
        </ToggleGroup>
        
        <Text size="sm">
          Selected: {formats.length > 0 ? formats.join(', ') : 'None'}
        </Text>
      </Flex>
    </Card>
  );
}
