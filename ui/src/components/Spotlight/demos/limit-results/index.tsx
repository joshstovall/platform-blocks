import { Spotlight, useSpotlightStoreInstance, Text, Button, Flex, Card } from '@platform-blocks/ui';

const all = Array.from({ length: 25 }).map((_, i) => ({
  id: 'item-' + i,
  label: 'Command ' + (i + 1),
  description: 'Example action #' + (i + 1),
  icon: 'star',
  onPress: () => console.log('command', i + 1)
}));

export default function Demo() {
  const [store] = useSpotlightStoreInstance();
  
  return (
    <Flex direction="column" gap={16}>
      <Card p={16} variant="outline">
        <Text size="lg" weight="semibold" mb={8}>Limiting Results</Text>
        <Text size="sm" color="dimmed" mb={12}>Only first 8 filtered actions will display.</Text>
        <Button title="Open Spotlight" onPress={() => store.open()} />
      </Card>
      <Spotlight actions={all as any} limit={8} store={store} />
    </Flex>
  );
}
