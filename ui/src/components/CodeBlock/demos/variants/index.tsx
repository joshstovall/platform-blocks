import { CodeBlock, Flex, Card, Text } from '@platform-blocks/ui';

const sampleCode = `function hackTheMatrix() {
  const matrix = generateMatrix();
  console.log('Entering the matrix...');
  
  for (let i = 0; i < matrix.length; i++) {
    matrix[i].decrypt();
  }
  
  return 'Welcome to the real world.';
}`;

const terminalCode = `$ npm install platform-blocks
$ cd my-app
$ npm start
Server running on port 3000`;

export default function VariantsCodeBlockDemo() {
  return (
    <Card>
      <Flex direction="column" gap={24}>
        <Text size="lg" weight="semibold">CodeBlock Variants</Text>
        
        <Flex direction="column" gap={16}>
          <Text size="sm" weight="medium">Default Code Block</Text>
          <CodeBlock
            language="javascript"
            title="matrix.js"
            showCopyButton
          >
            {sampleCode}
          </CodeBlock>
        </Flex>
        
        <Flex direction="column" gap={16}>
          <Text size="sm" weight="medium">Terminal Variant</Text>
          <CodeBlock
            variant="terminal"
            title="Terminal"
            showCopyButton
          >
            {terminalCode}
          </CodeBlock>
        </Flex>
        
        <Flex direction="column" gap={16}>
          <Text size="sm" weight="medium">Hacker Variant</Text>
          <CodeBlock
            variant="hacker"
            language="javascript"
            title="hack.exe"
            showCopyButton
          >
            {sampleCode}
          </CodeBlock>
        </Flex>
      </Flex>
    </Card>
  );
}