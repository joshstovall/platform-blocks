import { useState } from 'react'

import { AutoComplete, Column, Text } from '@platform-blocks/ui'
import type { AutoCompleteOption } from '../../types'

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
]

const searchLanguages = async (query: string): Promise<AutoCompleteOption[]> => {
  await new Promise((resolve) => setTimeout(resolve, 400))

  const normalized = query.toLowerCase()
  return programmingLanguages.filter((language) =>
    language.label.toLowerCase().includes(normalized),
  )
}

export default function Demo() {
  const [inputValue, setInputValue] = useState('')
  const [selectedLanguage, setSelectedLanguage] = useState<AutoCompleteOption | null>(null)

  return (
    <Column gap="sm" fullWidth>
      <Text weight="semibold">Async auto-complete</Text>
      <Text size="sm" colorVariant="secondary">
        Performs a debounced search against a simulated API before returning matches.
      </Text>
      <AutoComplete
        label="Search programming languages"
        placeholder="Start typing..."
        onSearch={searchLanguages}
        value={inputValue}
        onChangeText={(value) => {
          setInputValue(value)
          if (!value) setSelectedLanguage(null)
        }}
        onSelect={(item) => {
          setSelectedLanguage(item)
          setInputValue(item.label)
        }}
        minSearchLength={2}
        searchDelay={300}
        highlightMatches
        fullWidth
      />
      {selectedLanguage && (
        <Text size="xs" colorVariant="secondary">
          Selected: {selectedLanguage.label}
        </Text>
      )}
    </Column>
  )
}
