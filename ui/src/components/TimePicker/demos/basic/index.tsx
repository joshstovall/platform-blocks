import React, { useState } from 'react';
import { Column, Text, TimePicker } from '@platform-blocks/ui';
import type { TimePickerValue } from '@platform-blocks/ui';

export default function BasicTimePickerDemo() {
  const [value, setValue] = useState<TimePickerValue | null>({ hours: 13, minutes: 30, seconds: 0 });

  const formatted = value
    ? `${String(value.hours).padStart(2, '0')}:${String(value.minutes).padStart(2, '0')}`
    : null;

  return (
    <Column gap="xs" fullWidth>
      <TimePicker
        value={value}
        onChange={setValue}
        label="Time"
        helperText="24-hour format"
        clearable
        fullWidth
      />
      {formatted && (
        <Text size="sm" colorVariant="secondary">{`Selected: ${formatted}`}</Text>
      )}
    </Column>
  );
}
