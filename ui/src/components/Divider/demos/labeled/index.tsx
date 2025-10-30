import { Divider, Column, Text, Chip } from '@platform-blocks/ui';

export default function Demo() {
  return (
    <Column gap={16}>
      <Text variant="body">Sign in to your account</Text>
      
      <Divider label="OR" />
      
      <Text variant="body">Continue with social media</Text>
      
      <Divider 
        label={<Chip size="sm" variant="outline">Settings</Chip>} 
        labelPosition="left" 
      />
      
      <Text variant="body">Account preferences and configuration</Text>
      
      <Divider 
        label="Advanced Options" 
        labelPosition="right" 
        color="#007bff"
      />
      
      <Text variant="body">Developer settings and tools</Text>
    </Column>
  );
}


