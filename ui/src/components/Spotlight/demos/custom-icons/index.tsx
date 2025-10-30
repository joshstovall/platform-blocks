import { Spotlight, useSpotlightStoreInstance, Text, Button, Flex, Card, Icon } from '@platform-blocks/ui';

const ACTIONS = [
  { id: 'deploy', label: 'Deploy Service', description: 'Trigger CI/CD deployment', icon: <Icon name="bolt" size="md" />, onPress: () => console.log('deploy') },
  { id: 'logs', label: 'View Logs', description: 'Inspect recent system logs', icon: <Icon name="code" size="md" />, onPress: () => console.log('logs') },
  { id: 'alerts', label: 'Open Alerts', description: 'Show active alerts', icon: <Icon name="bell" size="md" />, onPress: () => console.log('alerts') },
];

export default function Demo() {
  const [store] = useSpotlightStoreInstance();
  
  return (
    <Flex direction="column" gap={16}>
      <Card p={16} variant="outline">
        <Text size="lg" weight="semibold" mb={8}>Custom Icons</Text>
        <Text size="sm" color="dimmed" mb={12}>Actions can use custom React nodes for icons.</Text>
        <Button title="Open Spotlight" variant="outline" onPress={() => store.open()} />
      </Card>
      <Spotlight actions={ACTIONS as any} store={store} />
    </Flex>
  );
}
