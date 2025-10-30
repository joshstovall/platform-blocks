import { useState } from 'react';
import { ToggleButton, ToggleGroup, Text, Flex, Card } from '@platform-blocks/ui';

export default function OrientationToggleDemo() {
  const [view, setView] = useState('list');

  const handleChange = (value: string | number | (string | number)[]) => {
    if (typeof value === 'string') {
      setView(value);
    }
  };

  return (
    <Card>
      <Flex direction="column" gap={16}>
        <Text size="lg" weight="semibold">Toggle Orientations</Text>
        <Flex direction="row" gap={24} align="flex-start">
          <Flex direction="column" gap={8} align="flex-start">
            <Text size="sm" weight="semibold">Horizontal (default)</Text>
            <ToggleGroup
              value={view}
              exclusive
              onChange={handleChange}
              orientation="horizontal"
            >
              <ToggleButton value="list">List</ToggleButton>
              <ToggleButton value="grid">Grid</ToggleButton>
              <ToggleButton value="card">Card</ToggleButton>
            </ToggleGroup>
          </Flex>
          
          <Flex direction="column" gap={8} align="flex-start">
            <Text size="sm" weight="semibold">Vertical</Text>
            <ToggleGroup
              value={view}
              exclusive
              onChange={handleChange}
              orientation="vertical"
            >
              <ToggleButton value="list">List</ToggleButton>
              <ToggleButton value="grid">Grid</ToggleButton>
              <ToggleButton value="card">Card</ToggleButton>
            </ToggleGroup>
          </Flex>
        </Flex>
        
        <Text size="sm">Selected view: {view}</Text>
      </Flex>
    </Card>
  );
}
