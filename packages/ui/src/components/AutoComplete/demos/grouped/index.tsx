import { useState } from 'react'

import { AutoComplete, Column, Text } from '@platform-blocks/ui'
import type { AutoCompleteOption } from '../../types'

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
]

export default function Demo() {
  const [value, setValue] = useState('')
  const [selectedCountry, setSelectedCountry] = useState<AutoCompleteOption | null>(null)

  return (
    <Column gap="sm" fullWidth>
      <Text weight="semibold">Grouped suggestions</Text>
      <Text size="sm" colorVariant="secondary">
        Countries are organized by region to make large lists easier to scan.
      </Text>
      <AutoComplete
        label="Search countries"
        placeholder="Search for a country..."
        data={countries}
        value={value}
        onChangeText={(next) => {
          setValue(next)
          if (!next) setSelectedCountry(null)
        }}
        onSelect={(item) => {
          setSelectedCountry(item)
          setValue(item.label)
        }}
        minSearchLength={1}
        highlightMatches
        fullWidth
      />
      {selectedCountry && (
        <Text size="xs" colorVariant="secondary">
          Selected: {selectedCountry.label}
        </Text>
      )}
    </Column>
  )
}
