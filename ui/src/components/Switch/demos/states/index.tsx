import { useState } from 'react';
import { Switch, Text, Column, Card } from '@platform-blocks/ui';

export default function Demo() {
  const [normalSwitch, setNormalSwitch] = useState(true);
  const [loadingSwitch, setLoadingSwitch] = useState(false);

  return (
    <Column gap={24}>
      <Text variant="h6">Switch States</Text>
      
      <Card padding={16}>
        <Column gap={16}>
          <Text variant="body" weight="medium">Normal States</Text>
          
          <Switch
            checked={normalSwitch}
            onChange={setNormalSwitch}
            label="Normal switch (on)"
          />
          
          <Switch
            checked={false}
            onChange={() => {}}
            label="Normal switch (off)"
          />
        </Column>
      </Card>
      
      <Card padding={16}>
        <Column gap={16}>
          <Text variant="body" weight="medium">Disabled States</Text>
          
          <Switch
            checked={true}
            disabled={true}
            label="Disabled (on)"
          />
          
          <Switch
            checked={false}
            disabled={true}
            label="Disabled (off)"
          />
        </Column>
      </Card>
      
      <Card padding={16}>
        <Column gap={16}>
          <Text variant="body" weight="medium">Error State</Text>
          
          <Switch
            checked={false}
            onChange={() => {}}
            label="Switch with error"
            error="This setting is required"
          />
        </Column>
      </Card>
      
      <Card padding={16}>
        <Column gap={16}>
          <Text variant="body" weight="medium">With Description</Text>
          
          <Switch
            checked={true}
            onChange={() => {}}
            label="Enable two-factor authentication"
            description="Adds an extra layer of security to your account"
          />
        </Column>
      </Card>
    </Column>
  );
}


