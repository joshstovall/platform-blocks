import { BrandIcon, Column, Row, Text } from '@platform-blocks/ui';
import { SAMPLE_BRANDS } from '../data';

export default function Demo() {
  return (
    <Column gap="lg">
      <Row align="center" gap="md" wrap="wrap">
        {SAMPLE_BRANDS.map((brand) => (
          <Column key={brand} align="center" gap="xs" minWidth={72}>
            <BrandIcon brand={brand} size="xl" />
            <Text variant="small" align="center">
              {brand}
            </Text>
          </Column>
        ))}
      </Row>
    </Column>
  );
}