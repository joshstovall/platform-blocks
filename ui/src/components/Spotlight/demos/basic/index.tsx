import { Spotlight, useSpotlightStoreInstance, Text, Button, Flex, Card } from '@platform-blocks/ui';

const ACTIONS = [
  { id: 'home', label: 'Go to Home', description: 'Navigate to the home screen', icon: 'home', onPress: () => console.log('Home') },
  { id: 'profile', label: 'Open Profile', description: 'View your user profile', icon: 'user', onPress: () => console.log('Profile') },
  { id: 'settings', label: 'Settings', description: 'Adjust application preferences', icon: 'settings', onPress: () => console.log('Settings') },
];

export default function Demo() {
  const [store] = useSpotlightStoreInstance();
  
  return (
    <Flex direction="column" gap={16}>
      <Card p={16} variant="outline">
        <Text size="lg" weight="semibold" mb={8}>Basic Spotlight</Text>
        <Text size="sm" color="dimmed" mb={12}>Press Cmd/Ctrl+K or use the button to open the command palette.</Text>
        <Button title="Open Spotlight" onPress={() => store.open()} />
      </Card>
      <Spotlight actions={ACTIONS} store={store} />
    </Flex>
  );
}
