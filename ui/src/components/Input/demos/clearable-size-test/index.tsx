import React, { useState } from 'react';
import { Input, Text, Card, Column } from '@platform-blocks/ui';

export default function Demo() {
  const [inputValue, setInputValue] = useState('Test input with clearable button');

  return (
    <Column gap={24}>
      <Text variant="h6">Clearable Button Size Test</Text>
      <Text variant="body" colorVariant="secondary">
        All inputs below have clearable enabled. The clear button should be small enough 
        that it doesn't increase the input height beyond its intended size.
      </Text>
      
      <Card padding={16}>
        <Column gap={16}>
          <Text variant="body" weight="medium">Input Component (Different Sizes)</Text>
          
          <Input
            label="Extra Small Input (xs)"
            value={inputValue}
            onChangeText={setInputValue}
            clearable
            size="xs"
            helperText="minHeight: 32px - Clear button should fit within this height"
          />
          
          <Input
            label="Small Input (sm)"
            value={inputValue}
            onChangeText={setInputValue}
            clearable
            size="sm"
            helperText="minHeight: 36px - Clear button should fit within this height"
          />
          
          <Input
            label="Medium Input (md)"
            value={inputValue}
            onChangeText={setInputValue}
            clearable
            size="md"
            helperText="minHeight: 40px - Clear button should fit within this height"
          />
          
          <Input
            label="Large Input (lg)"
            value={inputValue}
            onChangeText={setInputValue}
            clearable
            size="lg"
            helperText="minHeight: 44px - Clear button should fit within this height"
          />
          
          <Input
            label="Extra Large Input (xl)"
            value={inputValue}
            onChangeText={setInputValue}
            clearable
            size="xl"
            helperText="minHeight: 48px - Clear button should fit within this height"
          />
        </Column>
      </Card>

      <Card padding={16}>
        <Column gap={16}>
          <Text variant="body" weight="medium">With Right Section + Clear Button</Text>
          
          <Input
            label="Input with Right Section + Clear"
            value={inputValue}
            onChangeText={setInputValue}
            clearable
            rightSection={<Text style={{ fontSize: 12, color: '#666' }}>@domain.com</Text>}
            helperText="Clear button should coexist with right section content without growing height"
          />
          
          <Input
            label="Password Input with Clear"
            type="password"
            value={inputValue}
            onChangeText={setInputValue}
            clearable
            helperText="Password input with both visibility toggle and clear button"
          />
        </Column>
      </Card>

      <Card padding={16}>
        <Column gap={16}>
          <Text variant="body" weight="medium">Comparison: With vs Without Clear Button</Text>
          
          <Input
            label="Without Clear Button"
            value={inputValue}
            onChangeText={setInputValue}
            clearable={false}
            helperText="Standard input height (baseline)"
          />
          
          <Input
            label="With Clear Button"
            value={inputValue}
            onChangeText={setInputValue}
            clearable
            helperText="Should be exactly the same height as above"
          />
        </Column>
      </Card>
    </Column>
  );
}