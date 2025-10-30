import React from 'react';
import { CodeBlock, Flex, Text } from '@platform-blocks/ui';

export default function Demo() {
  const sample = `// Example showcasing highlighted lines\n` +
`import React from 'react';\n` +
`import { View, Text } from 'react-native';\n\n` +
`interface User {\n` +
`  id: number;\n` +
`  name: string; // highlighted\n` +
`  active: boolean;\n` +
`}\n\n` +
`export function UserCard({ user }: { user: User }) {\n` +
`  if (!user.active) {\n` +
`    return null; // early return highlighted\n` +
`  }\n` +
`  return (\n` +
`    <View style={{ padding: 8 }}>\n` +
`      <Text>{user.name}</Text>\n` +
`    </View>\n` +
`  );\n` +
`}\n\n` +
`// Utility function (range highlighted)\n` +
`export function filterActive(users: User[]) {\n` +
`  return users.filter(u => u.active);\n` +
`}\n`;

  return (
    <Flex direction="column" gap={16}>
      <Text variant="body" colorVariant="secondary">
        This demo shows how to highlight specific single lines and ranges using the <code>highlightLines</code> prop.
      </Text>
      <CodeBlock
        title="Highlighted Lines"
        showLineNumbers
        highlightLines={['1', '5-9', '11-14', '22-24']}
      >
        {sample}
      </CodeBlock>
    </Flex>
  );
}
