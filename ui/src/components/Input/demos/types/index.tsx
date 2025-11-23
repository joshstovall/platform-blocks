import { useState } from 'react';
import { Column, Input, Text } from '@platform-blocks/ui';

export default function Demo() {
  const [textValue, setTextValue] = useState('');
  const [emailValue, setEmailValue] = useState('');
  const [passwordValue, setPasswordValue] = useState('');
  const [numberValue, setNumberValue] = useState('');
  const [telValue, setTelValue] = useState('');

  return (
    <Column gap="lg">
      <Text weight="semibold">Input types</Text>

      <Column gap="sm">
        <Text size="sm" weight="semibold">
          Text input
        </Text>
        <Input
          type="text"
          label="Full name"
          placeholder="Enter your full name"
          value={textValue}
          onChangeText={setTextValue}
        />
      </Column>

      <Column gap="sm">
        <Text size="sm" weight="semibold">
          Email input
        </Text>
        <Input
          type="email"
          label="Email address"
          placeholder="user@example.com"
          value={emailValue}
          onChangeText={setEmailValue}
        />
      </Column>

      <Column gap="sm">
        <Text size="sm" weight="semibold">
          Password input
        </Text>
        <Input
          type="password"
          label="Password"
          placeholder="Enter your password"
          value={passwordValue}
          onChangeText={setPasswordValue}
        />
      </Column>

      <Column gap="sm">
        <Text size="sm" weight="semibold">
          Number input
        </Text>
        <Input
          type="number"
          label="Age"
          placeholder="Enter your age"
          value={numberValue}
          onChangeText={setNumberValue}
        />
      </Column>

      <Column gap="sm">
        <Text size="sm" weight="semibold">
          Phone input
        </Text>
        <Input
          type="tel"
          label="Phone number"
          placeholder="+1 (555) 123-4567"
          value={telValue}
          onChangeText={setTelValue}
        />
      </Column>
    </Column>
  );
}


