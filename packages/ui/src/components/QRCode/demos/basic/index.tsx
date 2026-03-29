import { Column, QRCode, Text } from '@platform-blocks/ui';

export default function Demo() {
  return (
    <Column gap="sm" align="center">
      <QRCode value="https://platform-blocks.com" size={168} quietZone={2} />
      <Text variant="small" colorVariant="muted">
        Scan to open the Platform Blocks docs.
      </Text>
    </Column>
  );
}
