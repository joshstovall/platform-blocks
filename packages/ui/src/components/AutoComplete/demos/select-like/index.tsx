import { useState } from 'react'
import { AutoComplete } from '@platform-blocks/ui'
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
    <AutoComplete
      label="Country"
      placeholder="Select a country..."
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
      maxSuggestions={countries.length}
      // Select-like: the field is a picker, not a text box. It's non-editable so
      // typing can't change or filter the value — tapping opens the list and the
      // choice is made from it. `filter` still returns every option so reopening
      // after a selection shows the full list again.
      editable={false}
      // No text entry in select-like mode, so suppress the blinking text caret.
      caretHidden
      filter={() => true}
      highlightMatches={false}
      fullWidth
    />
  )
}