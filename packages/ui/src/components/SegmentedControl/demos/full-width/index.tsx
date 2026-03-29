import { Card, Column, SegmentedControl, Text } from '@platform-blocks/ui';

const panes = [
  { label: 'Preview', value: 'preview' },
  { label: 'Code', value: 'code' },
  { label: 'Export', value: 'export' },
];

export default function Demo() {
  return (
    <Column gap="lg">
      <Card p="md">
        <Column gap="md">
          <Text size="sm" colorVariant="secondary">
            Enable `fullWidth` to stretch each segment across the container, making them ideal for responsive tab-like navigation.
          </Text>
          <SegmentedControl fullWidth defaultValue="preview" data={panes} />
        </Column>
      </Card>
    </Column>
  );
}
