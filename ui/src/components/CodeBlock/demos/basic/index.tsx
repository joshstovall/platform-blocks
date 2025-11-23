import { CodeBlock, Column, Text } from '@platform-blocks/ui';

const sample = `import { View, Text } from 'react-native';

export function HelloWorld() {
  return (
    <View>
      <Text>Hello, World!</Text>
    </View>
  );
}`;

export default function Demo() {
  return (
    <Column gap="sm" fullWidth>
      <Text weight="semibold">Basic code block</Text>
      <Text size="sm" colorVariant="secondary">
        The default CodeBlock renders formatted code with copy support and automatic language detection.
      </Text>
      <CodeBlock language="tsx">{sample}</CodeBlock>
    </Column>
  );
}
