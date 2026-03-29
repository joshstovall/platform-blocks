import React, { useState } from 'react';
import { Column, Text, TimePicker } from '@platform-blocks/ui';
import type { TimePickerValue } from '@platform-blocks/ui';

export default function Format12hTimePickerDemo() {
  const [value, setValue] = useState<TimePickerValue | null>({ hours: 0, minutes: 15, seconds: 0 });

  const formatted = value
    ? `${String(value.hours).padStart(2, '0')}:${String(value.minutes).padStart(2, '0')}`
    : null;

  return (
    <Column gap="xs" fullWidth>
      <TimePicker
        value={value}
        onChange={setValue}
        format={12}
        label="Time"
        helperText="12-hour clock with AM/PM"
        clearable
        fullWidth
      />
      {formatted && (
        <Text size="sm" colorVariant="secondary">
          {`Internal (24h): ${formatted}`}
        </Text>
      )}
    </Column>
  );
}
