import { Chip, Column, Row, Text } from '@platform-blocks/ui';

export default function Demo() {
  return (
    <Column gap="lg">
      <Column gap="sm">
        <Text size="sm" colorVariant="muted">Default</Text>
        <Row gap="sm">
          <Chip>react</Chip>
          <Chip color="primary">typescript</Chip>
          <Chip color="success">approved</Chip>
        </Row>
      </Column>

      <Column gap="sm">
        <Text size="sm" colorVariant="muted">Monospace tag chips</Text>
        <Row gap="sm">
          <Chip variant="outline" labelProps={{ ff: 'monospace', weight: '600' }}>
            #api
          </Chip>
          <Chip color="primary" labelProps={{ ff: 'monospace' }}>
            #web
          </Chip>
        </Row>
      </Column>

      <Column gap="sm">
        <Text size="sm" colorVariant="muted">Uppercase pill labels</Text>
        <Row gap="sm">
          <Chip
            color="success"
            labelProps={{ uppercase: true, tracking: 1, weight: '700' }}
          >
            shipped
          </Chip>
          <Chip
            color="warning"
            labelProps={{ uppercase: true, tracking: 1, weight: '700' }}
          >
            in review
          </Chip>
        </Row>
      </Column>
    </Column>
  );
}
