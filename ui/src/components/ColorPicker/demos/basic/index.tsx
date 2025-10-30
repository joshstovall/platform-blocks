import { useState } from 'react';
import { ColorPicker, Card } from '@platform-blocks/ui';

export default function Demo() {
  const [color, setColor] = useState('#FF6B6B');

  return (
    <Card p={16} variant="outline">
      <ColorPicker
        value={color}
        onChange={setColor}
        label="Choose a color"
        placeholder="Select your favorite color"
      />
    </Card>
  );
}
