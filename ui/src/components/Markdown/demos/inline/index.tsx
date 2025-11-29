import { Column, Markdown, Text } from '@platform-blocks/ui';

export default function Demo() {
  const inlineContent = 'This is **bold text** and this is *italic text* with `inline code`.';

  return (
    <Column gap="sm" fullWidth>
      <Text size="md">
        Inline markdown: <Markdown>{inlineContent}</Markdown>
      </Text>

      <Text size="md">
        Mix with regular text: Here's some regular text, then <Markdown>**markdown formatting**</Markdown> and
        back to regular.
      </Text>

      <Text size="md">
        Code in context: Use <Markdown>`const x = 42;`</Markdown> to declare a variable.
      </Text>
    </Column>
  );
}
