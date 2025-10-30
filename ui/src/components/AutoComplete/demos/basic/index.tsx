import React, { useState } from 'react';
import { AutoComplete, Flex, Text } from '@platform-blocks/ui';
import type { AutoCompleteOption } from '../../types';

export default function BasicAutoCompleteDemo() {
  const [inputValue, setInputValue] = useState('');
  const [selectedSport, setSelectedSport] = useState<AutoCompleteOption | null>(null);
  
  const sports: AutoCompleteOption[] = [
    { label: 'Football', value: 'football' },
    { label: 'Basketball', value: 'basketball' },
    { label: 'Soccer', value: 'soccer' },
    { label: 'Baseball', value: 'baseball' },
    { label: 'Tennis', value: 'tennis' },
    { label: 'Golf', value: 'golf' },
    { label: 'Swimming', value: 'swimming' },
    { label: 'Volleyball', value: 'volleyball' },
    { label: 'Cricket', value: 'cricket' },
    { label: 'Rugby', value: 'rugby' },
    { label: 'Softball', value: 'softball' },
    { label: 'Hockey', value: 'hockey' }
  ];
  
  return (
      <AutoComplete
        placeholder="Search for a sport..."
        data={sports}
        value={inputValue}
        onChangeText={setInputValue}
        onSelect={(item) => {
          setSelectedSport(item);
          setInputValue(item.label);
        }}
        displayProperty="value"
        minSearchLength={1}
        fullWidth
        // showSuggestionsOnFocus is now true by default - shows all options when focused
      />
      // {selectedSport && (
      //   <Text size="sm" color="muted">
      //     Selected: {selectedSport.label} ({selectedSport.value})
      //   </Text>
      // )}
      // <Text size="xs" color="muted">
      //   Click on the input to see all available options, then start typing to filter.
      // </Text>
  );
}
