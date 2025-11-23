import { Column, Progress, Text } from '@platform-blocks/ui';

const VARIANTS = [
  {
    label: 'Primary status',
    value: 60,
    props: {}
  },
  {
    label: 'Success status',
    value: 82,
    props: { color: 'success' as const }
  },
  {
    label: 'Warning status',
    value: 45,
    props: { color: 'warning' as const }
  },
  {
    label: 'Striped + animated',
    value: 70,
    props: { striped: true, animate: true, transitionDuration: 600 }
  }
] as const;

export default function Demo() {
  return (
    <Column gap="lg">
      {VARIANTS.map(({ label, value, props }) => (
        <Column key={label} gap="xs">
          <Text variant="small" colorVariant="muted">
            {label}
          </Text>
          <Progress value={value} fullWidth {...props} />
        </Column>
      ))}
    </Column>
  );
}


