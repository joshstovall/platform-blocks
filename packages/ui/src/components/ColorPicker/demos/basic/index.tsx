import { useState } from 'react';
import { Column, Row, Text, ColorPicker } from '@platform-blocks/ui';

export default function Demo() {
  const [color, setColor] = useState('#4ECDC4');

  return (
    <Column gap="md">
      <Row gap="sm" align="center">
        <ColorPicker value={color} onChange={setColor} />
        <Text size="sm" colorVariant="secondary">
          Selected: {color}
        </Text>
      </Row>

      <Column gap="xs">
        <Text size="sm" weight="semibold">
          Larger, custom swatches
        </Text>
        <ColorPicker
          defaultValue="#5F27CD"
          size={36}
          columns={4}
          swatches={['#0F172A', '#5F27CD', '#54A0FF', '#4ECDC4', '#96CEB4', '#FECA57', '#F8B500', '#FF6B6B']}
        />
      </Column>
    </Column>
  );
}
