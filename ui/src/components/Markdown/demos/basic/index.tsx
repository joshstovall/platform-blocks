import { Markdown } from '@platform-blocks/ui';

export default function Demo() {
  const content = `# Hello Markdown

This is a **bold** statement and this is _italic_.

- Item one
- Item two
- Item three

> Blockquote with *inline emphasis* and **strong** text.

Inline code: \`const x = 42;\`
`;
  return <Markdown>{content}</Markdown>
}
