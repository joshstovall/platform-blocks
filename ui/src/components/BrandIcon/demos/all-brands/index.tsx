import { Block, BrandIcon, Card, Row, Text } from '@platform-blocks/ui';
import { ALL_BRANDS } from '../data';

export default function Demo() {
  return (
    <Card variant="outline" p="xl">
      <Row align="center" gap="md" wrap="wrap">
        {ALL_BRANDS.map((brand) => (
          <Block key={brand} align="center" gap="xs" minW={60}>
            <BrandIcon brand={brand} size={36} />
            <Text variant="small" align="center" size={10}>
              {brand}
            </Text>
          </Block>
        ))}
      </Row>
    </Card>
  );
}
