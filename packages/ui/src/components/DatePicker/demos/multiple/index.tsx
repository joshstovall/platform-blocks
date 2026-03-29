import React, { useState } from 'react';
import { Column, DatePicker, Text } from '@platform-blocks/ui';

export default function Demo() {
  const [value, setValue] = useState<Date[]>([]);

  return (
    <Column gap="sm" fullWidth>
      <DatePicker
        type="multiple"
        value={value}
        onChange={(next) => setValue((next as Date[]) ?? [])}
        calendarProps={{ numberOfMonths: 2, withCellSpacing: true }}
      />
      <Text size="sm" colorVariant="secondary">
        {value.length > 0
          ? value.map((date) => date.toLocaleDateString()).join(', ')
          : 'Select one or more dates'}
      </Text>
    </Column>
  );
}
