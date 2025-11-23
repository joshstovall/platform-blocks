import { useState } from 'react';

import { Column, Input, Text } from '@platform-blocks/ui';

export default function Demo() {
  const [basicValue, setBasicValue] = useState('');
  const [prefillValue, setPrefillValue] = useState('Pre-filled text to clear');
  const sizeTokens = ['xs', 'sm', 'md', 'lg', 'xl'] as const;
  const [sizeValues, setSizeValues] = useState<Record<(typeof sizeTokens)[number], string>>({
    xs: 'Extra small',
    sm: 'Small text',
    md: 'Medium text',
    lg: 'Large text',
    xl: 'Extra large text',
  });

  return (
    <Column gap="lg">
      <Text weight="semibold">Clearable inputs</Text>

      <Column gap="sm">
        <Text size="sm" weight="semibold">
          Basic usage
        </Text>
        <Input
          label="Name"
          placeholder="Type something to see clear button"
          value={basicValue}
          onChangeText={setBasicValue}
          clearable
          helperText="Clear button appears when the field has content."
        />
      </Column>

      <Column gap="sm">
        <Text size="sm" weight="semibold">
          Pre-filled input
        </Text>
        <Input
          label="Description"
          value={prefillValue}
          onChangeText={setPrefillValue}
          clearable
          helperText="Start with a value and allow clearing back to empty."
        />
      </Column>

      <Column gap="sm">
        <Text size="sm" weight="semibold">
          Size variants
        </Text>
        <Column gap="xs">
          {sizeTokens.map((token) => (
            <Input
              key={token}
              label={`Size ${token}`}
              value={sizeValues[token]}
              onChangeText={(text) =>
                setSizeValues((previous) => ({
                  ...previous,
                  [token]: text,
                }))
              }
              clearable
              size={token}
            />
          ))}
        </Column>
      </Column>

      <Column gap="sm">
        <Text size="sm" weight="semibold">
          With right section
        </Text>
        <Input
          label="Username"
          value={basicValue}
          onChangeText={setBasicValue}
          clearable
          endSection={<Text size="xs" colorVariant="secondary">@domain.com</Text>}
          helperText="Clear button renders alongside custom right content."
        />
      </Column>
    </Column>
  );
}