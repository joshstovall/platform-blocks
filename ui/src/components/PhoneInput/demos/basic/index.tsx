import { useState } from 'react'
import { PhoneInput, Text, Column, Code, Card } from '@platform-blocks/ui'

export default function Demo() {
  const [raw, setRaw] = useState('')
  const [formatted, setFormatted] = useState('')

  return (
    <Column gap={16}>
      <PhoneInput
        label="Phone Number"
        value={raw}
        onChange={(rawDigits, formattedDisplay) => {
          setRaw(rawDigits)
          setFormatted(formattedDisplay)
        }}
        country="US"
        showCountryCode={true}
      />
      <Card variant="outline" p="sm">
        <Text variant="caption" mb="xs" colorVariant="secondary">Values</Text>
        <Code>{JSON.stringify({ raw, formatted }, null, 2)}</Code>
      </Card>
    </Column>
  )
}
