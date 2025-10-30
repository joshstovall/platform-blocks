import React from 'react';
import { Title, Card, Flex, Button } from '@platform-blocks/ui';

export default function ActionTitleDemo() {
  return (
    <Card p="lg">
      <Flex direction="column" gap="lg">
        
        <Title 
          text="Basic with Action"
          action={<Button title="Action" size="sm" />}
        />
        
        <Title 
          text="Underline with Action"
          underline
          action={<Button title="Edit" size="sm" variant="outline" />}
        />
        
        <Title 
          text="Afterline with Action"
          afterline
          action={<Button title="Settings" size="sm" variant="ghost" />}
        />
        
        <Title 
          text="Full Layout"
          underline
          afterline
          action={<Button title="More" size="sm" />}
        />
        
      </Flex>
    </Card>
  );
}