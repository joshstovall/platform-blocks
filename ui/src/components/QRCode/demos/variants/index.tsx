import { Column, QRCode, Row, Text } from '@platform-blocks/ui';

const ERROR_LEVELS = [
  { label: 'Level L (~7%)', value: 'L' as const },
  { label: 'Level M (~15%)', value: 'M' as const },
  { label: 'Level Q (~25%)', value: 'Q' as const },
  { label: 'Level H (~30%)', value: 'H' as const }
] as const;

const QUIET_ZONES = [0, 2, 4, 8] as const;

export default function Demo() {
  return (
    <Column gap="xl">
      <Column gap="sm">
        <Text variant="small" colorVariant="muted">
          Error correction levels
        </Text>
        <Row gap="lg" wrap="wrap" justify="center">
          {ERROR_LEVELS.map(({ label, value }) => (
            <Column key={value} gap="xs" align="center">
              <QRCode
                value={`https://platform-blocks.com/ecc/${value}`}
                errorCorrectionLevel={value}
                size={140}
              />
              <Text variant="small" colorVariant="muted">
                {label}
              </Text>
            </Column>
          ))}
        </Row>
      </Column>
      <Column gap="sm">
        <Text variant="small" colorVariant="muted">
          Quiet zone widths
        </Text>
        <Row gap="lg" wrap="wrap" justify="center">
          {QUIET_ZONES.map((quietZone) => (
            <Column key={quietZone} gap="xs" align="center">
              <QRCode
                value={`https://platform-blocks.com/quiet-zone/${quietZone}`}
                quietZone={quietZone}
                size={140}
              />
              <Text variant="small" colorVariant="muted">
                Quiet zone: {quietZone}
              </Text>
            </Column>
          ))}
        </Row>
      </Column>
    </Column>
  );
}


