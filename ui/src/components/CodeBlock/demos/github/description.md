# GitHub Integration

This demo shows how to add GitHub links to your code blocks using the `githubUrl` prop. When provided, a GitHub button will appear next to the copy button, allowing users to view the source code on GitHub.

## Features

- GitHub button appears in both header and floating positions
- Works with all CodeBlock variants (code, terminal)
- Opens links in new tab on web, opens in browser on mobile
- Maintains existing copy functionality

## Usage

```tsx
<CodeBlock 
  title="My Component"
  githubUrl="https://github.com/user/repo/blob/main/src/component.tsx"
>
  {code}
</CodeBlock>
```
