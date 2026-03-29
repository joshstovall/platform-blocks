import { BrandIcon, Card, Column, Row, Title } from '@platform-blocks/ui';
import { SAMPLE_BRANDS } from '../data';

export default function Demo() {
  return (
    <Card variant="outline" p="xl">
      <Column gap="md">
        <Row align="center" gap="md" wrap="wrap">
          <Title variant="small" colorVariant="secondary">
            Default Color:
          </Title>
          {SAMPLE_BRANDS.map((brand) => (
            <BrandIcon key={brand} brand={brand} size="xl" variant="mono" />
          ))}
        </Row>

        <Row align="center" gap="md" wrap="wrap">
          <Title variant="small" colorVariant="secondary">
            Custom Blue:
          </Title>
          {SAMPLE_BRANDS.map((brand) => (
            <BrandIcon
              key={`${brand}-blue`}
              brand={brand}
              size="xl"
              variant="mono"
              color="#1976D2"
            />
          ))}
        </Row>

        <Row align="center" gap="md" wrap="wrap">
          <Title variant="small" colorVariant="secondary">
            Custom Red:
          </Title>
          {SAMPLE_BRANDS.map((brand) => (
            <BrandIcon
              key={`${brand}-red`}
              brand={brand}
              size="xl"
              variant="mono"
              color="#D32F2F"
            />
          ))}
        </Row>
      </Column>
    </Card>
  );
}
