import { BrandIcon, Card, Column, Row, Text } from '@platform-blocks/ui';
import { DARK_MODE_BRANDS } from '../data';

export default function Demo() {
  return (
    <Card variant="outline" p="xl">
      <Row align="center" gap="lg" wrap="wrap">
        {DARK_MODE_BRANDS.map((brand) => (
          <Column key={brand} align="center" gap="sm">
            <BrandIcon brand={brand} size="xl" />
            <Text variant="small">{brand === 'x' ? 'X (Twitter)' : brand}</Text>
            <Text variant="small" colorVariant="secondary">
              Auto Dark Mode
            </Text>
          </Column>
        ))}
      </Row>
    </Card>
  );
}
