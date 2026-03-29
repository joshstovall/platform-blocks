import React, { useState } from 'react';
import { Column, DatePicker, Text } from '@platform-blocks/ui';

export default function Demo() {
  const [value, setValue] = useState<[Date | null, Date | null] | null>(null);

  const start = value?.[0];
  const end = value?.[1];

  return (
    <Column gap="sm" fullWidth>
      <DatePicker
        type="range"
        value={value}
        onChange={(next) => setValue(next as [Date | null, Date | null] | null)}
        calendarProps={{ numberOfMonths: 2, withCellSpacing: true }}
      />
      <Text size="sm" colorVariant="secondary">
        {start && end
          ? `${start.toLocaleDateString()} – ${end.toLocaleDateString()}`
          : 'Select a start and end date'}
      </Text>
    </Column>
  );
}
