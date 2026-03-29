import { Card, Column, Link, Text } from '@platform-blocks/ui';

const linkVariants = [
  { label: 'Default underline', variant: 'default' as const, description: 'Underline is always visible for maximum affordance.' },
  { label: 'Hover underline', variant: 'hover-underline' as const, description: 'Underline appears on hover for denser layouts.' },
  { label: 'Subtle primary', variant: 'subtle' as const, color: 'primary', description: 'Muted style that still matches the brand palette.' },
  { label: 'Subtle gray', variant: 'subtle' as const, color: 'gray', description: 'Pair with neutral layouts or footers.' },
];

export default function Demo() {
  return (
    <Column gap="lg">
      <Card p="md">
        <Column gap="md">
          <Text size="sm" colorVariant="secondary">
            Choose a `variant` that matches the surrounding density while keeping the link discoverable.
          </Text>
          {linkVariants.map((entry) => (
            <Column key={entry.label} gap="xs">
              <Link href="#" variant={entry.variant} color={entry.color}>{entry.label}</Link>
              <Text size="xs" colorVariant="secondary">{entry.description}</Text>
            </Column>
          ))}
        </Column>
      </Card>
    </Column>
  );
}


