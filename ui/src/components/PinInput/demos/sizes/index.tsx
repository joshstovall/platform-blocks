import { useState } from 'react';
import { PinInput, Text, Card, Column } from '@platform-blocks/ui';

export default function Demo() {
  const [xsValue, setXsValue] = useState('');
  const [smValue, setSmValue] = useState('');
  const [mdValue, setMdValue] = useState('');
  const [lgValue, setLgValue] = useState('');

  return (
    <Column gap={24}>
      <Text variant="h6">PIN Input Sizes</Text>
      
      <Card padding={16}>
        <Column gap={16}>
          <Text variant="body" weight="medium">Extra Small (xs)</Text>
          <PinInput
            value={xsValue}
            onChange={setXsValue}
            size="xs"
          />
        </Column>
      </Card>
      
      <Card padding={16}>
        <Column gap={16}>
          <Text variant="body" weight="medium">Small (sm)</Text>
          <PinInput
            value={smValue}
            onChange={setSmValue}
            size="sm"
          />
        </Column>
      </Card>
      
      <Card padding={16}>
        <Column gap={16}>
          <Text variant="body" weight="medium">Medium (md) - Default</Text>
          <PinInput
            value={mdValue}
            onChange={setMdValue}
            size="md"
          />
        </Column>
      </Card>
      
      <Card padding={16}>
        <Column gap={16}>
          <Text variant="body" weight="medium">Large (lg)</Text>
          <PinInput
            value={lgValue}
            onChange={setLgValue}
            size="lg"
          />
        </Column>
      </Card>
    </Column>
  );
}


