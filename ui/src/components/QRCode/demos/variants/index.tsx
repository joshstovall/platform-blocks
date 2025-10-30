import { QRCode, Row, Text, Column, Card, Title } from '@platform-blocks/ui';

export default function Demo() {
  const eccLevels = [
    { label: 'ECC L (Low)', level: 'L' as const },
    { label: 'ECC M (Medium)', level: 'M' as const },
    { label: 'ECC Q (Quartile)', level: 'Q' as const },
    { label: 'ECC H (High)', level: 'H' as const },
  ];

  const quietZones = [0, 2, 4, 8];

  return (
    <Column gap={24}>
      <Column gap={16}>
        <Title afterline weight="medium">Error Correction Levels</Title>
        <Row gap={16} wrap="wrap">
          {eccLevels.map((ecc) => (
            <Card key={ecc.level} padding={12}>
              <Column gap={8} align="center">
                <QRCode
                  value={`ECC-${ecc.level}-Test`}
                  errorCorrectionLevel={ecc.level}
                  size={140}
                />
                <Text variant="caption">{ecc.label}</Text>
              </Column>
            </Card>
          ))}
        </Row>
      </Column>

      <Column gap={16}>
        <Title afterline weight="medium">Quiet Zones</Title>
        <Row gap={16} wrap="wrap">
          {quietZones.map((qz) => (
            <Card key={qz} padding={12}>
              <Column gap={8} align="center">
                <QRCode
                  value={`QuietZone-${qz}`}
                  quietZone={qz}
                  size={140}
                />
                <Text variant="caption">QZ: {qz}px</Text>
              </Column>
            </Card>
          ))}
        </Row>
      </Column>
    </Column>
  );
}


