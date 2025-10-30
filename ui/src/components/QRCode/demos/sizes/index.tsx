import { QRCode, Row, Text, Column } from '@platform-blocks/ui';

export default function Demo() {
  const sizes = [100, 150, 200, 250];

  return (
      <Row gap={16} align="center" wrap="wrap">
        {sizes.map((size) => (
          <Column key={size} gap={8} align="center">
            <QRCode
              value="https://platform-blocks.com"
              size={size}
            />
            <Text variant="caption">{size}px</Text>
          </Column>
        ))}
      </Row>
  );
}


