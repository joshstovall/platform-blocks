import { Card, Column, Row, SegmentedControl, Text } from '@platform-blocks/ui';

const horizontalOptions = [
  { label: 'React', value: 'react' },
  { label: 'Angular', value: 'angular' },
  { label: 'Vue', value: 'vue' },
];

const verticalOptions = [
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
            Switch the `orientation` prop to pivot between horizontal and vertical layouts. Vertical orientation is helpful for sidebars or stacked forms.
          </Text>
          <Row gap="lg" align="flex-start" wrap="wrap">
            <Column gap="xs">
              <Text size="xs" colorVariant="secondary">
                Horizontal (default)
              </Text>
              <SegmentedControl orientation="horizontal" defaultValue="react" data={horizontalOptions} />
            </Column>
            <Column gap="xs">
              <Text size="xs" colorVariant="secondary">
                Vertical
              </Text>
              <SegmentedControl orientation="vertical" defaultValue="code" data={verticalOptions} />
            </Column>
          </Row>
        </Column>
      </Card>
    </Column>
  );
}
