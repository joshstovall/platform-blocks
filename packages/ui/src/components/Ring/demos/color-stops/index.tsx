import { Card, Column, Ring, Row, Text } from '@platform-blocks/ui';

const colorStops = [
  { value: 0, color: '#f87171' },
  { value: 60, color: '#fb923c' },
  { value: 75, color: '#f59e0b' },
  { value: 85, color: '#0ea5e9' },
  { value: 92, color: '#14b8a6' },
];

const completionSamples = [48, 72, 97];

export default function Demo() {
  return (
    <Column gap="lg">
      <Card p="md">
        <Column gap="md">
          <Text size="sm" colorVariant="secondary">
            Provide ordered `colorStops` to create gradient-style progress rings that shift tone as completion grows.
          </Text>
          <Row gap="lg" justify="center" wrap="wrap">
            {completionSamples.map((value) => (
              <Column key={value} gap="xs" align="center">
                <Ring
                  value={value}
                  size={110}
                  thickness={12}
                  caption={`${value}%`}
                  colorStops={colorStops}
                />
                <Text size="xs" colorVariant="secondary">
                  {value}% complete
                </Text>
              </Column>
            ))}
          </Row>
        </Column>
      </Card>
    </Column>
  );
}
