import { Column, QRCode, Row, Text } from '@platform-blocks/ui';

const SIZES = [128, 152, 176, 200] as const;

export default function Demo() {
  return (
    <Column gap="sm">
      <Text variant="small" colorVariant="muted">
        Available size presets
      </Text>
      <Row gap="lg" align="center" wrap="wrap" justify="center">
        {SIZES.map((size) => (
          <Column key={size} gap="xs" align="center">
            <QRCode value="https://platform-blocks.com" size={size} quietZone={2} />
            <Text variant="small" colorVariant="muted">
              {size}px
            </Text>
          </Column>
        ))}
      </Row>
    </Column>
  );
}


