import React, { useState } from 'react';
import { Input, Button, Card, Badge, Select, AutoComplete, ColorPicker, Text, Column, Row } from '@platform-blocks/ui';

export default function Demo() {
  const [inputValue, setInputValue] = useState('Test unified styling');
  const [selectValue, setSelectValue] = useState('option1');
  const [autoCompleteValue, setAutoCompleteValue] = useState('Auto complete test');
  const [colorValue, setColorValue] = useState('#FF6B6B');

  const selectOptions = [
    { label: 'Option 1', value: 'option1' },
    { label: 'Option 2', value: 'option2' },
    { label: 'Option 3', value: 'option3' },
  ];

  const autoCompleteOptions = [
    { label: 'Apple', value: 'apple' },
    { label: 'Banana', value: 'banana' },
    { label: 'Cherry', value: 'cherry' },
  ];

  return (
    <Column gap={24}>
      <Text variant="h5">Unified Styling Migration Demo</Text>
      <Text variant="p" colorVariant="secondary">
        Testing components that have been migrated to use the new unified styling system
      </Text>
      
      <Card variant="outline" padding={16}>
        <Column gap={16}>
          <Text variant="h6">Input Components with New ClearButton</Text>
          
          <Input
            label="Regular Input"
            value={inputValue}
            onChangeText={setInputValue}
            clearable
            helperText="Uses new unified ClearButton component"
          />
          
          <Select
            label="Select Component"
            value={selectValue}
            onChange={setSelectValue}
            options={selectOptions}
            clearable
            helperText="Migrated to use new ClearButton"
          />
          
          <AutoComplete
            label="AutoComplete Component"
            value={autoCompleteValue}
            onChangeText={setAutoCompleteValue}
            data={autoCompleteOptions}
            clearable
            helperText="Also uses new ClearButton"
          />
          
          <ColorPicker
            label="ColorPicker Component"
            value={colorValue}
            onChange={setColorValue}
            clearable
            showInput
          />
        </Column>
      </Card>

      <Card variant="outline" padding={16}>
        <Column gap={16}>
          <Text variant="h6">Components with Design Tokens</Text>
          
          <Row gap={12}>
            <Button variant="filled" size="xs">XS Button</Button>
            <Button variant="filled" size="sm">SM Button</Button>
            <Button variant="filled" size="md">MD Button</Button>
            <Button variant="filled" size="lg">LG Button</Button>
          </Row>
          
          <Row gap={12}>
            <Button variant="outline" size="sm">Outline</Button>
            <Button variant="ghost" size="sm">Ghost</Button>
            <Button variant="filled" size="sm" disabled>Disabled</Button>
          </Row>
          
          <Row gap={12}>
            <Badge variant="filled" size="sm">Badge SM</Badge>
            <Badge variant="filled" size="md">Badge MD</Badge>
            <Badge variant="outline" size="sm">Outline Badge</Badge>
          </Row>
        </Column>
      </Card>

      <Card variant="filled" padding={16}>
        <Column gap={16}>
          <Text variant="h6">Card Variants</Text>
          <Text variant="p">
            This card uses the "filled" variant with design token spacing and shadows.
          </Text>
          
          <Card variant="outline" padding={12}>
            <Text variant="p">Nested card with "outline" variant</Text>
          </Card>
        </Column>
      </Card>

      <Column gap={8}>
        <Text variant="h6">Consistency Test</Text>
        <Text variant="p" colorVariant="secondary">
          All clear buttons should be the same size (14px icons with consistent padding).
          All components of the same size should have matching heights and padding.
          Design tokens ensure visual consistency across the library.
        </Text>
        
        <Row gap={12} style={{ marginTop: 8 }}>
          <Badge variant="filled" color="success">✅ ClearButton Unified</Badge>
          <Badge variant="filled" color="primary">🎨 Design Tokens Applied</Badge>
          <Badge variant="filled" color="secondary">📐 Consistent Sizing</Badge>
        </Row>
      </Column>
    </Column>
  );
}