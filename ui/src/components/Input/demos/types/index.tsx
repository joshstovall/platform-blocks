import { useState } from 'react';
import { Input, Text, Card, Column } from '@platform-blocks/ui';

export default function Demo() {
  const [textValue, setTextValue] = useState('');
  const [emailValue, setEmailValue] = useState('');
  const [passwordValue, setPasswordValue] = useState('');
  const [numberValue, setNumberValue] = useState('');
  const [telValue, setTelValue] = useState('');

  return (
    <Column gap={24}>
      <Text variant="h6">Input Types</Text>
      
      <Card padding={16}>
        <Column gap={16}>
          <Text variant="body" weight="medium">Text Input</Text>
          <Input
            type="text"
            label="Full Name"
            placeholder="Enter your full name"
            value={textValue}
            onChangeText={setTextValue}
          />
        </Column>
      </Card>

      <Card padding={16}>
        <Column gap={16}>
          <Text variant="body" weight="medium">Email Input</Text>
          <Input
            type="email"
            label="Email Address"
            placeholder="user@example.com"
            value={emailValue}
            onChangeText={setEmailValue}
          />
        </Column>
      </Card>

      <Card padding={16}>
        <Column gap={16}>
          <Text variant="body" weight="medium">Password Input</Text>
          <Input
            type="password"
            label="Password"
            placeholder="Enter your password"
            value={passwordValue}
            onChangeText={setPasswordValue}
          />
        </Column>
      </Card>

      <Card padding={16}>
        <Column gap={16}>
          <Text variant="body" weight="medium">Number Input</Text>
          <Input
            type="number"
            label="Age"
            placeholder="Enter your age"
            value={numberValue}
            onChangeText={setNumberValue}
          />
        </Column>
      </Card>

      <Card padding={16}>
        <Column gap={16}>
          <Text variant="body" weight="medium">Phone Input</Text>
          <Input
            type="tel"
            label="Phone Number"
            placeholder="+1 (555) 123-4567"
            value={telValue}
            onChangeText={setTelValue}
          />
        </Column>
      </Card>
    </Column>
  );
}


