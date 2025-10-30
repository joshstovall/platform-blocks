import { Divider, Column, Text } from '@platform-blocks/ui';

export default function Demo() {
  return (
    <Column gap={16}>
      <Text variant="h4">Section 1</Text>
      <Text variant="body">Content for the first section with some example text.</Text>
      
      <Divider />
      
      <Text variant="h4">Section 2</Text>
      <Text variant="body">Content for the second section with more example text.</Text>
      
      <Divider variant="dashed" />
      
      <Text variant="h4">Section 3</Text>
      <Text variant="body">Content for the third section with final example text.</Text>
    </Column>
  );
}


