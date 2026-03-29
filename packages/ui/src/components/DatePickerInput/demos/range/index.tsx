import React, { useState } from 'react';
import { Column, DatePickerInput, Text } from '@platform-blocks/ui';

export default function RangeDatePickerInputDemo() {
  const [value, setValue] = useState<[Date | null, Date | null] | null>(null);

  return (
    <Column gap="xs" fullWidth>
      <DatePickerInput
        type="range"
        value={value}
        onChange={(next) => setValue((next as [Date | null, Date | null]) || null)}
        label="Date range"
        placeholder="Select range"
        closeOnSelect
        fullWidth
      />
      <Text size="sm" colorVariant="secondary">
        {value && value[0] && value[1]
          ? `${value[0].toLocaleDateString()} – ${value[1].toLocaleDateString()}`
          : 'Select a start and end date'}
      </Text>
    </Column>
  );
}
