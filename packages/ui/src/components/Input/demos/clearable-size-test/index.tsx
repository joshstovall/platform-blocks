import { useState } from 'react';

import { Column, Input, Text } from '@platform-blocks/ui';

export default function Demo() {
  const [inputValue, setInputValue] = useState('Test input with clearable button');
  const sizeTokens = ['xs', 'sm', 'md', 'lg', 'xl'] as const;

  return (
    <Column gap="lg">
      <Text weight="semibold">Clearable button sizing</Text>
      <Text size="xs" colorVariant="secondary">
        Compare how the dismiss icon fits across input sizes and alongside other adornments.
      </Text>

      <Column gap="sm">
        <Text size="sm" weight="semibold">
          Size tokens
        </Text>
        <Column gap="xs">
          {sizeTokens.map((token) => (
            <Input
              key={token}
              label={`Input size ${token}`}
              value={inputValue}
              onChangeText={setInputValue}
              clearable
              size={token}
              helperText={`Dismiss icon fits within the ${token.toUpperCase()} trim.`}
            />
          ))}
        </Column>
      </Column>

      <Column gap="sm">
        <Text size="sm" weight="semibold">
          Clearable with extras
        </Text>
        <Input
          label="Email alias"
          value={inputValue}
          onChangeText={setInputValue}
          clearable
          endSection={<Text size="xs" colorVariant="secondary">@domain.com</Text>}
          helperText="Clear button and right content share the same height."
        />
        <Input
          label="Password"
          type="password"
          value={inputValue}
          onChangeText={setInputValue}
          clearable
          helperText="Visibility toggle coexists with the dismiss control."
        />
      </Column>

      <Column gap="sm">
        <Text size="sm" weight="semibold">
          Height comparison
        </Text>
        <Input
          label="Baseline"
          value={inputValue}
          onChangeText={setInputValue}
          clearable={false}
          helperText="Standard input height without additional controls."
        />
        <Input
          label="With clear button"
          value={inputValue}
          onChangeText={setInputValue}
          clearable
          helperText="Remains the same height when dismissal is enabled."
        />
      </Column>
    </Column>
  );
}