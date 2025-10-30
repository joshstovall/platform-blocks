import { Spotlight, useSpotlightStoreInstance, Text, Button, Flex, Card } from '@platform-blocks/ui';

const SPOTLIGHT_ACTIONS = [
  {
    group: 'Navigation',
    actions: [
      { id: 'home', label: 'Home', icon: 'home', onPress: () => console.log('home') },
      { id: 'dashboard', label: 'Dashboard', description: 'Main metrics overview', icon: 'star', onPress: () => console.log('dashboard') },
    ]
  },
  {
    group: 'Settings',
    actions: [
      { id: 'profile', label: 'Profile', icon: 'user', onPress: () => console.log('profile') },
      { id: 'billing', label: 'Billing Settings', description: 'Manage payment methods', icon: 'settings', onPress: () => console.log('billing') },
    ]
  }
];

export default function Demo() {
  const [store] = useSpotlightStoreInstance();
  
  return (
    <Flex direction="column" gap={16}>
      <Card p={16} variant="outline">
        <Text size="lg" weight="semibold" mb={8}>Grouped Actions</Text>
        <Text size="sm" color="dimmed" mb={12}>Actions organized under logical group headers.</Text>
        <Button title="Open Spotlight" variant="secondary" onPress={() => store.open()} />
      </Card>
      <Spotlight actions={SPOTLIGHT_ACTIONS as any} store={store} />
    </Flex>
  );
}
