import { Card, Column, SegmentedControl, Text } from '@platform-blocks/ui';

const palettes = [
  {
    key: 'primary',
    color: 'primary',
    defaultValue: 'react',
    data: [
      { label: 'React', value: 'react' },
      { label: 'Angular', value: 'angular' },
      { label: 'Vue', value: 'vue' },
    ],
  },
  {
    key: 'success',
    color: 'success',
    defaultValue: 'code',
    data: [
      { label: 'Preview', value: 'preview' },
      { label: 'Code', value: 'code' },
      { label: 'Export', value: 'export' },
    ],
  },
  {
    key: 'purple',
    color: 'purple',
    defaultValue: 'settings',
    data: [
      { label: 'Profile', value: 'profile' },
      { label: 'Settings', value: 'settings' },
      { label: 'Privacy', value: 'privacy' },
    ],
  },
  {
    key: 'custom',
    color: '#FF6B6B',
    defaultValue: 'medium',
    data: [
      { label: 'Low', value: 'low' },
      { label: 'Medium', value: 'medium' },
      { label: 'High', value: 'high' },
    ],
  },
];

export default function Demo() {
  return (
    <Column gap="lg">
      <Card p="md">
        <Column gap="md">
          <Text size="sm" colorVariant="secondary">
            Apply semantic theme colors or provide custom hex codes to match the control with surrounding layouts.
          </Text>
          <Column gap="sm">
            {palettes.map((palette) => (
              <SegmentedControl
                key={palette.key}
                defaultValue={palette.defaultValue}
                color={palette.color}
                data={palette.data}
              />
            ))}
          </Column>
        </Column>
      </Card>
    </Column>
  );
}
