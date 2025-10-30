import React, { useState } from 'react';
import { AutoComplete, Flex, Text } from '@platform-blocks/ui';
import type { AutoCompleteOption } from '../../types';

export default function FreeSoloAutoCompleteDemo() {
  const [inputValue, setInputValue] = useState('');
  
  const suggestions: AutoCompleteOption[] = [
    { label: 'Apple', value: 'apple' },
    { label: 'Banana', value: 'banana' },
    { label: 'Orange', value: 'orange' },
    { label: 'Grape', value: 'grape' },
  ];
  
  return (
    <Flex direction="column" gap={12}>
      <AutoComplete
        placeholder="Type anything... suggestions or custom values"
        data={suggestions}
        value={inputValue}
        onChangeText={setInputValue}
        onSelect={(item) => setInputValue(item.label)}
        freeSolo
        minSearchLength={0}
      />
      <Text size="sm" color="muted">
        Current value: {inputValue || '(empty)'}
      </Text>
      <Text size="xs" color="muted">
        You can type custom values or select from suggestions.
      </Text>
    </Flex>
  );
}
