import { Block, Column, Divider, Text } from '@platform-blocks/ui';

const thicknesses = [
  { label: 'Hairline (1px)', subtitle: 'Ideal for subtle separators', size: 1 },
  { label: 'Compact (xs token)', subtitle: 'Matches tight card padding', size: 'xs' as const },
  { label: 'Comfortable (sm token)', subtitle: 'Great for app sections', size: 'sm' as const },
  { label: 'Bold (md token)', subtitle: 'Use sparingly for emphasis', size: 'md' as const },
];

export default function Demo() {
  return (
    <Column gap="xl">
      <Column gap="lg">
        {thicknesses.map(({ label, subtitle, size }) => (
          <Column key={label} gap="xs">
            <Text variant="p" weight="medium">
              {label}
            </Text>
            <Text variant="small" colorVariant="muted">
              {subtitle}
            </Text>
            <Divider size={size} />
          </Column>
        ))}
      </Column>

      <Block direction="row" align="center" gap="md">
        <Text variant="small" colorVariant="muted">
          Accessibility
        </Text>
        <Divider orientation="vertical" size={1} style={{ height: 40 }} />
        <Text variant="small" colorVariant="muted">
          Performance
        </Text>
        <Divider orientation="vertical" size="xs" style={{ height: 40 }} />
        <Text variant="small" colorVariant="muted">
          Reliability
        </Text>
        <Divider orientation="vertical" size="sm" style={{ height: 40 }} />
        <Text variant="small" colorVariant="muted">
          Support
        </Text>
      </Block>
    </Column>
  );
}
