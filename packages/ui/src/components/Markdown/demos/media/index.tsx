import { Column, Markdown, Text } from '@platform-blocks/ui';

const CONTENT = `# Media in Markdown

## Images

![PlatformBlocks Logo](https://github.com/joshstovall/platform-blocks/raw/main/docs/assets/favicon.png)

## Links

Visit the [PlatformBlocks Documentation](https://platform-blocks.com) for more examples.

## Tables

| Feature | Status | Notes |
|---------|--------|-------|
| **Text Formatting** | ✅ | Bold, _italic_, \`code\` |
| Code Blocks | ✅ | Syntax highlighting |
| Tables | ✅ | Responsive layout |
| Images | ✅ | Auto-sizing |
| [Links](https://platform-blocks.com) | ✅ | External navigation |

## Horizontal Rule

Content above the line.

---

Content below the line.`;

export default function Demo() {
  return (
    <Column gap="xs" fullWidth>
      <Markdown>{CONTENT}</Markdown>
      <Text size="sm" colorVariant="secondary">
        Images, links, tables, and horizontal rules render inline
      </Text>
    </Column>
  );
}
