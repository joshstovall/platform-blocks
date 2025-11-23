import { Markdown, Flex, Card } from '@platform-blocks/ui';

export default function Demo() {
  const content = `# Table Examples

## Basic Table

| Name | Age | City |
|------|-----|------|
| John Doe | 30 | New York |
| Jane Smith | 25 | Los Angeles |
| Bob Johnson | 35 | Chicago |

## Table with Formatting

| Feature | Status | **Priority** | Notes |
|---------|--------|-------------|--------|
| Authentication | ✅ | **High** | _Complete_ |
| User Management | 🔄 | **Medium** | In progress |
| Analytics | ❌ | **Low** | \`Not started\` |
| API Integration | ✅ | **High** | [Documentation](https://example.com) |

## Table with Code

| Language | Extension | Sample Code |
|----------|-----------|-------------|
| TypeScript | \`.tsx\` | \`const x: string = "hello";\` |
| JavaScript | \`.js\` | \`function hello() { return "world"; }\` |
| Python | \`.py\` | \`def hello(): return "world"\` |

## Complex Table

| Component | **Props** | _Description_ | Example |
|-----------|----------|-------------|---------|
| Button | \`variant\`, \`size\`, \`disabled\` | Interactive button element | \`<Button variant="filled">Click me</Button>\` |
| Input | \`placeholder\`, \`value\`, \`onChange\` | Text input field | \`<Input placeholder="Enter text" />\` |
| Card | \`variant\`, \`padding\` | Container component | \`<Card variant="outline">Content</Card>\` |
`;

  return <Markdown>{content}</Markdown>
}
