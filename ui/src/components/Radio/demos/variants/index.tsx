import { useState } from 'react';
import { Radio, RadioGroup, Text, Column, Card, Row } from '@platform-blocks/ui';

export default function Demo() {
  const [selectedSize, setSelectedSize] = useState('medium');
  const [selectedColor, setSelectedColor] = useState('primary');

  return (
    <Column gap={24}>
      <Text variant="h6">Radio Variants</Text>
      
      <Card padding={16}>
        <Column gap={12}>
          <Text variant="body" weight="medium">Sizes</Text>
          <RadioGroup
            value={selectedSize}
            onChange={setSelectedSize}
            options={[
              { label: 'Small radio', value: 'small' },
              { label: 'Medium radio', value: 'medium' },
              { label: 'Large radio', value: 'large' },
            ]}
            size="sm"
          />
        </Column>
      </Card>
      
      <Card padding={16}>
        <Column gap={12}>
          <Text variant="body" weight="medium">Colors</Text>
          <Column gap={8}>
            <Radio
              value="primary"
              checked={selectedColor === 'primary'}
              onChange={setSelectedColor}
              label="Primary color"
              color="primary"
            />
            <Radio
              value="secondary"
              checked={selectedColor === 'secondary'}
              onChange={setSelectedColor}
              label="Secondary color"
              color="secondary"
            />
            <Radio
              value="success"
              checked={selectedColor === 'success'}
              onChange={setSelectedColor}
              label="Success color"
              color="success"
            />
            <Radio
              value="error"
              checked={selectedColor === 'error'}
              onChange={setSelectedColor}
              label="Error color"
              color="error"
            />
          </Column>
        </Column>
      </Card>
      
      <Card padding={16}>
        <Column gap={12}>
          <Text variant="body" weight="medium">States</Text>
          <Column gap={8}>
            <Radio
              value="normal"
              checked={true}
              label="Normal state"
            />
            <Radio
              value="disabled"
              disabled={true}
              label="Disabled state"
            />
            <Radio
              value="error-state"
              error="This field has an error"
              label="Error state"
            />
          </Column>
        </Column>
      </Card>
    </Column>
  );
}


