import { Button, Column, Row, Text } from '@platform-blocks/ui';

export default function Demo() {
  return (
    <Column gap="lg">
      <Column gap="sm">
        <Text size="sm" colorVariant="muted">Default label styling</Text>
        <Row gap="sm">
          <Button>Primary</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="ghost">Ghost</Button>
        </Row>
      </Column>

      <Column gap="sm">
        <Text size="sm" colorVariant="muted">Uppercase tracked label</Text>
        <Row gap="sm">
          <Button labelProps={{ uppercase: true, tracking: 1.5, weight: '700', size: 'xs' }}>
            Confirm
          </Button>
          <Button
            variant="outline"
            labelProps={{ uppercase: true, tracking: 1.5, weight: '700', size: 'xs' }}
          >
            Cancel
          </Button>
        </Row>
      </Column>

      <Column gap="sm">
        <Text size="sm" colorVariant="muted">Brand serif (ff shorthand)</Text>
        <Row gap="sm">
          <Button labelProps={{ ff: 'Georgia, serif', size: 'lg', weight: '500' }}>
            Read article
          </Button>
        </Row>
      </Column>

      <Column gap="sm">
        <Text size="sm" colorVariant="muted">Monospace command button</Text>
        <Row gap="sm">
          <Button variant="outline" labelProps={{ ff: 'monospace', weight: '600' }}>
            $ deploy
          </Button>
        </Row>
      </Column>
    </Column>
  );
}
