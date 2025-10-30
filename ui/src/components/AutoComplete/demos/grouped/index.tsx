import React, { useState } from 'react';
import { AutoComplete, Flex, Text } from '@platform-blocks/ui';
import type { AutoCompleteOption } from '../../types';

export default function GroupedAutoCompleteDemo() {
  const [selectedCountry, setSelectedCountry] = useState('');
  
  const countries: AutoCompleteOption[] = [
    { label: 'United States', value: 'us', group: 'North America' },
    { label: 'Canada', value: 'ca', group: 'North America' },
    { label: 'Mexico', value: 'mx', group: 'North America' },
    { label: 'United Kingdom', value: 'uk', group: 'Europe' },
    { label: 'Germany', value: 'de', group: 'Europe' },
    { label: 'France', value: 'fr', group: 'Europe' },
    { label: 'Japan', value: 'jp', group: 'Asia' },
    { label: 'India', value: 'in', group: 'Asia' },
    { label: 'Australia', value: 'au', group: 'Oceania' },
    { label: 'Brazil', value: 'br', group: 'South America' },
  ];
  
  return (
    <Flex direction="column" gap={12}>
      <AutoComplete
        placeholder="Search for a country..."
        data={countries}
        value={selectedCountry}
        onChangeText={setSelectedCountry}
        onSelect={(item) => setSelectedCountry(item.label)}
        minSearchLength={1}
        highlightMatches
      />
      {selectedCountry && (
        <Text size="sm" color="muted">
          Selected: {selectedCountry}
        </Text>
      )}
    </Flex>
  );
}
