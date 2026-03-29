import { useState } from 'react'

import { AutoComplete, Chip, Column, Icon, Text } from '@platform-blocks/ui'
import type { AutoCompleteOption } from '../../types'

const musicGenres: AutoCompleteOption[] = [
  { label: 'Pop', value: 'pop' },
  { label: 'Rock', value: 'rock' },
  { label: 'Hip Hop', value: 'hiphop' },
  { label: 'Jazz', value: 'jazz' },
  { label: 'Classical', value: 'classical' },
  { label: 'Electronic', value: 'electronic' },
  { label: 'Country', value: 'country' },
  { label: 'R&B', value: 'rnb' },
]

export default function Demo() {
  const [inputValue, setInputValue] = useState('')
  const [selectedGenres, setSelectedGenres] = useState<AutoCompleteOption[]>([])

  const handleToggle = (option: AutoCompleteOption) => {
    const isSelected = selectedGenres.some((genre) => genre.value === option.value)

    setSelectedGenres((current) =>
      isSelected
        ? current.filter((genre) => genre.value !== option.value)
        : [...current, option],
    )
  }

  return (
    <Column gap="sm" fullWidth>
      <Text weight="semibold">Multi-select tags</Text>
      <Text size="sm" colorVariant="secondary">
        Tap an item to add or remove it. Selected genres render as removable chips.
      </Text>
      <AutoComplete
        label="Music genres"
        placeholder="Search genres..."
        data={musicGenres}
        value={inputValue}
        onChangeText={setInputValue}
        onSelect={handleToggle}
        multiSelect
        selectedValues={selectedGenres}
        minSearchLength={0}
        clearable
        onClear={() => {
          setSelectedGenres([])
          setInputValue('')
        }}
  selectedValuesContainerStyle={{ flexWrap: 'wrap', gap: 6 }}
        renderSelectedValue={(item, _index, helpers) => (
          <Chip
            key={item.value}
            size="sm"
            variant="filled"
            color="primary"
            endIcon={<Icon name="x" size={12} color="currentColor" />}
            onRemove={helpers.onRemove}
          >
            {item.label}
          </Chip>
        )}
        fullWidth
      />

      <Text size="xs" colorVariant="secondary">
        Selected {selectedGenres.length} genre{selectedGenres.length === 1 ? '' : 's'}.
      </Text>
    </Column>
  )
}
