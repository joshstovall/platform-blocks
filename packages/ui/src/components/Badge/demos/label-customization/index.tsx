import { Badge, Column, Row, Text } from '@platform-blocks/ui';

export default function Demo() {
  return (
    <Column gap="lg">
      <Column gap="sm">
        <Text size="sm" colorVariant="muted">Default</Text>
        <Row gap="sm">
          <Badge>NEW</Badge>
          <Badge color="success">DONE</Badge>
          <Badge color="error">ERROR</Badge>
        </Row>
      </Column>

      <Column gap="sm">
        <Text size="sm" colorVariant="muted">Uppercase tracked label</Text>
        <Row gap="sm">
          <Badge labelProps={{ uppercase: true, tracking: 1.2, weight: '700' }}>
            featured
          </Badge>
          <Badge
            color="warning"
            labelProps={{ uppercase: true, tracking: 1.2, weight: '700' }}
          >
            beta
          </Badge>
        </Row>
      </Column>

      <Column gap="sm">
        <Text size="sm" colorVariant="muted">Monospace numeric badge</Text>
        <Row gap="sm">
          <Badge color="primary" labelProps={{ ff: 'monospace', weight: '600' }}>
            v2.4.1
          </Badge>
          <Badge variant="outline" labelProps={{ ff: 'monospace' }}>
            #1024
          </Badge>
        </Row>
      </Column>
    </Column>
  );
}
