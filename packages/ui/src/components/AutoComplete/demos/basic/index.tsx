import { useMemo, useState } from 'react';

import { AutoComplete, Column, Text } from '@platform-blocks/ui';
import type { AutoCompleteOption } from '../../types';

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
  { label: 'Hockey', value: 'hockey' },
];

export default function Demo() {
  const [inputValue, setInputValue] = useState('');
  const [selectedSport, setSelectedSport] = useState<AutoCompleteOption | null>(null);

  const displayValue = useMemo(() => selectedSport?.label ?? inputValue, [selectedSport, inputValue]);

  return (
    <Column gap="sm" fullWidth>
      <Text weight="semibold">Basic auto-complete</Text>
      <Text size="sm" colorVariant="secondary">
        Start typing to filter the list of sports. Selecting an option fills the input.
      </Text>
      <AutoComplete
        label="Choose a sport"
        placeholder="Search for a sport..."
        data={sports}
        value={displayValue}
        onChangeText={(value) => {
          setInputValue(value);
          if (!value) setSelectedSport(null);
        }}
        onSelect={(item) => {
          setSelectedSport(item);
          setInputValue(item.label);
        }}
        displayProperty="label"
        minSearchLength={1}
        fullWidth
      />
      {selectedSport && (
        <Text size="xs" colorVariant="secondary">
          Selected: {selectedSport.label}
        </Text>
      )}
    </Column>
  );
}
