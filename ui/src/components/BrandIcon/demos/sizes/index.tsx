import { BrandIcon, Card, Block, Row, Text } from '@platform-blocks/ui';

export default function Demo() {
  return (
    <Card variant="outline" p="xl">
      <Row align="center" gap="lg" wrap="wrap">
        <Block align="center">
          <BrandIcon brand="google" size="sm" />
          <Text variant="small">sm</Text>
        </Block>
        <Block align="center">
          <BrandIcon brand="google" size="md" />
          <Text variant="small">md</Text>
        </Block>
        <Block align="center">
          <BrandIcon brand="google" size="lg" />
          <Text variant="small">lg</Text>
        </Block>
        <Block align="center">
          <BrandIcon brand="google" size="xl" />
          <Text variant="small">xl</Text>
        </Block>
      </Row>
    </Card>
  );
}
