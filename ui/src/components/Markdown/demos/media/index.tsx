import { Markdown, Flex, Card } from '@platform-blocks/ui';

export default function Demo() {
  const content = `# Media in Markdown

## Images

![PlatformBlocks Logo](https://via.placeholder.com/400x200/6366F1/FFFFFF?text=PlatformBlocks+UI)

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

Content below the line.
`;

  return (
    <Flex direction="column" gap={16}>
      <Card p={16} variant="outline">
        <Markdown>{content}</Markdown>
      </Card>
    </Flex>
  );
}
