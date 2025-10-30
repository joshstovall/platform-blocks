import { Text, Column, Card } from '@platform-blocks/ui';

export default function Demo() {
  return (
    <Column gap={24}>
      <Text variant="h6">Text Weights</Text>
      
      <Card padding={16}>
        <Column gap={12}>
          <Text variant="body" weight="medium">Font Weight Options</Text>
          <Text weight="light">Light weight text</Text>
          <Text weight="normal">Normal weight text (default)</Text>
          <Text weight="medium">Medium weight text</Text>
          <Text weight="semibold">Semibold weight text</Text>
          <Text weight="bold">Bold weight text</Text>
          <Text weight="black">Black weight text</Text>
        </Column>
      </Card>
      
      <Card padding={16}>
        <Column gap={12}>
          <Text variant="body" weight="medium">Numeric Weights</Text>
          <Text weight="100">Weight 100 (Thin)</Text>
          <Text weight="300">Weight 300 (Light)</Text>
          <Text weight="400">Weight 400 (Normal)</Text>
          <Text weight="600">Weight 600 (Semibold)</Text>
          <Text weight="700">Weight 700 (Bold)</Text>
          <Text weight="900">Weight 900 (Black)</Text>
        </Column>
      </Card>
    </Column>
  );
}


