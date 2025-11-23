import { Button, Column, Row } from '@platform-blocks/ui';

export default function Demo() {
  return (
    <Column gap="sm">
      <Row gap="md" wrap="wrap" align="flex-end">
        <Button size="sm">Small</Button>
        <Button size="md">Medium</Button>
        <Button size="lg">Large</Button>
        <Button size="xl">Extra large</Button>
      </Row>
    </Column>
  );
}