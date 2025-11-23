import { useState } from 'react';

import { Column, Text, TextArea } from '@platform-blocks/ui';

export default function Demo() {
  const [value, setValue] = useState('');

  return (
    <Column gap="sm" fullWidth>
      <Text weight="semibold">Basic text area</Text>
      <Text size="sm" colorVariant="secondary">
        Controlled message field with helper copy and simple max-length feedback.
      </Text>
      <TextArea
        label="Message"
        placeholder="Enter your message"
        value={value}
        onChangeText={setValue}
        description="Provide helpful context for your request."
        error={value.length > 120 ? 'Message is too long. Keep it under 120 characters.' : undefined}
        rows={4}
        fullWidth
      />
      {value && (
        <Text size="xs" colorVariant="secondary">
          Character count: {value.length}
        </Text>
      )}
    </Column>
  );
}