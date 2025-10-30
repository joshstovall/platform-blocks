import { useState } from 'react'
import { PhoneInput, Text, Column } from '@platform-blocks/ui'

export default function Demo() {
  const [withCountryCode, setWithCountryCode] = useState('')
  const [withoutCountryCode, setWithoutCountryCode] = useState('')
  
  return (
    <Column gap={16}>
      <Text variant="body" colorVariant="secondary">
        Country code display can be toggled on or off.
      </Text>
      
      <Column gap={16}>
        <PhoneInput
          label="With Country Code"
          value={withCountryCode}
          onChange={(raw) => setWithCountryCode(raw)}
          country="US"
          showCountryCode={true}
        />
        
        <PhoneInput
          label="Without Country Code"
          value={withoutCountryCode}
          onChange={(raw) => setWithoutCountryCode(raw)}
          country="US"
          showCountryCode={false}
        />
      </Column>
    </Column>
  )
}
