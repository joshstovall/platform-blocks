import { useState } from 'react';
import { ColorPicker, Flex, Card, Text } from '@platform-blocks/ui';

export default function Demo() {
  const [color, setColor] = useState('#FF6B6B');

  return (
    <Flex direction="column" gap={16}>
      <Card p={16} variant="outline">
        <Text size="sm" weight="semibold" mb={8}>Small Size</Text>
        <ColorPicker
          label="Small Color Picker"
          value={color}
          onChange={setColor}
          size="sm"
        />
      </Card>

      <Card p={16} variant="outline">
        <Text size="sm" weight="semibold" mb={8}>Medium Size (Default)</Text>
        <ColorPicker
          label="Medium Color Picker"
          value={color}
          onChange={setColor}
          size="md"
        />
      </Card>

      <Card p={16} variant="outline">
        <Text size="sm" weight="semibold" mb={8}>Large Size</Text>
        <ColorPicker
          label="Large Color Picker"
          value={color}
          onChange={setColor}
          size="lg"
        />
      </Card>

      <Card p={16} variant="outline">
        <Text size="sm" weight="semibold" mb={8}>Custom Placeholder</Text>
        <ColorPicker
          placeholder="Pick your favorite color..."
          value=""
          onChange={setColor}
        />
      </Card>
    </Flex>
  );
}
