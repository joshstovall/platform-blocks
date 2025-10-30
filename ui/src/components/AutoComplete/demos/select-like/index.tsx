import React, { useState } from 'react';
import { AutoComplete, Flex, Text, Card, Column } from '@platform-blocks/ui';
import type { AutoCompleteOption } from '../../types';

export default function SelectLikeAutoCompleteDemo() {
  const [inputValue, setInputValue] = useState('');
  const [selectedCountry, setSelectedCountry] = useState<AutoCompleteOption | null>(null);
  
  const countries: AutoCompleteOption[] = [
    { label: 'United States', value: 'us' },
    { label: 'Canada', value: 'ca' },
    { label: 'United Kingdom', value: 'uk' },
    { label: 'Germany', value: 'de' },
    { label: 'France', value: 'fr' },
    { label: 'Italy', value: 'it' },
    { label: 'Spain', value: 'es' },
    { label: 'Netherlands', value: 'nl' },
    { label: 'Australia', value: 'au' },
    { label: 'Japan', value: 'jp' },
    { label: 'South Korea', value: 'kr' },
    { label: 'Brazil', value: 'br' },
    { label: 'Mexico', value: 'mx' },
    { label: 'India', value: 'in' },
    { label: 'China', value: 'cn' }
  ];
  
  return (
    <Card>
      <Column gap={16}>
        <Text size="lg" weight="semibold">Select-Like AutoComplete</Text>
        
          <AutoComplete
            label="Country"
            placeholder="Select or search for a country..."
            data={countries}
            value={inputValue}
            onChangeText={setInputValue}
            onSelect={(item) => {
              setSelectedCountry(item);
              setInputValue(item.label);
            }}
            displayProperty="label"
            minSearchLength={0} // Allow searching with any input length
            maxSuggestions={8}  // Limit displayed options
          />
          
          {selectedCountry && (
            <Text size="sm" color="muted">
              Selected: {selectedCountry.label} ({selectedCountry.value})
            </Text>
          )}
        
        <Text size="sm" color="#666">
          This AutoComplete behaves like a Select dropdown when clicked - it shows all available options.
          Start typing to filter the list, or use arrow keys to navigate.
        </Text>
      </Column>
    </Card>
  );
}