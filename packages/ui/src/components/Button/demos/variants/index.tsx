import { Button, Column, Row } from '@platform-blocks/ui';

export default function Demo() {
  return (
    <Column gap="sm">
      <Row gap="md" wrap="wrap">
        <Button variant="filled">Filled</Button>
        <Button variant="secondary">Secondary</Button>
        <Button variant="outline">Outline</Button>
        <Button variant="gradient">Gradient</Button>
        <Button variant="ghost">Ghost</Button>
        <Button variant="none">Text only</Button>
      </Row>
    </Column>
  );
}