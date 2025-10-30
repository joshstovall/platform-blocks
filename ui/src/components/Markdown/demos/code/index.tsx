import { Markdown, Flex, Card } from '@platform-blocks/ui';

export default function Demo() {
  const content = `# Code Examples

Here's some JavaScript:

\`\`\`javascript
function fibonacci(n) {
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
}
\`\`\`

And some TypeScript:

\`\`\`typescript
interface User {
  id: number;
  name: string;
  email: string;
}

const user: User = {
  id: 1,
  name: "John Doe",
  email: "john@example.com"
};
\`\`\`

Inline code: \`const result = fibonacci(10);\`
`;

  return (
    <Flex direction="column" gap={16}>
      <Card p={16} variant="outline">
        <Markdown>{content}</Markdown>
      </Card>
    </Flex>
  );
}
