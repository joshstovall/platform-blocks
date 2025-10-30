import { useState } from 'react';
import { Text, Card, Column, TextArea } from '@platform-blocks/ui';

export default function Demo() {
  const [autoResizeValue, setAutoResizeValue] = useState('Type more text to see auto-resize in action...\n\nAdd multiple lines to see how the textarea grows and shrinks automatically based on content.');
  const [counterValue, setCounterValue] = useState('');
  const [errorValue, setErrorValue] = useState('');

  return (
    <Card padding={16}>
      <Column gap={20}>
        <Text variant="h6">TextArea Features</Text>
        
        {/* Auto Resize */}
        <TextArea
          label="Auto Resize"
          description="Automatically adjusts height based on content"
          placeholder="Start typing to see auto-resize..."
          value={autoResizeValue}
          onChangeText={setAutoResizeValue}
          autoResize={true}
          minRows={2}
          maxRows={6}
        />

        {/* Character Counter */}
        <TextArea
          label="With Character Counter"
          placeholder="Type to see character count (max 100 characters)"
          value={counterValue}
          onChangeText={setCounterValue}
          maxLength={100}
          showCharCounter={true}
          rows={3}
          helperText="Try typing more than 100 characters to see the limit in action"
        />

        {/* Error State */}
        <TextArea
          label="Error State"
          placeholder="This textarea has an error"
          value={errorValue}
          onChangeText={setErrorValue}
          error={errorValue.length > 0 ? undefined : 'This field is required'}
          required={true}
          rows={3}
        />

        {/* Disabled State */}
        <TextArea
          label="Disabled TextArea"
          placeholder="This textarea is disabled"
          value="This textarea is disabled and cannot be edited"
          disabled={true}
          rows={2}
        />

        {/* Required Field */}
        <TextArea
          label="Required Field"
          placeholder="This field is required"
          required={true}
          rows={2}
          helperText="Required fields are marked with an asterisk (*)"
        />
      </Column>
    </Card>
  );
}