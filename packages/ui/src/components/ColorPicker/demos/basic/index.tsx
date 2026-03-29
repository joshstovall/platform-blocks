import { useState } from 'react';
import { ColorPicker, Column, Text } from '@platform-blocks/ui';

export default function Demo() {
  const [color, setColor] = useState('#FF6B6B');

  return (
    <Column gap="xs" fullWidth>
      <ColorPicker
        value={color}
        onChange={setColor}
        label="Favorite color"
        placeholder="Select a color"
        clearable
        fullWidth
      />
      <Text size="sm" colorVariant="secondary">
        Selected: {color || 'none'}
      </Text>
    </Column>
  );
}
