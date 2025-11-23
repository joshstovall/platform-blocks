import { Markdown, Card, Text } from '@platform-blocks/ui';

export default function Demo() {
  const customComponents = {
    h1: ({ children, ...props }: any) => (
      <Text size="xl" weight="bold" color="primary" mb={12} {...props}>
        {children}
      </Text>
    ),
    h2: ({ children, ...props }: any) => (
      <Text size="lg" weight="semibold" color="accent" mb={8} {...props}>
        {children}
      </Text>
    ),
    p: ({ children, ...props }: any) => (
      <Text size="md" mb={8} {...props}>
        {children}
      </Text>
    ),
    blockquote: ({ children, ...props }: any) => (
      <Card p={12} variant="outline" bg="muted" mb={8} {...props}>
        <Text size="sm" style={{ fontStyle: 'italic' }}>
          {children}
        </Text>
      </Card>
    ),
  };

  const content = `# Custom Styled Markdown

## This is a subtitle

This paragraph uses custom styling and components.

> This blockquote is rendered with a custom Card component and muted background.

Regular paragraph text with default styling.
`;

  return <Markdown components={customComponents}>{content}</Markdown>
}
