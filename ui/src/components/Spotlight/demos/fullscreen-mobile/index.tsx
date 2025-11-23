import { Platform } from 'react-native';
import { Button, Card, Column, Spotlight, Text, useSpotlightStoreInstance, type SpotlightProps } from '@platform-blocks/ui';

// Reuse a moderate list to showcase vertical scroll in fullscreen
const actions: SpotlightProps['actions'] = Array.from({ length: 18 }).map((_, index) => ({
  id: `mobile-action-${index}`,
  label: `Mobile action ${index + 1}`,
  description: 'Available on every screen',
  icon: 'star',
  onPress: () => console.log('mobile action', index + 1),
}));

export default function Demo() {
  const [store] = useSpotlightStoreInstance();
  const isMobile = Platform.OS !== 'web';

  return (
    <Column gap="lg">
      <Card p="md">
        <Column gap="md">
          <Text size="sm" colorVariant="secondary">
            Force the `fullscreen` variant to mimic a native sheet on touch devices while keeping the modal layout on web for comparison.
          </Text>
          <Button onPress={() => store.open()}>
            {isMobile ? 'Open fullscreen spotlight' : 'Open spotlight'}
          </Button>
          <Text size="xs" colorVariant="secondary">
            The component already auto-detects mobile surfaces; this demo pins the variant for clarity.
          </Text>
        </Column>
      </Card>
      <Spotlight actions={actions} variant="fullscreen" store={store} />
    </Column>
  );
}
