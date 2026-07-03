import { Accordion, Card, Column, Text } from '@platform-blocks/ui';

const items = [
  {
    key: 'info',
    title: 'Informational',
    color: 'primary' as const,
    content: <Text size="sm">Each item sets its own `color`, so one accordion can mix accents on the expanded panel.</Text>,
  },
  {
    key: 'healthy',
    title: 'All systems healthy',
    color: 'success' as const,
    content: <Text size="sm">The title, chevron, and surface tint pick up this item's color while it is open.</Text>,
  },
  {
    key: 'review',
    title: 'Needs review',
    color: 'warning' as const,
    content: <Text size="sm">Collapsed items stay neutral so only the open panel is highlighted.</Text>,
  },
  {
    key: 'failed',
    title: 'Build failed',
    color: 'error' as const,
    content: <Text size="sm">Use error to emphasize failures or destructive details.</Text>,
  },
  {
    key: 'archived',
    title: 'Archived',
    color: 'gray' as const,
    content: <Text size="sm">Gray gives neutral emphasis when a brand tint would distract.</Text>,
  },
];

export default function Demo() {
  return (
    <Column gap="lg">
      <Card p="md">
        <Column gap="md">
          <Text size="sm" colorVariant="secondary">
            Set `color` on individual items to accent each expanded panel with a different theme palette.
          </Text>
          <Accordion type="multiple" variant="separated" defaultExpanded={['healthy']} items={items} />
        </Column>
      </Card>
    </Column>
  );
}
