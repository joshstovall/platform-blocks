import { useState } from 'react';

import { Column, Input, Row, Text } from '@platform-blocks/ui';

export default function Demo() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  return (
    <Column gap="lg">
      <Text weight="semibold">Input layout options</Text>

      <Column gap="sm">
        <Text size="sm" weight="semibold">
          Form layout example
        </Text>
        <Row gap="sm" wrap="wrap">
          <Column grow={1} minW={220}>
            <Input
              label="First name"
              placeholder="Enter first name"
              value={firstName}
              onChangeText={setFirstName}
              fullWidth
            />
          </Column>
          <Column grow={1} minW={220}>
            <Input
              label="Last name"
              placeholder="Enter last name"
              value={lastName}
              onChangeText={setLastName}
              fullWidth
            />
          </Column>
        </Row>
        <Input
          type="email"
          label="Email address"
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

      <Column gap="sm">
        <Text size="sm" weight="semibold">
          Width controls
        </Text>
        <Input label="Default width" placeholder="Default width input" />
        <Input label="Full width" placeholder="Full width input" fullWidth />
        <Input
          label="Custom width"
          placeholder="300px width"
          style={{ width: 300 }}
        />
        <Input
          label="Full width with max"
          placeholder="Full width but max 400px"
          fullWidth
          style={{ maxWidth: 400 }}
        />
      </Column>
    </Column>
  );
}


