import React, { useState } from 'react';
import { Column, DatePicker, Text } from '@platform-blocks/ui';

export default function Demo() {
  const [value, setValue] = useState<Date | null>(null);

  return (
    <Column gap="sm" fullWidth>
      <DatePicker
        value={value}
        onChange={(next) => setValue(next as Date | null)}
        calendarProps={{ numberOfMonths: 1, highlightToday: true }}
      />
      <Text size="sm" colorVariant="secondary">
        {value ? `Selected: ${value.toLocaleDateString()}` : 'No date selected'}
      </Text>
    </Column>
  );
}
