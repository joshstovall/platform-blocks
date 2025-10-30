import { QRCode, Row, Text, Column } from '@platform-blocks/ui';

export default function Demo() {
  const colorSchemes = [
    { bg: '#ffffff', fg: '#000000', name: 'Default' },
    { bg: '#1a1a1a', fg: '#ffffff', name: 'Dark' },
    { bg: '#f0f9ff', fg: '#0ea5e9', name: 'Blue' },
    { bg: '#f0fdf4', fg: '#22c55e', name: 'Green' },
  ];

  return (
    <Column gap={16}>
      <Text variant="h6">QR Code Colors</Text>
      <Row gap={16} wrap="wrap">
        {colorSchemes.map((scheme) => (
          <Column key={scheme.name} gap={8} align="center">
            <QRCode
              value="https://platform-blocks.com"
              size={150}
              backgroundColor={scheme.bg}
              color={scheme.fg}
            />
            <Text variant="caption">{scheme.name}</Text>
          </Column>
        ))}
      </Row>
    </Column>
  );
}


