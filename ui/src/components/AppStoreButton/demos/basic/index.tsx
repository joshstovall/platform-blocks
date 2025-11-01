import { AppStoreButton, Column, Row, Text } from '@platform-blocks/ui';

export default function AppStoreButtonBasicDemo() {
  const handlePress = (store: string) => {
    console.log(`Pressed ${store} button`);
    // In a real app, you would navigate to the respective app store
  };

  return (
    <Column gap="2xl" p="lg">
      <Column gap="md">
        <Text weight="semibold" size="lg">App Store Indicators</Text>
        <Text colorVariant="secondary" size="sm">
          Pre-styled app store download buttons with proper branding and localization support.
        </Text>
      </Column>

      <Column gap="lg">
        <Text weight="medium" size="md">Popular App Stores</Text>
        <Row gap="md" wrap="wrap">
          <AppStoreButton
            store="app-store"
            onPress={() => handlePress('App Store')}
          />
          <AppStoreButton
            store="google-play"
            onPress={() => handlePress('Google Play')}
          />
          <AppStoreButton
            store="microsoft-store"
            onPress={() => handlePress('Microsoft Store')}
          />
        </Row>
      </Column>

      <Column gap="lg">
        <Text weight="medium" size="md">Alternative Stores</Text>
        <Row gap="md" wrap="wrap">
          <AppStoreButton
            store="amazon-appstore"
            onPress={() => handlePress('Amazon Appstore')}
          />
          <AppStoreButton
            store="mac-app-store"
            onPress={() => handlePress('Mac App Store')}
          />
          <AppStoreButton
            store="f-droid"
            onPress={() => handlePress('F-Droid')}
          />
        </Row>
      </Column>
    </Column>
  );
}