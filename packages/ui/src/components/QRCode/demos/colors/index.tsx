import { Column, QRCode, Row, Text, useTheme } from '@platform-blocks/ui';

const SCHEMES = [
  { key: 'primary', label: 'Primary accent' },
  { key: 'success', label: 'Success state' },
  { key: 'warning', label: 'Warning state' },
  { key: 'error', label: 'Error state' }
] as const;

export default function Demo() {
  const theme = useTheme();

  return (
    <Column gap="lg">
      <Text variant="small" colorVariant="muted">
        Theme-aligned palettes
      </Text>
      <Row gap="lg" wrap="wrap" justify="center">
        {SCHEMES.map(({ key, label }) => {
          const palette = theme.colors[key];
          const foreground = palette?.[6] ?? theme.colors.primary[6];
          const background = palette?.[0] ?? theme.backgrounds.surface;

          return (
            <Column key={key} gap="xs" align="center">
              <QRCode
                value="https://platform-blocks.com"
                size={144}
                backgroundColor={background}
                color={foreground}
                quietZone={2}
              />
              <Text variant="small" colorVariant="muted">
                {label}
              </Text>
            </Column>
          );
        })}
      </Row>
    </Column>
  );
}


