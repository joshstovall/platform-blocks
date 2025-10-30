import { useState } from 'react';
import { Radio, RadioGroup, Text, Column, Card } from '@platform-blocks/ui';

export default function Demo() {
  const [selectedRadio, setSelectedRadio] = useState('');
  const [selectedGroup, setSelectedGroup] = useState('option2');

  return (
    <Column gap={24}>
      <Text variant="h6">Radio Components</Text>
      
      <Card padding={16}>
        <Column gap={12}>
          <Text variant="body" weight="medium">Individual Radio Buttons</Text>
          <Column gap={8}>
            <Radio
              value="radio1"
              checked={selectedRadio === 'radio1'}
              onChange={setSelectedRadio}
              label="First option"
            />
            <Radio
              value="radio2"
              checked={selectedRadio === 'radio2'}
              onChange={setSelectedRadio}
              label="Second option"
            />
            <Radio
              value="radio3"
              checked={selectedRadio === 'radio3'}
              onChange={setSelectedRadio}
              label="Third option"
            />
          </Column>
        </Column>
      </Card>
      
      <Card padding={16}>
        <Column gap={12}>
          <Text variant="body" weight="medium">Radio Group</Text>
          <RadioGroup
            value={selectedGroup}
            onChange={setSelectedGroup}
            options={[
              { label: 'Option 1', value: 'option1' },
              { label: 'Option 2', value: 'option2' },
              { label: 'Option 3', value: 'option3' },
            ]}
          />
        </Column>
      </Card>
    </Column>
  );
}


