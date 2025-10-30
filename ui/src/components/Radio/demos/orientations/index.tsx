import { useState } from 'react';
import { RadioGroup, Text, Column, Card } from '@platform-blocks/ui';

export default function Demo() {
  const [horizontalValue, setHorizontalValue] = useState('html');
  const [verticalValue, setVerticalValue] = useState('beginner');

  return (
    <Column gap={24}>
      <Text variant="h6">Radio Group Orientations</Text>
      
      <Card padding={16}>
        <Column gap={12}>
          <Text variant="body" weight="medium">Horizontal Group</Text>
          <RadioGroup
            orientation="horizontal"
            options={[
              { label: 'HTML', value: 'html' },
              { label: 'CSS', value: 'css' },
              { label: 'JavaScript', value: 'js' },
              { label: 'TypeScript', value: 'ts' },
            ]}
            value={horizontalValue}
            onChange={setHorizontalValue}
            label="Favorite Technology"
          />
        </Column>
      </Card>
      
      <Card padding={16}>
        <Column gap={12}>
          <Text variant="body" weight="medium">Vertical Group</Text>
          <RadioGroup
            orientation="vertical"
            options={[
              { label: 'Beginner', value: 'beginner' },
              { label: 'Intermediate', value: 'intermediate' },
              { label: 'Advanced', value: 'advanced' },
              { label: 'Expert', value: 'expert' },
            ]}
            value={verticalValue}
            onChange={setVerticalValue}
            label="Skill Level"
          />
        </Column>
      </Card>
    </Column>
  );
}


