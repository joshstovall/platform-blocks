import { Card, Column, SegmentedControl, Text } from '@platform-blocks/ui';

const scenarios = [
  {
    key: 'default',
    label: 'Interactive',
    props: {},
    defaultValue: 'react',
    data: [
      { label: 'React', value: 'react' },
      { label: 'Angular', value: 'angular' },
      { label: 'Vue', value: 'vue' },
    ],
  },
  {
    key: 'disabled',
    label: 'Disabled',
    props: { disabled: true },
    defaultValue: 'code',
    data: [
      { label: 'Preview', value: 'preview' },
      { label: 'Code', value: 'code' },
      { label: 'Export', value: 'export' },
    ],
  },
  {
    key: 'readOnly',
    label: 'Read only',
    props: { readOnly: true },
    defaultValue: 'medium',
    data: [
      { label: 'Low', value: 'low' },
      { label: 'Medium', value: 'medium' },
      { label: 'High', value: 'high' },
    ],
  },
  {
    key: 'itemDisabled',
    label: 'Single option disabled',
    props: {},
    defaultValue: 'typescript',
    data: [
      { label: 'JavaScript', value: 'javascript' },
      { label: 'TypeScript', value: 'typescript' },
      { label: 'Flow', value: 'flow', disabled: true },
    ],
  },
];

export default function Demo() {
  return (
    <Column gap="lg">
      <Card p="md">
        <Column gap="md">
          <Text size="sm" colorVariant="secondary">
            Use disabled, read-only, or per-item flags to communicate availability without losing layout consistency.
          </Text>
          <Column gap="sm">
            {scenarios.map((scenario) => (
              <Column key={scenario.key} gap="xs">
                <Text size="xs" colorVariant="secondary">
                  {scenario.label}
                </Text>
                <SegmentedControl
                  defaultValue={scenario.defaultValue}
                  data={scenario.data}
                  {...scenario.props}
                />
              </Column>
            ))}
          </Column>
        </Column>
      </Card>
    </Column>
  );
}
