import { BrandIcon, Card, Column, Row, Text } from '@platform-blocks/ui';
import { FEATURED_BRANDS } from '../data';

export default function Demo() {
  return (
    <Card variant="outline" p="xl">
      <Row align="center" gap="md" wrap="wrap">
        {FEATURED_BRANDS.map((brand) => (
          <Column key={brand} align="center" gap="xs">
            <BrandIcon brand={brand} size="xl" />
            <Text variant="small" align="center">
              {brand}
            </Text>
          </Column>
        ))}
      </Row>
    </Card>
  );
}
