import { useState } from 'react';
import { SpotlightProvider, Spotlight, useSpotlightStoreInstance, spotlight, Text, Button, Flex, Card } from '@platform-blocks/ui';

const baseActions = [
  { id: 'ping', label: 'Ping Server', description: 'Send a ping to backend', icon: 'bolt', onPress: () => console.log('ping') },
  { id: 'refresh', label: 'Refresh Data', description: 'Reload cached data', icon: 'refresh', onPress: () => console.log('refresh') },
];

export default function Demo() {
  const [store] = useSpotlightStoreInstance();
  const [dynamicCount, setDynamicCount] = useState(0);

  const actions = [
    ...baseActions,
    { id: 'add-dynamic', label: 'Add Dynamic Action', icon: 'plus', onPress: () => setDynamicCount(c => c + 1) },
    ...Array.from({ length: dynamicCount }).map((_, i) => ({
      id: 'dyn-' + i,
      label: 'Dynamic Action ' + (i + 1),
      description: 'Added at runtime',
      icon: 'star',
      onPress: () => console.log('dynamic', i + 1)
    })),
  ];

  // Global actions for the global spotlight
  const globalActions = [
    { id: 'global-home', label: 'Global Home', description: 'Navigate home globally', icon: 'home', onPress: () => console.log('global home') },
    { id: 'global-settings', label: 'Global Settings', description: 'Open global settings', icon: 'settings', onPress: () => console.log('global settings') },
  ];

  return (
    <SpotlightProvider>
      <Flex direction="column" gap={16}>
        <Card p={16} variant="outline">
          <Text size="lg" weight="semibold" mb={8}>Programmatic Store & Dynamic Actions</Text>
          <Text size="sm" color="dimmed" mb={12}>Demo store vs Global store; actions can add more actions.</Text>
          <Flex direction="row" gap={12}>
            <Button title="Open Demo Store" onPress={() => store.open()} />
            <Button title="Global Toggle" variant="outline" onPress={() => spotlight.toggle()} />
          </Flex>
        </Card>
        {/* Demo-specific spotlight with dynamic actions */}
        <Spotlight actions={actions as any} store={store} />
        {/* Global spotlight with different actions */}
        <Spotlight actions={globalActions as any} />
      </Flex>
    </SpotlightProvider>
  );
}
