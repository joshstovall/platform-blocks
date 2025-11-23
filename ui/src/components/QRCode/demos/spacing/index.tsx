import { Block, Column, QRCode, Text, useTheme } from '@platform-blocks/ui';

const QUIET_ZONES = [
  { label: 'Default quiet zone (4)', quietZone: undefined },
  { label: 'Minimal quiet zone (1)', quietZone: 1 },
  { label: 'No quiet zone (0)', quietZone: 0 }
] as const;

export default function Demo() {
  const theme = useTheme();

  return (
    <Column gap="lg" align="center">
      {QUIET_ZONES.map(({ label, quietZone }) => (
        <Column key={label} gap="xs" align="center">
          <QRCode value="https://platform-blocks.com" size={150} quietZone={quietZone} />
          <Text variant="small" colorVariant="muted">
            {label}
          </Text>
        </Column>
      ))}
      <Column gap="xs" align="center">
        <Block bg={theme.backgrounds.subtle} radius="lg" p="sm">
          <QRCode
            value="https://platform-blocks.com"
            size={150}
            quietZone={0}
            m="xs"
          />
        </Block>
        <Text variant="small" colorVariant="muted">
          Use spacing props and container styling to pad the QR code externally.
        </Text>
      </Column>
    </Column>
  );
}
