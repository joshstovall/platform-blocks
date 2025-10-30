import { useState } from 'react';
import { PinInput, Text, Card, Column } from '@platform-blocks/ui';

export default function Demo() {
  const [fourDigit, setFourDigit] = useState('');
  const [sixDigit, setSixDigit] = useState('');
  const [eightDigit, setEightDigit] = useState('');

  return (
    <Column gap={24}>
      <Text variant="h6">PIN Input Lengths</Text>
      
      <Card padding={16}>
        <Column gap={16}>
          <Text variant="body" weight="medium">4-Digit PIN (Default)</Text>
          <Text variant="caption" colorVariant="secondary">
            Common for ATM PINs and security codes
          </Text>
          <PinInput
            value={fourDigit}
            onChange={setFourDigit}
            length={4}
            label="4-Digit PIN"
          />
        </Column>
      </Card>
      
      <Card padding={16}>
        <Column gap={16}>
          <Text variant="body" weight="medium">6-Digit Verification</Text>
          <Text variant="caption" colorVariant="secondary">
            Common for SMS verification codes
          </Text>
          <PinInput
            value={sixDigit}
            onChange={setSixDigit}
            length={6}
            label="Verification Code"
          />
        </Column>
      </Card>
      
      <Card padding={16}>
        <Column gap={16}>
          <Text variant="body" weight="medium">8-Digit Code</Text>
          <Text variant="caption" colorVariant="secondary">
            For longer security codes or passwords
          </Text>
          <PinInput
            value={eightDigit}
            onChange={setEightDigit}
            length={8}
            label="Security Code"
          />
        </Column>
      </Card>
    </Column>
  );
}


