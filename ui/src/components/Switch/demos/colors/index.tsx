import { useState } from 'react';
import { Switch, Text, Column, Card, Row } from '@platform-blocks/ui';

export default function Demo() {
  const [primarySwitch, setPrimarySwitch] = useState(true);
  const [secondarySwitch, setSecondarySwitch] = useState(true);
  const [successSwitch, setSuccessSwitch] = useState(true);
  const [errorSwitch, setErrorSwitch] = useState(true);

  return (
      
      <Card padding={16}>
          <Text variant="body" weight="medium">Side by Side Comparison</Text>
          <Row gap={16} wrap="wrap">
            <Switch checked={true} label="Primary" color="primary" />
            <Switch checked={true} label="Secondary" color="secondary" />
            <Switch checked={true} label="Success" color="success" />
            <Switch checked={true} label="Error" color="error" />
          </Row>
      </Card>
  );
}


