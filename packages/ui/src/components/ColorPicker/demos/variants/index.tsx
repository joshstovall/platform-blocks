import { useState } from 'react';
import { ColorPicker, Column, Text } from '@platform-blocks/ui';

const sizes = [
  { label: 'Small', size: 'sm' as const },
  { label: 'Medium (default)', size: 'md' as const },
  { label: 'Large', size: 'lg' as const },
];

export default function Demo() {
  const [color, setColor] = useState('#FF6B6B');

  return (
    <Column gap="md" fullWidth>
      {sizes.map(({ label, size }) => (
        <Column key={label} gap="xs" fullWidth>
          <Text size="sm" weight="semibold">
            {label}
          </Text>
          <ColorPicker
            label={`${label} picker`}
            value={color}
            onChange={setColor}
            size={size}
            fullWidth
          />
        </Column>
      ))}

      <Column gap="xs" fullWidth>
        <Text size="sm" weight="semibold">
          Custom placeholder
        </Text>
        <ColorPicker
          placeholder="Pick your favorite color..."
          value=""
          onChange={setColor}
          fullWidth
        />
      </Column>
    </Column>
  );
}
