import { useState } from 'react';

import { Card, Code, Column, PhoneInput, Text } from '@platform-blocks/ui';

export default function Demo() {
  const [raw, setRaw] = useState('');
  const [formatted, setFormatted] = useState('');

  return (
    <Column gap="sm" fullWidth>
      <Text weight="semibold">Basic phone input</Text>
      <Text size="sm" colorVariant="secondary">
        Controlled phone field showing both the raw digits and the formatted display value.
      </Text>
      <PhoneInput
        label="Phone number"
        value={raw}
        onChange={(rawDigits, formattedDisplay) => {
          setRaw(rawDigits);
          setFormatted(formattedDisplay);
        }}
        country="US"
        showCountryCode
      />
      <Card variant="outline" p="sm">
        <Column gap="xs">
          <Text size="xs" colorVariant="secondary">
            Current values
          </Text>
          <Code size="sm">{JSON.stringify({ raw, formatted }, null, 2)}</Code>
        </Column>
      </Card>
    </Column>
  );
}
