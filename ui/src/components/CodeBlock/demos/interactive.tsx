import React, { useState } from 'react';
import { CodeBlock } from '../index';
import { Button, Text, Flex } from '../../index';

export default function InteractiveCodeBlockDemo() {
  const [copiedCode, setCopiedCode] = useState('');

  const handleCopy = (code: string) => {
    setCopiedCode(code);
    // In a real app, you might use Clipboard API or show a toast
    setTimeout(() => setCopiedCode(''), 2000);
  };

  const sampleCode = `const greeting = "Hello, World!";
console.log(greeting);

// A simple function
function add(a, b) {
  return a + b;
}

const result = add(5, 3);
console.log(\`5 + 3 = \${result}\`);`;

  return (
    <Flex direction="column" gap={16}>
      {copiedCode && (
        <Text color="success">
          Copied code to clipboard! (Length: {copiedCode.length} characters)
        </Text>
      )}
      
      <CodeBlock 
        language="javascript"
        title="Interactive Copy Example"
        onCopy={handleCopy}
      >
        {sampleCode}
      </CodeBlock>

      <Button 
        title="Copy Code Manually" 
        variant="outline" 
        onPress={() => handleCopy(sampleCode)} 
      />
    </Flex>
  );
}
