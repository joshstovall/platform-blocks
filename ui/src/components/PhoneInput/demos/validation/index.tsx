import { useState, useMemo } from 'react'
import { PhoneInput, Text, Column } from '@platform-blocks/ui'

export default function Demo() {
  const [raw, setRaw] = useState('')
  const [formatted, setFormatted] = useState('')

  const isValidUS = useMemo(() => {
    const digits = raw.replace(/\D/g, '')
    return digits.length === 10
  }, [raw])

  const isValidInternational = useMemo(() => {
    const digits = raw.replace(/\D/g, '')
    return digits.length >= 7 && digits.length <= 15
  }, [raw])

  return (
    <Column gap={16}>
      <Column gap={8}>
        <PhoneInput
          label="US Phone (10 digits required)"
          value={raw}
          onChange={(rawValue, formattedValue) => {
            setRaw(rawValue)
            setFormatted(formattedValue)
          }}
          country="US"
          showCountryCode={true}
          error={raw.length > 0 && !isValidUS ? 'Please enter a valid 10-digit US phone number' : undefined}
        />
        <Text variant="caption" colorVariant={isValidUS || raw.length === 0 ? 'success' : 'error'}>
          {raw.length === 0 
            ? 'Enter a phone number' 
            : isValidUS 
              ? '✓ Valid US phone number' 
              : `${raw.length}/10 digits entered`
          }
        </Text>
      </Column>

      <Column gap={8}>
        <PhoneInput
          label="International Phone"
          value={raw}
          onChange={(rawValue) => setRaw(rawValue)}
          autoDetect={true}
          showCountryCode={true}
          error={raw.length > 0 && !isValidInternational ? 'Please enter a valid international phone number' : undefined}
        />
        <Text variant="caption" colorVariant={isValidInternational || raw.length === 0 ? 'success' : 'error'}>
          {raw.length === 0 
            ? 'Enter an international phone number' 
            : isValidInternational 
              ? '✓ Valid international format' 
              : 'Phone number should be 7-15 digits'
          }
        </Text>
      </Column>
    </Column>
  )
}
