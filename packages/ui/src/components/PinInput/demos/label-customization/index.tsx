import { useState } from 'react';
import { Column, PinInput, Text } from '@platform-blocks/ui';

export default function Demo() {
  const [a, setA] = useState('');
  const [b, setB] = useState('');
  const [c, setC] = useState('');

  return (
    <Column gap="lg">
      <Text weight="semibold">labelProps & descriptionProps</Text>

      <Column gap="sm">
        <PinInput
          length={6}
          value={a}
          onChange={setA}
          label="One-time code"
          description="Sent to the email on file"
          oneTimeCode
          labelProps={{ weight: '700' }}
          descriptionProps={{ size: 'xs', colorVariant: 'muted' }}
        />
      </Column>

      <Column gap="sm">
        <PinInput
          length={4}
          value={b}
          onChange={setB}
          label="Vault PIN"
          description="Required every 24h"
          mask
          labelProps={{ ff: 'monospace', uppercase: true, tracking: 1, size: 'xs' }}
          descriptionProps={{ size: 'xs', colorVariant: 'muted' }}
        />
      </Column>

      <Column gap="sm">
        <PinInput
          length={6}
          value={c}
          onChange={setC}
          label="Recovery key"
          description="Save this somewhere safe"
          required
          labelProps={{ ff: 'Georgia, serif', size: 'lg' }}
          descriptionProps={{ size: 'xs', colorVariant: 'warning' }}
        />
      </Column>
    </Column>
  );
}
