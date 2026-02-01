import { BrandIcon, Block, Row, Text } from '@platform-blocks/ui';
import { SAMPLE_BRANDS } from '../data';

export default function Demo() {
  return (
    <Block gap="lg">
      <Row align="center" gap="md" wrap="wrap">
        {SAMPLE_BRANDS.map((brand) => (
          <Block key={brand} align="center" gap="xs" minW={72}>
            <BrandIcon brand={brand} size="xl" />
            <Text variant="small" align="center">
              {brand}
            </Text>
          </Block>
        ))}
      </Row>
    </Block>
  );
}