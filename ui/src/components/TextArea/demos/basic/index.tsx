import { useState } from 'react';
import { Text, Card, Column, TextArea } from '@platform-blocks/ui';

export default function Demo() {
  const [value, setValue] = useState('');

  return (
      <Column fullWidth>
        <TextArea
          label="Message"
          placeholder="Enter your message here..."
          value={value}
          onChangeText={setValue}
          // rows={4}
          description="Please provide a detailed message."
          error={value.length > 100 ? 'Message is too long!' : undefined}
          fullWidth
        />
        {value && (
          <Text variant="caption" colorVariant="secondary">
            Character count: {value.length}
          </Text>
        )}
      </Column>
  );
}