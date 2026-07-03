import { useState } from 'react'

import { AutoComplete, Chip, Column, Icon, Text } from '@platform-blocks/ui'
import type { AutoCompleteOption } from '../../types'

const fruitSuggestions: AutoCompleteOption[] = [
  { label: 'Apple', value: 'apple' },
  { label: 'Banana', value: 'banana' },
  { label: 'Orange', value: 'orange' },
  { label: 'Grape', value: 'grape' },
  { label: 'Mango', value: 'mango' },
  { label: 'Pineapple', value: 'pineapple' },
]

export default function Demo() {
  const [inputValue, setInputValue] = useState('')
  const [selected, setSelected] = useState<AutoCompleteOption[]>([])

  const handleToggle = (option: AutoCompleteOption) => {
    const isSelected = selected.some((item) => item.value === option.value)

    setSelected((current) =>
      isSelected
        ? current.filter((item) => item.value !== option.value)
        : [...current, option],
    )
  }

  return (
    <Column gap="sm" fullWidth>
      <AutoComplete
        label="Favorite fruits"
        placeholder="Type a fruit and press Enter..."
        data={fruitSuggestions}
        value={inputValue}
        onChangeText={setInputValue}
        onSelect={handleToggle}
        freeSolo
        multiSelect
        selectedValues={selected}
        minSearchLength={0}
        clearable
        onClear={() => {
          setSelected([])
          setInputValue('')
        }}
        selectedValuesContainerStyle={{ flexWrap: 'wrap', gap: 6 }}
        renderSelectedValue={(item, _index, helpers) => (
          <Chip
            key={item.value}
            size="sm"
            variant="light"
            color="primary"
            endIcon={<Icon name="x" size={8} color="currentColor" />}
            onRemove={helpers.onRemove}
          >
            {item.label}
          </Chip>
        )}
      />
    </Column>
  )
}
