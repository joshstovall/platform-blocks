import React, { useState } from 'react';
import { Column, Text, YearPickerInput } from '@platform-blocks/ui';

export default function BasicYearPickerInputDemo() {
  const [value, setValue] = useState<Date | null>(null);

  return (
    <Column gap="xs" fullWidth>
      <YearPickerInput
        value={value}
        onChange={setValue}
        label="Fiscal year"
        placeholder="Select a year"
        clearable
        fullWidth
      />
      <Text size="sm" colorVariant="secondary">
        {value ? `Selected: ${value.getFullYear()}` : 'No year selected'}
      </Text>
    </Column>
  );
}
