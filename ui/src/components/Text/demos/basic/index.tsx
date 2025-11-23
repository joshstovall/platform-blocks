import { Card, Column, Text } from '@platform-blocks/ui';

export default function Demo() {
  return (
    <Column gap="lg">
      <Card p="md">
        <Column gap="xs">
          <Text variant="h1">Heading 1</Text>
          <Text variant="h2">Heading 2</Text>
          <Text variant="h3">Heading 3</Text>
          <Text variant="h4">Heading 4</Text>
          <Text variant="h5">Heading 5</Text>
          <Text variant="h6">Heading 6</Text>
        </Column>
      </Card>

      <Card p="md">
        <Column gap="xs">
          <Text variant="p">Body text is the default variant for paragraphs.</Text>
          <Text variant="small">Caption text keeps supporting details readable.</Text>
          <Text variant="small">Small text works well for fine print or metadata.</Text>
        </Column>
      </Card>

      <Card p="md">
        <Column gap="xs">
          <Text>Default text without a variant falls back to body styling.</Text>
          <Text>
            This paragraph shows natural wrapping behavior when the content spans multiple lines in a layout.
          </Text>
        </Column>
      </Card>
    </Column>
  );
}


