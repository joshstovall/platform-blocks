import { useState } from 'react'

import { AutoComplete, Column, Text } from '@platform-blocks/ui'
import type { AutoCompleteOption } from '../../types'

const fruitSuggestions: AutoCompleteOption[] = [
  { label: 'Apple', value: 'apple' },
  { label: 'Banana', value: 'banana' },
  { label: 'Orange', value: 'orange' },
  { label: 'Grape', value: 'grape' },
]

export default function Demo() {
  const [value, setValue] = useState('')

  return (
    <Column gap="sm" fullWidth>
      <Text weight="semibold">Free-form entry</Text>
      <Text size="sm" colorVariant="secondary">
        Suggests fruits but allows any custom value to be submitted.
      </Text>
      <AutoComplete
        label="Favorite fruit"
        placeholder="Type anything..."
        data={fruitSuggestions}
        value={value}
        onChangeText={setValue}
        onSelect={(item) => setValue(item.label)}
        freeSolo
        minSearchLength={0}
        fullWidth
      />
      <Text size="xs" colorVariant="secondary">
        Current value: {value || '(empty)'}
      </Text>
    </Column>
  )
}
