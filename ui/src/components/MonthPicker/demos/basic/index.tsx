import React, { useState } from 'react';
import { Column, MonthPicker, Text } from '@platform-blocks/ui';

export default function BasicMonthPickerDemo() {
  const [value, setValue] = useState<Date | null>(new Date());

  return (
    <Column gap="xs" fullWidth>
      <MonthPicker value={value} onChange={setValue} monthLabelFormat="long" />
      <Text size="sm" colorVariant="secondary">
        {value
          ? value.toLocaleDateString(undefined, { month: 'long', year: 'numeric' })
          : 'No month selected'}
      </Text>
    </Column>
  );
}
