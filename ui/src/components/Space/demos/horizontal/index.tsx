import { Row, Space, Button } from '@platform-blocks/ui';

export default function HorizontalSpaceDemo() {
  return (
    <Row align="center">
      <Button size="sm">Primary</Button>
      <Space w="lg" />
      <Button size="sm" variant="secondary">
        Secondary
      </Button>
      <Space w={12} />
      <Button size="sm" variant="ghost">
        Ghost
      </Button>
    </Row>
  );
}
