import { BrandIcon, Card, Column, Row, Text } from '@platform-blocks/ui';

export default function Demo() {
  return (
    <Card variant="outline" p="xl">
      <Row align="center" gap="lg" wrap="wrap">
        <Column align="center" gap="sm">
          <BrandIcon brand="google" size="sm" />
          <Text variant="small">sm</Text>
        </Column>
        <Column align="center" gap="sm">
          <BrandIcon brand="google" size="md" />
          <Text variant="small">md</Text>
        </Column>
        <Column align="center" gap="sm">
          <BrandIcon brand="google" size="lg" />
          <Text variant="small">lg</Text>
        </Column>
        <Column align="center" gap="sm">
          <BrandIcon brand="google" size="xl" />
          <Text variant="small">xl</Text>
        </Column>
      </Row>
    </Card>
  );
}
