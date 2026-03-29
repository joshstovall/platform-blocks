import { Column, QRCode, Row, Text } from '@platform-blocks/ui';

const SHAPES = [
  { label: 'Square modules', value: 'https://platform-blocks.com/square', moduleShape: 'square' as const, cornerRadius: undefined },
  { label: 'Rounded modules', value: 'https://platform-blocks.com/rounded', moduleShape: 'rounded' as const, cornerRadius: 0.4 },
  { label: 'Diamond modules', value: 'https://platform-blocks.com/diamond', moduleShape: 'diamond' as const, cornerRadius: undefined }
] as const;

export default function Demo() {
  return (
    <Column gap="sm">
      <Text variant="small" colorVariant="muted">
        Module geometry
      </Text>
      <Row gap="lg" wrap="wrap" justify="center">
        {SHAPES.map(({ label, value, moduleShape, cornerRadius }) => (
          <Column key={label} gap="xs" align="center">
            <QRCode
              value={value}
              size={150}
              moduleShape={moduleShape}
              cornerRadius={cornerRadius}
              quietZone={1}
            />
            <Text variant="small" colorVariant="muted">
              {label}
            </Text>
          </Column>
        ))}
      </Row>
    </Column>
  );
}


