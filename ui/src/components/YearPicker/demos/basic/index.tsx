import React, { useState } from 'react';
import { Column, Text, YearPicker } from '@platform-blocks/ui';

export default function BasicYearPickerDemo() {
  const [value, setValue] = useState<Date | null>(new Date());

  return (
    <Column gap="xs" fullWidth>
      <YearPicker value={value} onChange={setValue} totalYears={20} />
      <Text size="sm" colorVariant="secondary">
        {value ? `Selected: ${value.getFullYear()}` : 'No year selected'}
      </Text>
    </Column>
  );
}
