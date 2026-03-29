import { useState } from 'react'

import { AutoComplete, Column, Text } from '@platform-blocks/ui'
import type { AutoCompleteOption } from '../../types'

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
  { label: 'China', value: 'cn' },
]

export default function Demo() {
  const [inputValue, setInputValue] = useState('')
  const [selectedCountry, setSelectedCountry] = useState<AutoCompleteOption | null>(null)

  return (
    <Column gap="sm" fullWidth>
      <Text weight="semibold">Select-like behaviour</Text>
      <Text size="sm" colorVariant="secondary">
        Opens with the full country list, then filters results as you type.
      </Text>
      <AutoComplete
        label="Country"
        placeholder="Select or search for a country..."
        data={countries}
        value={inputValue}
        onChangeText={(value) => {
          setInputValue(value)
          if (!value) setSelectedCountry(null)
        }}
        onSelect={(item) => {
          setSelectedCountry(item)
          setInputValue(item.label)
        }}
        minSearchLength={0}
        maxSuggestions={8}
        fullWidth
      />
      {selectedCountry && (
        <Text size="xs" colorVariant="secondary">
          Selected: {selectedCountry.label}
        </Text>
      )}
      <Text size="xs" colorVariant="secondary">
        Focus the field to reveal all options; use arrow keys or typing to refine.
      </Text>
    </Column>
  )
}