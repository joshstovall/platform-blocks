import { Card, Column, SegmentedControl, Text } from '@platform-blocks/ui';

const frameworks = [
  { label: 'React', value: 'react' },
  { label: 'Angular', value: 'angular' },
  { label: 'Vue', value: 'vue' },
];

export default function Demo() {
  return (
    <Column gap="lg">
      <Card p="md">
        <Column gap="md">
          <Text size="sm" colorVariant="secondary">
            Segmented controls expose a compact option switcher. This version relies on internal state via `defaultValue`.
          </Text>
          <SegmentedControl defaultValue="react" data={frameworks} />
        </Column>
      </Card>
    </Column>
  );
}
