import { Button, Card, Column, Spotlight, Text, useSpotlightStoreInstance, type SpotlightProps } from '@platform-blocks/ui';

const actions: SpotlightProps['actions'] = Array.from({ length: 25 }).map((_, index) => ({
  id: `command-${index}`,
  label: `Command ${index + 1}`,
  description: `Example action #${index + 1}`,
  icon: 'star',
  onPress: () => console.log('command', index + 1),
}));

export default function Demo() {
  const [store] = useSpotlightStoreInstance();

  return (
    <Column gap="lg">
      <Card p="md">
        <Column gap="md">
          <Text size="sm" colorVariant="secondary">
            Set the `limit` prop to constrain how many results render, even if more actions match the query.
          </Text>
          <Button onPress={() => store.open()}>Open spotlight</Button>
          <Text size="xs" colorVariant="secondary">
            This demo caps the list at 8 items.
          </Text>
        </Column>
      </Card>
      <Spotlight actions={actions} limit={8} store={store} />
    </Column>
  );
}
