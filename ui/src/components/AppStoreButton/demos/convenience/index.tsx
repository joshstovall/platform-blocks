import React from 'react';
import {
  GooglePlayButton,
  AppleAppStoreButton,
  MacAppStoreButton,
  MicrosoftStoreButton,
  AmazonAppstoreButton,
  FDroidButton,
  Column,
  Row,
  Text,
  Block,
} from '@platform-blocks/ui';

export default function AppStoreButtonConvenienceDemo() {
  const handleDownload = (store: string) => {
    console.log(`Opening ${store}...`);
    // In a real app, you would open the respective app store URL
  };

  return (
    <Column gap="2xl" p="lg">
      <Column gap="sm">
        <Text weight="semibold" size="lg">Convenience Components</Text>
        <Text colorVariant="secondary" size="sm">
          Pre-configured components for each app store. No need to specify the 'store' prop.
        </Text>
      </Column>

      <Column gap="lg">
        <Text weight="medium" size="md">Individual Store Buttons</Text>
        <Column gap="md">
          <Row align="center" gap="md">
            <Block minW={120}>
              <Text size="sm">Apple App Store:</Text>
            </Block>
            <AppleAppStoreButton onPress={() => handleDownload('App Store')} />
          </Row>
          
          <Row align="center" gap="md">
            <Block minW={120}>
              <Text size="sm">Google Play:</Text>
            </Block>
            <GooglePlayButton onPress={() => handleDownload('Google Play')} />
          </Row>
          
          <Row align="center" gap="md">
            <Block minW={120}>
              <Text size="sm">Mac App Store:</Text>
            </Block>
            <MacAppStoreButton onPress={() => handleDownload('Mac App Store')} />
          </Row>
          
          <Row align="center" gap="md">
            <Block minW={120}>
              <Text size="sm">Microsoft Store:</Text>
            </Block>
            <MicrosoftStoreButton onPress={() => handleDownload('Microsoft Store')} />
          </Row>
          
          <Row align="center" gap="md">
            <Block minW={120}>
              <Text size="sm">Amazon Appstore:</Text>
            </Block>
            <AmazonAppstoreButton onPress={() => handleDownload('Amazon Appstore')} />
          </Row>
          
          <Row align="center" gap="md">
            <Block minW={120}>
              <Text size="sm">F-Droid:</Text>
            </Block>
            <FDroidButton onPress={() => handleDownload('F-Droid')} />
          </Row>
        </Column>
      </Column>

      <Column gap="lg">
        <Text weight="medium" size="md">Different Sizes</Text>
        <Row gap="md" wrap="wrap" align="center">
          <GooglePlayButton size="sm" onPress={() => handleDownload('Google Play')} />
          <AppleAppStoreButton size="md" onPress={() => handleDownload('App Store')} />
          <MicrosoftStoreButton size="lg" onPress={() => handleDownload('Microsoft Store')} />
        </Row>
      </Column>

      <Column gap="lg">
        <Text weight="medium" size="md">Localized Buttons</Text>
        <Row gap="md" wrap="wrap">
          <GooglePlayButton locale="es" onPress={() => handleDownload('Google Play')} />
          <AppleAppStoreButton locale="fr" onPress={() => handleDownload('App Store')} />
          <MicrosoftStoreButton locale="de" onPress={() => handleDownload('Microsoft Store')} />
        </Row>
      </Column>

      <Column gap="sm">
        <Text weight="medium" size="sm">Usage</Text>
        <Block bg="#f5f5f5" radius="sm" p="sm">
          <Text size="xs" colorVariant="secondary" fontFamily="monospace">
            {`<GooglePlayButton onPress={handleDownload} />\n<AppleAppStoreButton size="lg" locale="es" />\n<MicrosoftStoreButton disabled />`}
          </Text>
        </Block>
      </Column>
    </Column>
  );
}