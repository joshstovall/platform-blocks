import type { AppStoreButtonProps } from '@platform-blocks/ui';
import { AppStoreButton, Column, Row, Text } from '@platform-blocks/ui';

type StoreName = AppStoreButtonProps['store'];

const storeGroups: { title: string; stores: { store: StoreName; label: string }[] }[] = [
  {
    title: 'Popular app stores',
    stores: [
      { store: 'app-store', label: 'App Store' },
      { store: 'google-play', label: 'Google Play' },
      { store: 'microsoft-store', label: 'Microsoft Store' },
    ],
  },
  {
    title: 'Alternative storefronts',
    stores: [
      { store: 'amazon-appstore', label: 'Amazon Appstore' },
      { store: 'mac-app-store', label: 'Mac App Store' },
      { store: 'f-droid', label: 'F-Droid' },
    ],
  },
];

export default function Demo() {
  const handlePress = (label: string) => {
    console.log(`Open ${label}`);
  };

  return (
    <Column gap="lg">
      {storeGroups.map(({ title, stores }) => (
        <Column key={title} gap="xs">
          <Text size="sm" weight="medium">
            {title}
          </Text>

          <Row gap="md" wrap="wrap">
            {stores.map(({ store, label }) => (
              <AppStoreButton
                key={store}
                store={store}
                onPress={() => handlePress(label)}
              />
            ))}
          </Row>
        </Column>
      ))}
    </Column>
  );
}