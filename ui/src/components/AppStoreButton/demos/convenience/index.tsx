import {
  AmazonAppstoreButton,
  AppleAppStoreButton,
  Block,
  Column,
  FDroidButton,
  GooglePlayButton,
  MacAppStoreButton,
  MicrosoftStoreButton,
  Row,
  Text,
} from '@platform-blocks/ui';

const helperButtons = [
  { label: 'Apple App Store', ButtonComponent: AppleAppStoreButton },
  { label: 'Google Play', ButtonComponent: GooglePlayButton },
  { label: 'Mac App Store', ButtonComponent: MacAppStoreButton },
  { label: 'Microsoft Store', ButtonComponent: MicrosoftStoreButton },
  { label: 'Amazon Appstore', ButtonComponent: AmazonAppstoreButton },
  { label: 'F-Droid', ButtonComponent: FDroidButton },
];

export default function Demo() {
  const handleDownload = (label: string) => {
    console.log(`Open ${label}`);
  };

  return (
    <Column gap="lg">
      <Column gap="sm">
        <Text size="sm" weight="medium">
          One-line helpers
        </Text>

        <Column gap="sm">
          {helperButtons.map(({ label, ButtonComponent }) => (
            <Row key={label} align="center" gap="md" wrap="wrap">
              <Block minW={140}>
                <Text size="sm" colorVariant="secondary">
                  {label}
                </Text>
              </Block>
              <ButtonComponent onPress={() => handleDownload(label)} />
            </Row>
          ))}
        </Column>
      </Column>

      <Column gap="sm">
        <Text size="sm" weight="medium">
          Sizes and locales
        </Text>

        <Row gap="md" wrap="wrap" align="center">
          <GooglePlayButton size="sm" onPress={() => handleDownload('Google Play')} />
          <AppleAppStoreButton size="md" onPress={() => handleDownload('App Store')} />
          <MicrosoftStoreButton size="lg" onPress={() => handleDownload('Microsoft Store')} />
          <AmazonAppstoreButton locale="es" onPress={() => handleDownload('Amazon Appstore')} />
          <MacAppStoreButton locale="fr" onPress={() => handleDownload('Mac App Store')} />
          <FDroidButton locale="de" onPress={() => handleDownload('F-Droid')} />
        </Row>
      </Column>
    </Column>
  );
}