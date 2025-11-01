import { CodeBlock } from '../../index';

export default function CodeBlockWithGitHubDemo() {
  return (
    <>
      <CodeBlock
        title="Basic Component"
        githubUrl="https://github.com/joshstovall/platform-blocks/blob/main/ui/src/components/Button/Button.tsx"
      >
        {`import { View, Text } from 'react-native';

export const HelloWorld = () => {
  return (
    <View>
      <Text>Hello, World!</Text>
    </View>
  );
};`}
      </CodeBlock>

      <CodeBlock
        fileName="example.tsx"
        githubUrl="https://github.com/joshstovall/platform-blocks/blob/main/ui/src/components/Text/Text.tsx"
        language="tsx"
      >
        {`// This code has both copy and GitHub buttons
const MyComponent = () => {
  return <div>Hello with GitHub button!</div>;
};`}
      </CodeBlock>

      <CodeBlock
        variant="terminal"
        title="Terminal Example"
        githubUrl="https://github.com/joshstovall/platform-blocks/blob/main/docs/scripts/build.sh"
      >
        {`$ npm install platform-blocks
$ npm start
Server running on http://localhost:3000`}
      </CodeBlock>

      <CodeBlock
        githubUrl="https://github.com/joshstovall/platform-blocks/blob/main/ui/src/components/CodeBlock/CodeBlock.tsx"
      >
        {`// Floating buttons example (no title)
const FloatingExample = () => {
  return <span>Hover to see buttons</span>;
};`}
      </CodeBlock>
    </>
  );
}
