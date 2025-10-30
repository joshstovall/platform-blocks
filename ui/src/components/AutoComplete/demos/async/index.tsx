import React, { useState } from 'react';
import { AutoComplete, Flex, Text } from '@platform-blocks/ui';
import type { AutoCompleteOption } from '../../types';

export default function AsyncAutoCompleteDemo() {
  const [inputValue, setInputValue] = useState('');
  const [selectedLang, setSelectedLang] = useState<AutoCompleteOption | null>(null);
  
  const programmingLanguages: AutoCompleteOption[] = [
    { label: 'JavaScript', value: 'javascript' },
    { label: 'TypeScript', value: 'typescript' },
    { label: 'Python', value: 'python' },
    { label: 'Java', value: 'java' },
    { label: 'C++', value: 'cpp' },
    { label: 'C#', value: 'csharp' },
    { label: 'Go', value: 'go' },
    { label: 'Rust', value: 'rust' },
    { label: 'Swift', value: 'swift' },
    { label: 'Kotlin', value: 'kotlin' },
  ];
  
  const searchLanguages = async (query: string): Promise<AutoCompleteOption[]> => {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return programmingLanguages.filter(lang => 
      lang.label.toLowerCase().includes(query.toLowerCase())
    );
  };
  
  return (
    <Flex direction="column" gap={12}>
      <AutoComplete
        placeholder="Search programming languages..."
        onSearch={searchLanguages}
        value={inputValue}
        onChangeText={setInputValue}
        onSelect={(item) => {
          setSelectedLang(item);
          setInputValue(item.label);
        }}
        minSearchLength={2}
        searchDelay={300}
        highlightMatches
      />
      {selectedLang && (
        <Text size="sm" color="muted">
          Selected: {selectedLang.label} ({selectedLang.value})
        </Text>
      )}
    </Flex>
  );
}
