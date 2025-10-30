import React, { useState } from 'react';
import { Input, Text, Card, Column, Row } from '@platform-blocks/ui';

export default function Demo() {
  const [basicValue, setBasicValue] = useState('');
  const [prefillValue, setPrefillValue] = useState('Pre-filled text to clear');
  const [sizeValues, setSizeValues] = useState({
    xs: 'Extra small',
    sm: 'Small text',
    md: 'Medium text',
    lg: 'Large text',
    xl: 'Extra large text'
  });

  return (
    <Column gap={24}>
      <Text variant="h6">Clearable Input Demo</Text>
      
      <Card padding={16}>
        <Column gap={16}>
          <Text variant="body" weight="medium">Basic Clearable Input</Text>
          <Input
            label="Name"
            placeholder="Type something to see clear button"
            value={basicValue}
            onChangeText={setBasicValue}
            clearable
            helperText="Clear button appears when input has text"
          />
        </Column>
      </Card>

      <Card padding={16}>
        <Column gap={16}>
          <Text variant="body" weight="medium">Pre-filled Clearable Input</Text>
          <Input
            label="Description"
            value={prefillValue}
            onChangeText={setPrefillValue}
            clearable
            helperText="This input starts with text and shows clear button"
          />
        </Column>
      </Card>

      <Card padding={16}>
        <Column gap={16}>
          <Text variant="body" weight="medium">Different Sizes with Clear Button</Text>
          <Input
            label="Extra Small (xs)"
            value={sizeValues.xs}
            onChangeText={(text) => setSizeValues(prev => ({ ...prev, xs: text }))}
            clearable
            size="xs"
          />
          <Input
            label="Small (sm)"
            value={sizeValues.sm}
            onChangeText={(text) => setSizeValues(prev => ({ ...prev, sm: text }))}
            clearable
            size="sm"
          />
          <Input
            label="Medium (md)"
            value={sizeValues.md}
            onChangeText={(text) => setSizeValues(prev => ({ ...prev, md: text }))}
            clearable
            size="md"
          />
          <Input
            label="Large (lg)"
            value={sizeValues.lg}
            onChangeText={(text) => setSizeValues(prev => ({ ...prev, lg: text }))}
            clearable
            size="lg"
          />
          <Input
            label="Extra Large (xl)"
            value={sizeValues.xl}
            onChangeText={(text) => setSizeValues(prev => ({ ...prev, xl: text }))}
            clearable
            size="xl"
          />
        </Column>
      </Card>

      <Card padding={16}>
        <Column gap={16}>
          <Text variant="body" weight="medium">With Right Section + Clear Button</Text>
          <Input
            label="Username"
            value={basicValue}
            onChangeText={setBasicValue}
            clearable
            rightSection={<Text style={{ fontSize: 12, color: '#666' }}>@domain.com</Text>}
            helperText="Clear button should not interfere with right section"
          />
        </Column>
      </Card>
    </Column>
  );
}