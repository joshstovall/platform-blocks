import { Card, Text, Button } from '@platform-blocks/ui';

export default function BasicCardDemo() {
  return (
    <Card maxWidth={280}>
      <Text variant="h6" mb="sm">
        Simple Card
      </Text>
      <Text mb="lg">
        This is a basic card with some content and a button.
      </Text>
      <Button size="sm" variant="gradient" onPress={() => console.log('Button pressed!')}>
        Action
      </Button>
    </Card>
  );
}
