# Markdown Component

A lightweight, customizable Markdown renderer for React Native with no external dependencies.

## Features

- **Typography**: Headings (H1-H6), paragraphs, bold, italic, and inline code
- **Code blocks**: Syntax highlighting support with customizable language
- **Lists**: Both ordered and unordered lists 
- **Blockquotes**: Nested blockquote support
- **Links**: Markdown links (rendered as styled text)
- **Images**: Remote image rendering with accessibility support
- **Tables**: Full table support with responsive layout and inline formatting
- **Horizontal rules**: Thematic breaks (---, ***, ___)
- **Customizable**: Override any component with custom renderers

## Table Support

Tables use standard Markdown syntax:

```markdown
| Header 1 | Header 2 | Header 3 |
|----------|----------|----------|
| Row 1    | Data     | **Bold** |
| Row 2    | _Italic_ | `Code`   |
```

Features:
- Responsive table layout with proper borders
- Support for inline formatting (bold, italic, code, links) within cells
- Header row styling with background color
- Automatic cell sizing and padding

## Usage

```tsx
import { Markdown } from '@platform-blocks/ui';

const content = `
# My Document

## Table Example

| Feature | Status | Notes |
|---------|--------|-------|
| Tables  | ✅     | **Complete** |
| Lists   | ✅     | _Working_ |
| Code    | ✅     | \`Supported\` |
`;

export default function MyComponent() {
  return <Markdown>{content}</Markdown>;
}
```

## Customization

You can override any component renderer:

```tsx
<Markdown
  components={{
    table: ({ headers, rows }) => (
      // Custom table implementation
    ),
    tableCell: ({ children, isHeader }) => (
      // Custom cell implementation  
    )
  }}
>
  {markdownContent}
</Markdown>
```