import { Markdown } from '@platform-blocks/ui';

export default function Demo() {
  const content = `# Media in Markdown

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

Content below the line.
`;

  return <Markdown>{content}</Markdown>
}
