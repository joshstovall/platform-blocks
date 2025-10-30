import { useState } from 'react';
import { ColorPicker, Flex, Card, Text } from '@platform-blocks/ui';

export default function Demo() {
  const [color1, setColor1] = useState('#2196F3');
  const [color2, setColor2] = useState('#4CAF50');
  const [color3, setColor3] = useState('#FF9800');
  
  const blueSwatches = [
    '#E3F2FD', '#BBDEFB', '#90CAF9', '#64B5F6', '#42A5F5',
    '#2196F3', '#1E88E5', '#1976D2', '#1565C0', '#0D47A1',
  ];

  const greenSwatches = [
    '#E8F5E8', '#C8E6C9', '#A5D6A7', '#81C784', '#66BB6A',
    '#4CAF50', '#43A047', '#388E3C', '#2E7D32', '#1B5E20',
  ];

  return (
    <Flex direction="column" gap={16}>
      <Card p={16} variant="outline">
        <Text size="sm" weight="semibold" mb={8}>Custom Blue Palette</Text>
        <ColorPicker
          value={color1}
          onChange={setColor1}
          swatches={blueSwatches}
          label="Blue Shades"
        />
      </Card>

      <Card p={16} variant="outline">
        <Text size="sm" weight="semibold" mb={8}>Custom Green Palette</Text>
        <ColorPicker
          value={color2}
          onChange={setColor2}
          swatches={greenSwatches}
          label="Green Shades"
        />
      </Card>

      <Card p={16} variant="outline">
        <Text size="sm" weight="semibold" mb={8}>No Swatches</Text>
        <ColorPicker
          value={color3}
          onChange={setColor3}
          withSwatches={false}
          label="Color Wheel Only"
        />
      </Card>
    </Flex>
  );
}
