import { Platform } from 'react-native';
import { Spotlight, useSpotlightStoreInstance, Text, Button, Flex, Card } from '@platform-blocks/ui';

// Reuse a moderate list to showcase vertical scroll in fullscreen
const actions = Array.from({ length: 18 }).map((_, i) => ({
  id: 'mobile-action-' + i,
  label: 'Mobile Action ' + (i + 1),
  description: 'Available everywhere',
  icon: 'star',
  onPress: () => console.log('mobile action', i + 1)
}));

export default function Demo() {
  const [store] = useSpotlightStoreInstance();
  const isMobile = Platform.OS !== 'web';
  
  return (
    <Flex direction="column" gap={16}>
      <Card p={16} variant="outline">
        <Text size="lg" weight="semibold" mb={8}>Fullscreen Mobile Variant</Text>
        <Text size="sm" color="dimmed" mb={12}>
          This demo forces the fullscreen layout on mobile platforms. On web it still appears as a modal so you can compare behaviors.
        </Text>
        <Button title={isMobile ? 'Open Fullscreen Spotlight' : 'Open Spotlight'} onPress={() => store.open()} />
      </Card>
      {/* variant prop influences root Dialog layout; component auto-detects mobile for fullscreen anyway */}
      <Spotlight actions={actions as any} variant="fullscreen" store={store} />
    </Flex>
  );
}
