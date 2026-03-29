import { Column, QRCode, Row, Text, useTheme } from '@platform-blocks/ui';

const LOGO_EXAMPLES = [
  {
    label: 'Rounded modules',
    value: 'https://platform-blocks.com/events/media-day',
    moduleShape: 'rounded' as const,
    cornerRadius: 0.4,
    logo: {
      uri: 'https://static.platform-blocks.com/logo-mark.png',
      size: 56,
      borderRadius: 12
    }
  },
  {
    label: 'Square modules',
    value: 'https://platform-blocks.com/support/app',
    moduleShape: 'square' as const,
    cornerRadius: undefined,
    logo: {
      uri: 'https://static.platform-blocks.com/logo-glyph-dark.png',
      size: 48,
      borderRadius: 8
    }
  }
] as const;

export default function Demo() {
  const theme = useTheme();

  return (
    <Column gap="lg">
      <Row gap="lg" wrap="wrap" justify="center">
        {LOGO_EXAMPLES.map(({ label, value, moduleShape, cornerRadius, logo }) => (
          <Column key={label} gap="xs" align="center">
            <QRCode
              value={value}
              size={176}
              moduleShape={moduleShape}
              cornerRadius={cornerRadius}
              quietZone={2}
              logo={{
                ...logo,
                backgroundColor: theme.backgrounds.surface
              }}
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


