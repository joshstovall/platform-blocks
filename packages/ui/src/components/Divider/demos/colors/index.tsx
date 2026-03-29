import type { DividerProps } from '@platform-blocks/ui';
import { Column, Divider, Text } from '@platform-blocks/ui';

const COLOR_VARIANTS: Array<{ label: string; tone?: DividerProps['colorVariant'] }> = [
  { label: 'Surface (default)' },
  { label: 'Primary', tone: 'primary' },
  { label: 'Success', tone: 'success' },
  { label: 'Warning', tone: 'warning' },
  { label: 'Error', tone: 'error' },
  { label: 'Muted', tone: 'muted' },
  { label: 'Subtle', tone: 'subtle' },
  { label: 'Gray', tone: 'gray' }
];

export default function Demo() {
  return (
    <Column gap="lg">
      <Column gap="sm">
        <Text variant="small" weight="medium">
          Semantic color variants
        </Text>
        {COLOR_VARIANTS.map(({ label, tone }) => (
          <Column key={label} gap="xs">
            <Text variant="p" colorVariant="muted">
              {label}
            </Text>
            <Divider colorVariant={tone} />
          </Column>
        ))}
      </Column>

      <Column gap="sm">
        <Text variant="small" weight="medium">
          Labeled dividers
        </Text>
        <Divider colorVariant="primary" label="Quarterly results" />
        <Divider colorVariant="success" label="Customer satisfaction" />
        <Divider colorVariant="error" label="Risks" />
      </Column>

      <Column gap="sm">
        <Text variant="small" weight="medium">
          Variant styles
        </Text>
        <Divider colorVariant="primary" variant="solid" label="Solid" />
        <Divider colorVariant="primary" variant="dashed" label="Dashed" />
        <Divider colorVariant="primary" variant="dotted" label="Dotted" />
      </Column>
    </Column>
  );
}