import { Text, Column, Card } from '@platform-blocks/ui';

export default function Demo() {
  return (
    <Column gap={24}>
      <Text variant="h6">Text Colors</Text>
      
      <Card padding={16}>
        <Column gap={12}>
          <Text variant="body" weight="medium">Color Variants</Text>
          <Text colorVariant="primary">Primary color text</Text>
          <Text colorVariant="secondary">Secondary color text</Text>
          <Text colorVariant="muted">Muted color text</Text>
          <Text colorVariant="disabled">Disabled color text</Text>
          <Text colorVariant="link">Link color text</Text>
        </Column>
      </Card>
      
      <Card padding={16}>
        <Column gap={12}>
          <Text variant="body" weight="medium">Custom Colors</Text>
          <Text color="#ff6b6b">Custom red text</Text>
          <Text color="#4ecdc4">Custom teal text</Text>
          <Text color="#45b7d1">Custom blue text</Text>
          <Text color="#96ceb4">Custom green text</Text>
          <Text color="#feca57">Custom yellow text</Text>
        </Column>
      </Card>
    </Column>
  );
}


