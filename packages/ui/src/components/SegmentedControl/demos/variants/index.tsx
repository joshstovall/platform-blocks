import { Card, Column, SegmentedControl, Text } from '@platform-blocks/ui';

const variants = [
  {
    key: 'default',
    label: 'Default',
    props: { variant: 'default' as const },
    defaultValue: 'react',
    description: 'Baseline segmented control with tonal contrast.',
    data: [
      { label: 'React', value: 'react' },
      { label: 'Angular', value: 'angular' },
      { label: 'Vue', value: 'vue' },
    ],
  },
  {
    key: 'filledPrimary',
    label: 'Filled',
    props: { variant: 'filled' as const, color: 'primary' as const },
    defaultValue: 'code',
    description: 'Solid background that matches the selected color token.',
    data: [
      { label: 'Preview', value: 'preview' },
      { label: 'Code', value: 'code' },
      { label: 'Export', value: 'export' },
    ],
  },
  {
    key: 'filledContrast',
    label: 'Filled with auto-contrast',
    props: {
      variant: 'filled' as const,
      color: 'warning' as const,
      autoContrast: true,
    },
    defaultValue: 'medium',
    description: 'Enable autoContrast when using vivid palettes to keep labels legible.',
    data: [
      { label: 'Low', value: 'low' },
      { label: 'Medium', value: 'medium' },
      { label: 'High', value: 'high' },
    ],
  },
  {
    key: 'outline',
    label: 'Outline',
    props: { variant: 'outline' as const, color: 'secondary' as const },
    defaultValue: 'weekly',
    description: 'Focus on outlining the chosen tab while keeping the surface quiet.',
    data: [
      { label: 'Daily', value: 'daily' },
      { label: 'Weekly', value: 'weekly' },
      { label: 'Monthly', value: 'monthly' },
    ],
  },
  {
    key: 'ghost',
    label: 'Ghost',
    props: { variant: 'ghost' as const, color: 'success' as const },
    defaultValue: 'published',
    description: 'Ghost removes the segment background until selection, ideal on tinted surfaces.',
    data: [
      { label: 'Draft', value: 'draft' },
      { label: 'Pending', value: 'pending' },
      { label: 'Published', value: 'published' },
    ],
  },
];

export default function Demo() {
  return (
    <Column gap="lg">
      <Card p="md">
        <Column gap="md">
          <Text size="sm" colorVariant="secondary">
            Change the variant to match the surface and emphasis level of the surrounding layout.
          </Text>
          <Column gap="sm">
            {variants.map((variant) => (
              <Column key={variant.key} gap="xs">
                <Text size="xs" colorVariant="secondary">
                  {variant.label}
                </Text>
                <SegmentedControl
                  defaultValue={variant.defaultValue}
                  data={variant.data}
                  {...variant.props}
                />
                <Text size="xs" colorVariant="muted">
                  {variant.description}
                </Text>
              </Column>
            ))}
          </Column>
        </Column>
      </Card>
    </Column>
  );
}
