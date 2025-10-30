import { CodeBlock } from '../../index';

export default function BasicCodeBlockDemo() {
  return (
    <CodeBlock>
      {`import React from 'react';
import { View, Text } from 'react-native';

export const HelloWorld = () => {
  return (
    <View>
      <Text>Hello, World!</Text>
    </View>
  );
};`}
    </CodeBlock>
  );
}
