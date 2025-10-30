import { Text, Column, Card } from '@platform-blocks/ui';

export default function Demo() {
  return (
    <Column gap={24}>
      <Text variant="h6">Text Variants</Text>
      
      <Card padding={16}>
        <Column gap={12}>
          <Text variant="h1">Heading 1 - Large title</Text>
          <Text variant="h2">Heading 2 - Section title</Text>
          <Text variant="h3">Heading 3 - Subsection</Text>
          <Text variant="h4">Heading 4 - Minor heading</Text>
          <Text variant="h5">Heading 5 - Small heading</Text>
          <Text variant="h6">Heading 6 - Smallest heading</Text>
        </Column>
      </Card>
      
      <Card padding={16}>
        <Column gap={12}>
          <Text variant="body">Body text - This is the default text variant used for most content.</Text>
          <Text variant="caption">Caption text - Smaller text for captions and secondary information.</Text>
          <Text variant="small">Small text - Used for fine print and secondary information.</Text>
        </Column>
      </Card>
      
      <Card padding={16}>
        <Column gap={8}>
          <Text>Default text without variant specified</Text>
          <Text>Regular paragraph text that flows naturally and can span multiple lines when needed.</Text>
        </Column>
      </Card>
    </Column>
  );
}


