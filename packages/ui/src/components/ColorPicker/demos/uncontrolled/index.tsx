import { useState } from 'react';
import { ColorPicker, Column, Text } from '@platform-blocks/ui';

const swatches = [
  '#E3F2FD',
  '#BBDEFB',
  '#90CAF9',
  '#64B5F6',
  '#42A5F5',
  '#2196F3',
  '#1E88E5',
  '#1976D2',
  '#1565C0',
  '#0D47A1',
  '#E8F5E8',
  '#C8E6C9',
  '#A5D6A7',
  '#81C784',
  '#66BB6A',
  '#4CAF50',
  '#43A047',
  '#388E3C',
  '#2E7D32',
  '#1B5E20',
];

const sections = [
  {
    title: 'Default value',
    pickerProps: {
      defaultValue: '#FF6B6B',
      label: 'Choose a color',
      placeholder: 'Select a color',
    },
  },
  {
    title: 'No default',
    pickerProps: {
      label: 'Choose a color',
      placeholder: 'No color selected',
    },
  },
  {
    title: 'Custom swatches',
    pickerProps: {
      defaultValue: '#4ECDC4',
      label: 'Blue/green palette',
      swatches,
    },
  },
  {
    title: 'Wheel only',
    pickerProps: {
      defaultValue: '#9C27B0',
      label: 'Color wheel only',
      withSwatches: false,
    },
  },
];

export default function Demo() {
  const [lastChange, setLastChange] = useState<string | null>(null);

  return (
    <Column gap="md" fullWidth>
      {sections.map(({ title, pickerProps }) => (
        <Column key={title} gap="xs" fullWidth>
          <Text size="sm" weight="semibold">
            {title}
          </Text>
          <ColorPicker
            {...pickerProps}
            onChange={(color) => {
              setLastChange(`${title}: ${color}`);
            }}
            fullWidth
          />
        </Column>
      ))}

      {lastChange && (
        <Text size="sm" colorVariant="secondary">
          Last change: {lastChange}
        </Text>
      )}
    </Column>
  );
}