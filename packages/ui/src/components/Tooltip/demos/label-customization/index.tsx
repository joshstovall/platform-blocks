import { Button, Column, Row, Text, Tooltip } from '@platform-blocks/ui';

export default function Demo() {
  return (
    <Column gap="lg">
      <Column gap="sm">
        <Text size="sm" colorVariant="muted">Default tooltip label</Text>
        <Row gap="md">
          <Tooltip label="Save your progress" position="top">
            <Button>Save</Button>
          </Tooltip>
        </Row>
      </Column>

      <Column gap="sm">
        <Text size="sm" colorVariant="muted">
          Monospace shortcut tooltip
        </Text>
        <Row gap="md">
          <Tooltip
            label="cmd + S"
            position="top"
            labelProps={{ ff: 'monospace', weight: '600' }}
          >
            <Button>Save</Button>
          </Tooltip>
          <Tooltip
            label="cmd + shift + p"
            position="top"
            labelProps={{ ff: 'monospace', weight: '600' }}
          >
            <Button variant="outline">Command palette</Button>
          </Tooltip>
        </Row>
      </Column>

      <Column gap="sm">
        <Text size="sm" colorVariant="muted">
          Uppercase tracked tooltip
        </Text>
        <Row gap="md">
          <Tooltip
            label="Premium feature"
            position="top"
            labelProps={{ uppercase: true, tracking: 1.2, weight: '700' }}
          >
            <Button variant="outline">Upgrade</Button>
          </Tooltip>
        </Row>
      </Column>
    </Column>
  );
}
