import { useState } from 'react'
import { PhoneInput, Text, Column, Code, Card } from '@platform-blocks/ui'

export default function Demo() {
  const [us, setUs] = useState('')
  const [uk, setUk] = useState('')
  const [fr, setFr] = useState('')
  const [br, setBr] = useState('')

  return (
    <Column gap={24}>
      <Text variant="body" colorVariant="secondary">
        Different country formats with automatic formatting and validation.
      </Text>
      
      <Column gap={16}>
        <PhoneInput
          label="United States"
          country="US"
          value={us}
          onChange={(raw) => setUs(raw)}
          showCountryCode={true}
        />
        
        <PhoneInput
          label="United Kingdom"
          country="UK"
          value={uk}
          onChange={(raw) => setUk(raw)}
          showCountryCode={true}
        />
        
        <PhoneInput
          label="France"
          country="FR"
          value={fr}
          onChange={(raw) => setFr(raw)}
          showCountryCode={true}
        />
        
        <PhoneInput
          label="Brazil"
          country="BR"
          value={br}
          onChange={(raw) => setBr(raw)}
          showCountryCode={true}
        />
      </Column>
      
      <Card variant="outline" p="sm">
        <Text variant="caption" mb="xs" colorVariant="secondary">Raw Values (digits only)</Text>
        <Code size="sm">{JSON.stringify({ us, uk, fr, br }, null, 2)}</Code>
      </Card>
    </Column>
  )
}
