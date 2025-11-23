import { Accordion, Card, Column, Text } from '@platform-blocks/ui';

const onboardingSteps = [
  {
    key: 'create-project',
    title: 'Create a project',
    content: <Text size="sm">Spin up a workspace and invite your teammates so everyone builds from the same toolkit.</Text>,
  },
  {
    key: 'import-assets',
    title: 'Import assets',
    content: <Text size="sm">Upload icons, typography tokens, and spacing primitives to stay consistent across platforms.</Text>,
  },
];

const accordionVariants = [
  { label: 'Default', description: 'Minimal chrome that blends into content-heavy layouts.' },
  { label: 'Separated', description: 'Adds spacing and rounded corners between items for dashboards.', variant: 'separated' as const },
  { label: 'Bordered', description: 'Outlines each item for high-contrast contexts.', variant: 'bordered' as const },
];

export default function Demo() {
  return (
    <Column gap="lg">
      <Card p="md">
        <Column gap="lg">
          <Text size="sm" colorVariant="secondary">
            Adjust visual weight with the `variant` prop while reusing the same item content.
          </Text>
          {accordionVariants.map((entry) => (
            <Column key={entry.label} gap="sm">
              <Text weight="semibold">{entry.label}</Text>
              <Text size="xs" colorVariant="secondary">
                {entry.description}
              </Text>
              <Accordion type="single" variant={entry.variant} items={onboardingSteps} />
            </Column>
          ))}
        </Column>
      </Card>
    </Column>
  );
}
