import React, { useState } from 'react';
import {
  AutoComplete,
  Column,
  Text,
  Icon,
  Chip,
  Block,
  Divider,
} from '@platform-blocks/ui';
import type { AutoCompleteOption } from '../../types';

export default function MultiAutoCompleteDemo() {
  const [selectedGenres, setSelectedGenres] = useState<AutoCompleteOption[]>([]);
  const [inputValue, setInputValue] = useState('');
  
  const musicGenres: AutoCompleteOption[] = [
    { label: 'Pop', value: 'pop' },
    { label: 'Rock', value: 'rock' },
    { label: 'Hip Hop', value: 'hiphop' },
    { label: 'Jazz', value: 'jazz' },
    { label: 'Classical', value: 'classical' },
    { label: 'Electronic', value: 'electronic' },
    { label: 'Country', value: 'country' },
    { label: 'R&B', value: 'rnb' },
  ];
  
  // Include all genres (don't filter out selected ones for multi-select)
  const availableGenres = [...musicGenres];
  
  const handleSelect = (item: AutoCompleteOption) => {
    const isSelected = selectedGenres.find(genre => genre.value === item.value);
    
    if (isSelected) {
      // Remove if already selected (toggle behavior)
      setSelectedGenres(selectedGenres.filter(genre => genre.value !== item.value));
    } else {
      // Add if not selected
      setSelectedGenres([...selectedGenres, item]);
    }
  };
  
  return (
    <Column gap="lg">
      <AutoComplete
        placeholder="Search music genres..."
        data={availableGenres}
        value={inputValue}
        onChangeText={setInputValue}
        onSelect={handleSelect}
        multiSelect
        selectedValues={selectedGenres}
        clearable
        onClear={() => {
          setSelectedGenres([]);
          setInputValue('');
        }}
        selectedValuesContainerStyle={{ flexWrap: 'wrap' }}
        renderSelectedValue={(item, _index, { onRemove, source }) => (
          <Chip
            size="sm"
            variant="filled"
            color={source === 'modal' ? 'primary' : 'secondary'}
            startIcon={<Icon name="music" size={12} color="#fff" />}
            onRemove={onRemove}
            style={{ marginRight: 8, marginBottom: 6 }}
          >
            {item.label}
          </Chip>
        )}
        renderItem={(item: AutoCompleteOption, index: number) => {
          const isSelected = selectedGenres.find(genre => genre.value === item.value);
          const isLastItem = index === availableGenres.length - 1;

          return (
            <Column>
              <Block
                direction="row"
                align="center"
                justify="space-between"
                px="md"
                py="sm"
                bg={isSelected ? '#f0f9ff' : undefined}
              >
                <Text
                  weight={isSelected ? 'semibold' : 'normal'}
                  color={isSelected ? '#1e40af' : '#374151'}
                >
                  {item.label}
                </Text>
                {isSelected && (
                  <Icon name="check" size={16} color="#1e40af" />
                )}
              </Block>
              {!isLastItem && <Divider colorVariant="subtle" />}
            </Column>
          );
        }}
        minSearchLength={0}
      />
      
      <Text size="sm" colorVariant="muted">
        Selected {selectedGenres.length} genre(s). Click items to toggle selection.
      </Text>
    </Column>
  );
}
