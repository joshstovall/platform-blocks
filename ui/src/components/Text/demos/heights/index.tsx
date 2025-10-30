import { Text, Column, Card } from '@platform-blocks/ui';

export default function Demo() {
  const sampleText = 'This is a longer text sample that demonstrates how line height affects the spacing between lines of text. It helps to see the visual differences when text wraps to multiple lines.';

  return (
    <Column gap={24}>
      <Text variant="h6">Text Line Heights</Text>
      
      <Card padding={16}>
        <Column gap={16}>
          <Column gap={8}>
            <Text variant="body" weight="medium">Tight Line Height (1.2)</Text>
            <Text lineHeight={1.2}>{sampleText}</Text>
          </Column>
          
          <Column gap={8}>
            <Text variant="body" weight="medium">Normal Line Height (1.5)</Text>
            <Text lineHeight={1.5}>{sampleText}</Text>
          </Column>
          
          <Column gap={8}>
            <Text variant="body" weight="medium">Relaxed Line Height (1.8)</Text>
            <Text lineHeight={1.8}>{sampleText}</Text>
          </Column>
          
          <Column gap={8}>
            <Text variant="body" weight="medium">Loose Line Height (2.0)</Text>
            <Text lineHeight={2.0}>{sampleText}</Text>
          </Column>
          
          <Column gap={8}>
            <Text variant="body" weight="medium">Absolute Line Height (24px)</Text>
            <Text lineHeight={24}>{sampleText}</Text>
          </Column>
        </Column>
      </Card>
      
      <Card padding={16}>
        <Column gap={12}>
          <Text variant="body" weight="medium">Text Alignment</Text>
          <Text align="left">Left aligned text</Text>
          <Text align="center">Center aligned text</Text>
          <Text align="right">Right aligned text</Text>
          <Text align="justify">Justified text that spreads across the full width of the container when there is enough content to wrap to multiple lines.</Text>
        </Column>
      </Card>
    </Column>
  );
}


