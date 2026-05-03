import { useState } from 'react';
import { Column, Input, Text } from '@platform-blocks/ui';

export default function Demo() {
  const [defaultValue, setDefaultValue] = useState('');
  const [filledValue, setFilledValue] = useState('');
  const [outlineValue, setOutlineValue] = useState('');
  const [unstyledValue, setUnstyledValue] = useState('Inline edit');

  return (
    <Column gap="lg">
      <Text weight="semibold">Input variants</Text>

      <Column gap="sm">
        <Text size="sm" weight="semibold">default</Text>
        <Input
          variant="default"
          label="Email"
          placeholder="user@example.com"
          value={defaultValue}
          onChangeText={setDefaultValue}
        />
      </Column>

      <Column gap="sm">
        <Text size="sm" weight="semibold">filled</Text>
        <Input
          variant="filled"
          label="Email"
          placeholder="user@example.com"
          value={filledValue}
          onChangeText={setFilledValue}
        />
      </Column>

      <Column gap="sm">
        <Text size="sm" weight="semibold">outline</Text>
        <Input
          variant="outline"
          label="Email"
          placeholder="user@example.com"
          value={outlineValue}
          onChangeText={setOutlineValue}
        />
      </Column>

      <Column gap="sm">
        <Text size="sm" weight="semibold">unstyled</Text>
        <Input
          variant="unstyled"
          placeholder="Type to edit inline"
          value={unstyledValue}
          onChangeText={setUnstyledValue}
        />
      </Column>

      <Column gap="sm">
        <Text size="sm" weight="semibold">Variants in error state</Text>
        <Input
          variant="filled"
          label="Filled"
          placeholder="user@example.com"
          error="Invalid email"
        />
        <Input
          variant="outline"
          label="Outline"
          placeholder="user@example.com"
          error="Invalid email"
        />
        <Input
          variant="unstyled"
          placeholder="Unstyled"
          error="Invalid email"
        />
      </Column>
    </Column>
  );
}
