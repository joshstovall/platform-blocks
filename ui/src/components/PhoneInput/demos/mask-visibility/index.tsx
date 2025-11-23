import { useState } from 'react';

import { Column, PhoneInput, Text } from '@platform-blocks/ui';

export default function Demo() {
  const [withCountryCode, setWithCountryCode] = useState('');
  const [withoutCountryCode, setWithoutCountryCode] = useState('');

  return (
    <Column gap="sm" fullWidth>
      <Text weight="semibold">Country code visibility</Text>
      <Text size="sm" colorVariant="secondary">
        Toggle the country prefix while keeping the same underlying digits.
      </Text>

      <Column gap="sm">
        <Column gap="xs">
          <PhoneInput
            label="With country code"
            value={withCountryCode}
            onChange={(raw) => setWithCountryCode(raw)}
            country="US"
            showCountryCode
          />
          <Text size="xs" colorVariant="secondary">
            Raw digits: {withCountryCode || '—'}
          </Text>
        </Column>

        <Column gap="xs">
          <PhoneInput
            label="Without country code"
            value={withoutCountryCode}
            onChange={(raw) => setWithoutCountryCode(raw)}
            country="US"
            showCountryCode={false}
          />
          <Text size="xs" colorVariant="secondary">
            Raw digits: {withoutCountryCode || '—'}
          </Text>
        </Column>
      </Column>
    </Column>
  );
}
