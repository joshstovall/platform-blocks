import { useState } from 'react';
import { Input, Text, Card, Column, Row } from '@platform-blocks/ui';

export default function Demo() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  return (
    <Column gap={24}>
      <Text variant="h6">Input Layout Options</Text>
      
      <Card padding={16}>
        <Column gap={16}>
          <Text variant="body" weight="medium">Form Layout Example</Text>
          
          <Row gap={12}>
            <Input
              label="First Name"
              placeholder="Enter first name"
              value={firstName}
              onChangeText={setFirstName}
              style={{ flex: 1 }}
            />
            <Input
              label="Last Name"
              placeholder="Enter last name"
              value={lastName}
              onChangeText={setLastName}
              style={{ flex: 1 }}
            />
          </Row>
          
          <Input
            type="email"
            label="Email Address"
            placeholder="Enter your email"
            value={email}
            onChangeText={setEmail}
            fullWidth
          />
          
          <Input
            label="Message"
            placeholder="Enter your message"
            value={message}
            onChangeText={setMessage}
            multiline
            numberOfLines={4}
            fullWidth
          />
        </Column>
      </Card>
      
      <Card padding={16}>
        <Column gap={16}>
          <Text variant="body" weight="medium">Width Controls</Text>
          
          <Input
            label="Default Width"
            placeholder="Default width input"
          />
          
          <Input
            label="Full Width"
            placeholder="Full width input"
            fullWidth
          />
          
          <Input
            label="Custom Width"
            placeholder="300px width"
            style={{ width: 300 }}
          />
          
          <Input
            label="Full Width with Max"
            placeholder="Full width but max 400px"
            fullWidth
            style={{ maxWidth: 400 }}
          />
        </Column>
      </Card>
    </Column>
  );
}


