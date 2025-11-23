import { useState } from 'react';

import { Card, Code, Column, PhoneInput, Text } from '@platform-blocks/ui';

export default function Demo() {
  const [autoDetectValue, setAutoDetectValue] = useState('');
  const [autoDetectFormatted, setAutoDetectFormatted] = useState('');
  const [intlValue, setIntlValue] = useState('');
  const [intlFormatted, setIntlFormatted] = useState('');

  return (
    <Column gap="sm" fullWidth>
      <Text weight="semibold">International detection</Text>
      <Text size="sm" colorVariant="secondary">
        Compare auto-detected formats against a fully manual international mask.
      </Text>

      <Column gap="sm">
        <PhoneInput
          label="Auto-detect format"
          value={autoDetectValue}
          onChange={(raw, formatted) => {
            setAutoDetectValue(raw);
            setAutoDetectFormatted(formatted);
          }}
          autoDetect
          showCountryCode
          placeholder="Try 5551234567, 447911123456, or 33123456789"
        />

        <PhoneInput
          label="Manual international"
          country="INTL"
          value={intlValue}
          onChange={(raw, formatted) => {
            setIntlValue(raw);
            setIntlFormatted(formatted);
          }}
          autoDetect={false}
          showCountryCode={false}
          placeholder="Enter any international number"
        />
      </Column>

      <Card variant="outline" p="sm">
        <Column gap="xs">
          <Text size="xs" colorVariant="secondary">
            Values
          </Text>
          <Code size="sm">
            {JSON.stringify(
              {
                autoDetect: { raw: autoDetectValue, formatted: autoDetectFormatted },
                international: { raw: intlValue, formatted: intlFormatted }
              },
              null,
              2
            )}
          </Code>
        </Column>
      </Card>
    </Column>
  );
}
