import { Button, Card, Column, Spotlight, Text, useSpotlightStoreInstance, type SpotlightProps } from '@platform-blocks/ui';

const actions: SpotlightProps['actions'] = [
  {
    group: 'Navigation',
    actions: [
      { id: 'home', label: 'Home', icon: 'home', onPress: () => console.log('navigate: home') },
      {
        id: 'dashboard',
        label: 'Dashboard',
        description: 'Jump to the analytics overview',
        icon: 'star',
        onPress: () => console.log('navigate: dashboard'),
      },
    ],
  },
  {
    group: 'Settings',
    actions: [
      { id: 'profile', label: 'Profile', icon: 'user', onPress: () => console.log('navigate: profile') },
      {
        id: 'billing',
        label: 'Billing settings',
        description: 'Manage payment methods',
        icon: 'settings',
        onPress: () => console.log('navigate: billing'),
      },
    ],
  },
];

export default function Demo() {
  const [store] = useSpotlightStoreInstance();

  return (
    <Column gap="lg">
      <Card p="md">
        <Column gap="md">
          <Text size="sm" colorVariant="secondary">
            Group actions to create semantic sections inside the results list. Each group renders a header before its nested actions.
          </Text>
          <Button variant="secondary" onPress={() => store.open()}>
            Open spotlight
          </Button>
        </Column>
      </Card>
      <Spotlight actions={actions} store={store} />
    </Column>
  );
}
