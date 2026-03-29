import React, { useState } from 'react';
import { Column, MonthPickerInput, Text } from '@platform-blocks/ui';

export default function Demo() {
  const [value, setValue] = useState<Date | null>(null);

  return (
    <Column gap="xs" fullWidth>
      <MonthPickerInput
        value={value}
        onChange={setValue}
        label="Billing cycle"
        placeholder="Select a month"
        clearable
        fullWidth
      />
      <Text size="sm" colorVariant="secondary">
        {value
          ? value.toLocaleDateString(undefined, { month: 'long', year: 'numeric' })
          : 'No month selected'}
      </Text>
    </Column>
  );
}
