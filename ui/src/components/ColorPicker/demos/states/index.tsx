import { useState } from 'react';
import { ColorPicker, Flex, Card, Text } from '@platform-blocks/ui';

export default function Demo() {
  const [color, setColor] = useState('#FF6B6B');

  return (
    <Flex direction="column" gap={16}>
      <Card p={16} variant="outline">
        <Text size="sm" weight="semibold" mb={8}>Default State</Text>
        <ColorPicker
          label="Choose Color"
          value={color}
          onChange={setColor}
        />
      </Card>

      <Card p={16} variant="outline">
        <Text size="sm" weight="semibold" mb={8}>Disabled</Text>
        <ColorPicker
          label="Disabled Color Picker"
          value="#CCCCCC"
          disabled
        />
      </Card>

      <Card p={16} variant="outline">
        <Text size="sm" weight="semibold" mb={8}>With Error</Text>
        <ColorPicker
          label="Required Color"
          value=""
          error="Color selection is required"
          required
        />
      </Card>

      <Card p={16} variant="outline">
        <Text size="sm" weight="semibold" mb={8}>With Description</Text>
        <ColorPicker
          label="Brand Color"
          description="Choose your brand's primary color"
          value={color}
          onChange={setColor}
        />
      </Card>
    </Flex>
  );
}
