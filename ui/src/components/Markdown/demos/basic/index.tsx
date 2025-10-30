import { Markdown, Flex, Card } from '@platform-blocks/ui';

export default function Demo() {
  const content = `# Hello Markdown

This is a **bold** statement and this is _italic_.

- Item one
- Item two
- Item three

> Blockquote with *inline emphasis* and **strong** text.

Inline code: \`const x = 42;\`
`;

  return (
    <Flex direction="column" gap={16}>
      <Card p={16} variant="outline">
        <Markdown>{content}</Markdown>
      </Card>
    </Flex>
  );
}
