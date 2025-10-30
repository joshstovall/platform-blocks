import { Text, Column, Card } from '@platform-blocks/ui';

export default function Demo() {
  return (
    <Column gap={24}>
      <Text variant="h6">Text Sizes</Text>
      
      <Card padding={16}>
        <Column gap={12}>
          <Text size="xs">Extra small text (xs)</Text>
          <Text size="sm">Small text (sm)</Text>
          <Text size="md">Medium text (md)</Text>
          <Text size="lg">Large text (lg)</Text>
          <Text size="xl">Extra large text (xl)</Text>
          <Text size="2xl">2XL text size</Text>
          <Text size="3xl">3XL text size</Text>
        </Column>
      </Card>
      
      <Card padding={16}>
        <Column gap={12}>
          <Text variant="body" weight="medium">Custom Numeric Sizes</Text>
          <Text size={12}>Text size 12px</Text>
          <Text size={16}>Text size 16px</Text>
          <Text size={20}>Text size 20px</Text>
          <Text size={24}>Text size 24px</Text>
          <Text size={32}>Text size 32px</Text>
        </Column>
      </Card>
    </Column>
  );
}


