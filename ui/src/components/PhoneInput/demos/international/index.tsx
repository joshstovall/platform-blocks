import { useState } from 'react'
import { PhoneInput, Text, Column, Code, Card } from '@platform-blocks/ui'

export default function Demo() {
  const [autoDetectValue, setAutoDetectValue] = useState('')
  const [autoDetectFormatted, setAutoDetectFormatted] = useState('')
  const [internationalValue, setInternationalValue] = useState('')
  const [internationalFormatted, setInternationalFormatted] = useState('')

  return (
    <Column gap={24}>
      <Text variant="body" colorVariant="secondary">
        Auto-detection analyzes the input to determine the best country format.
      </Text>
      
      <Column gap={16}>
        <PhoneInput
          label="Auto-Detect Format"
          value={autoDetectValue}
          onChange={(raw, formatted) => {
            setAutoDetectValue(raw)
            setAutoDetectFormatted(formatted)
          }}
          autoDetect={true}
          showCountryCode={true}
          placeholder="Try: 5551234567, 447911123456, or 33123456789"
        />
        
        <PhoneInput
          label="International (No Auto-Format)"
          country="INTL"
          value={internationalValue}
          onChange={(raw, formatted) => {
            setInternationalValue(raw)
            setInternationalFormatted(formatted)
          }}
          showCountryCode={false}
          placeholder="Any international number"
        />
      </Column>
      
      <Card variant="outline" p="sm">
        <Text variant="caption" mb="xs" colorVariant="secondary">Values</Text>
        <Code size="sm">
          {JSON.stringify({
            autoDetect: { raw: autoDetectValue, formatted: autoDetectFormatted },
            international: { raw: internationalValue, formatted: internationalFormatted }
          }, null, 2)}
        </Code>
      </Card>
    </Column>
  )
}
