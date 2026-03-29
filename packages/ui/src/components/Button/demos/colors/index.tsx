import { Button, Column, Row } from '@platform-blocks/ui';

export default function Demo() {
  return (
    <Column gap="sm">
      <Row gap="md" wrap="wrap">
        <Button colorVariant="primary">Primary</Button>
        <Button colorVariant="secondary">Secondary</Button>
        <Button colorVariant="success">Success</Button>
        <Button colorVariant="warning">Warning</Button>
        <Button colorVariant="error">Error</Button>
      </Row>
    </Column>
  );
}
